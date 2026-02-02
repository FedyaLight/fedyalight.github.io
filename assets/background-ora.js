class OraBackground {
    constructor() {
        this.canvas = document.getElementById('bg-canvas');
        this.noiseCanvas = document.getElementById('noise-canvas');
        if (!this.canvas || !this.noiseCanvas) return;

        this.gl = this.canvas.getContext('webgl');
        this.noiseCtx = this.noiseCanvas.getContext('2d');

        // Randomized start time for unique background on each load
        this.startTime = Math.random() * 100000;
        this.lastTime = 0;

        this.initWebGL();
        this.initNoise();
        this.resize();

        window.addEventListener('resize', () => {
            this.resize();
            this.renderStatic();
        });

        // Render twice to ensure shaders are applied and noise is updated, then stop
        this.renderStatic();
    }

    initWebGL() {
        const vs = `
            attribute vec2 position;
            void main() { gl_Position = vec4(position, 0.0, 1.0); }
        `;

        const fs = `
            precision mediump float;
            uniform float uTime;
            uniform vec2 uResolution;

            // Ora Browser Colors 
            const vec3 orange = vec3(0.83, 0.36, 0.0); // #D45D00
            const vec3 blue = vec3(0.0, 0.44, 0.95);   // #0070F3
            const vec3 black = vec3(0.02, 0.02, 0.02); // Deep space black

            // 3D Simplex-like noise for organic flow
            vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
            vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

            float snoise(vec2 v) {
                const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
                vec2 i  = floor(v + dot(v, C.yy));
                vec2 x0 = v - i + dot(i, C.xx);
                vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                vec4 x12 = x0.xyxy + C.xxzz;
                x12.xy -= i1;
                i = mod289(i);
                vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
                vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
                m = m*m; m = m*m;
                vec3 x = 2.0 * fract(p * C.www) - 1.0;
                vec3 h = abs(x) - 0.5;
                vec3 ox = floor(x + 0.5);
                vec3 a0 = x - ox;
                m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
                vec3 g;
                g.x  = a0.x  * x0.x  + h.x  * x0.y;
                g.yz = a0.yz * x12.xz + h.yz * x12.yw;
                return 130.0 * dot(m, g);
            }

            void main() {
                vec2 uv = gl_FragCoord.xy / uResolution.xy;
                float ratio = uResolution.x / uResolution.y;
                vec2 p = uv;
                p.x *= ratio;

                float t = uTime * 0.00015; 
                
                // Multiple octaves of noise for fluid blobs
                float n1 = snoise(p * 0.4 + t);
                float n2 = snoise(p * 0.8 - t * 1.2 + n1 * 0.5);
                float n3 = snoise(p * 1.2 + t * 0.8 - n2 * 0.3);

                vec3 color = black;
                
                // Orange Glow (Primary)
                float orangeGlow = smoothstep(-0.6, 0.9, n2);
                color = mix(color, orange, orangeGlow * 0.4);

                // Blue Glow (Secondary)
                float blueGlow = smoothstep(-0.4, 0.8, n3);
                color = mix(color, blue, blueGlow * 0.3);

                // Add some depth and vignettes
                float dist = distance(uv, vec2(0.5));
                color *= smoothstep(1.5, 0.3, dist);

                gl_FragColor = vec4(color, 1.0);
            }
        `;

        this.program = this.createProgram(vs, fs);
        this.gl.useProgram(this.program);

        const buffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), this.gl.STATIC_DRAW);

        const pos = this.gl.getAttribLocation(this.program, 'position');
        this.gl.enableVertexAttribArray(pos);
        this.gl.vertexAttribPointer(pos, 2, this.gl.FLOAT, false, 0, 0);

        this.uTime = this.gl.getUniformLocation(this.program, 'uTime');
        this.uRes = this.gl.getUniformLocation(this.program, 'uResolution');
    }

    createProgram(vsSource, fsSource) {
        const vs = this.gl.createShader(this.gl.VERTEX_SHADER);
        this.gl.shaderSource(vs, vsSource);
        this.gl.compileShader(vs);

        const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
        this.gl.shaderSource(fs, fsSource);
        this.gl.compileShader(fs);

        const prog = this.gl.createProgram();
        this.gl.attachShader(prog, vs);
        this.gl.attachShader(prog, fs);
        this.gl.linkProgram(prog);
        return prog;
    }

    initNoise() {
        this.noiseCanvas.width = 128; // Smaller for texture, larger pixels
        this.noiseCanvas.height = 128;
    }

    updateNoise() {
        const w = this.noiseCanvas.width;
        const h = this.noiseCanvas.height;
        const idata = this.noiseCtx.createImageData(w, h);
        const data = idata.data;
        for (let i = 0; i < data.length; i += 4) {
            const v = Math.random() * 255;
            data[i] = data[i + 1] = data[i + 2] = v;
            data[i + 3] = 12; // Very subtle noise
        }
        this.noiseCtx.putImageData(idata, 0, 0);
    }

    resize() {
        const w = window.innerWidth;
        const h = window.innerHeight;
        this.canvas.width = w;
        this.canvas.height = h;
        this.gl.viewport(0, 0, w, h);
    }

    renderStatic() {
        // Render unique static frame
        this.gl.uniform1f(this.uTime, this.startTime);
        this.gl.uniform2f(this.uRes, this.canvas.width, this.canvas.height);
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);

        // Draw noise once
        this.updateNoise();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new OraBackground();
});
