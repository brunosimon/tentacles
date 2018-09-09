precision mediump float;

uniform vec3 uColor;

// varying vec2 vUv;

void main()
{
    // // Normals
    // gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);

    // Color
    gl_FragColor = vec4(uColor, 1.0);
}
