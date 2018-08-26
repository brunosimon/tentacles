uniform float uRadius;

varying vec2 vUv;

void main()
{
    vUv = uv;

    float rootProgress = uv.x;

    vec3 newPosition = position;
    newPosition -= normal * (uRadius * rootProgress);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
