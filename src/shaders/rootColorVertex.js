export default `
    #define M_PI 3.1415926535897932384626433832795

    precision mediump float;

    uniform float uRadius;
    uniform float uProgress;

    uniform float uBlurpProgress;
    uniform float uBlurpAmplitude;
    uniform float uBlurpStrength;

    varying vec2 vUv;

    float toSin(float _value)
    {
        return (sin((_value - 0.5) * M_PI) + 1.0) / 2.0;
    }

    void main()
    {
        vUv = uv;

        vec3 newPosition = position;

        float rootProgress = uv.x;

        // Cone shape
        float verticeProgress = 1.0 - clamp(uProgress - rootProgress, 0.0, 1.0);
        float coneDisplacement = (uRadius * verticeProgress);
        newPosition -= normal * coneDisplacement;

        // Blurp shape
        float blurpProgress = uBlurpProgress * (1.0 + uBlurpAmplitude) - (uBlurpAmplitude / 2.0);
        float blurpStrength = distance(rootProgress, blurpProgress) / (uBlurpAmplitude / 2.0);
        blurpStrength = 1.0 - clamp(blurpStrength, 0.0, 1.0);

        float blurpDisplacement = uBlurpStrength * uRadius * (1.0 - verticeProgress) * toSin(blurpStrength);
        newPosition += normal * blurpDisplacement;

        // Final position
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
`
