uniform float uRadius;
uniform float uProgress;

varying vec2 vUv;

void main()
{
    vUv = uv;

    float rootProgress = uv.x;

    vec3 newPosition = position;
    float verticeProgress = 1.0 - clamp(uProgress - rootProgress, 0.0, 1.0);
    newPosition -= normal * (uRadius * verticeProgress);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
