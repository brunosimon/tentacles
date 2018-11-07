import * as THREE from 'three'

export default `
    #define PHYSICAL
    #define M_PI 3.1415926535897932384626433832795

    varying vec3 vViewPosition;

    #ifndef FLAT_SHADED

        varying vec3 vNormal;

    #endif

    // Custom start
    uniform float uRadius;
    uniform float uProgress;

    uniform float uBlurpProgress;
    uniform float uBlurpAmplitude;
    uniform float uBlurpStrength;

    uniform vec2 uTextureRepeat;

    float toSin(float _value)
    {
        return (sin((_value - 0.5) * M_PI) + 1.0) / 2.0;
    }
    // Custom end

    ${THREE.ShaderChunk.common}
    ${THREE.ShaderChunk.uv_pars_vertex}
    ${THREE.ShaderChunk.uv2_pars_vertex}
    ${THREE.ShaderChunk.displacementmap_pars_vertex}
    ${THREE.ShaderChunk.color_pars_vertex}
    ${THREE.ShaderChunk.fog_pars_vertex}
    ${THREE.ShaderChunk.morphtarget_pars_vertex}
    ${THREE.ShaderChunk.skinning_pars_vertex}
    ${THREE.ShaderChunk.shadowmap_pars_vertex}
    ${THREE.ShaderChunk.logdepthbuf_pars_vertex}
    ${THREE.ShaderChunk.clipping_planes_pars_vertex}

    void main() {

        ${THREE.ShaderChunk.uv_vertex}
        ${THREE.ShaderChunk.uv2_vertex}
        ${THREE.ShaderChunk.color_vertex}

        ${THREE.ShaderChunk.beginnormal_vertex}
        ${THREE.ShaderChunk.morphnormal_vertex}
        ${THREE.ShaderChunk.skinbase_vertex}
        ${THREE.ShaderChunk.skinnormal_vertex}
        ${THREE.ShaderChunk.defaultnormal_vertex}

    #ifndef FLAT_SHADED // Normal computed with derivatives when FLAT_SHADED

        vNormal = normalize( transformedNormal );

    #endif

        ${THREE.ShaderChunk.begin_vertex}
        ${THREE.ShaderChunk.morphtarget_vertex}
        ${THREE.ShaderChunk.skinning_vertex}
        ${THREE.ShaderChunk.displacementmap_vertex}

        // Custom start
        float rootProgress = uv.x;

        // Cone shape
        float verticeProgress = 1.0 - clamp(uProgress - rootProgress, 0.0, 1.0);
        float coneDisplacement = (uRadius * verticeProgress);
        transformed -= normal * coneDisplacement;

        // UV
        vUv.x -= uProgress;
        vUv.x *= uTextureRepeat.y * (1.0 + abs(coneDisplacement * M_PI * 2.0));
        vUv.y *= uTextureRepeat.x;

        // Blurp shape
        float blurpProgress = uBlurpProgress * (1.0 + uBlurpAmplitude) - (uBlurpAmplitude / 2.0);
        float blurpStrength = distance(rootProgress, blurpProgress) / (uBlurpAmplitude / 2.0);
        blurpStrength = 1.0 - clamp(blurpStrength, 0.0, 1.0);

        float blurpDisplacement = uBlurpStrength * uRadius * (1.0 - verticeProgress) * toSin(blurpStrength);
        transformed += normal * blurpDisplacement;
        // Custom end

        ${THREE.ShaderChunk.project_vertex}
        ${THREE.ShaderChunk.logdepthbuf_vertex}
        ${THREE.ShaderChunk.clipping_planes_vertex}

        vViewPosition = - mvPosition.xyz;

        ${THREE.ShaderChunk.worldpos_vertex}
        ${THREE.ShaderChunk.shadowmap_vertex}
        ${THREE.ShaderChunk.fog_vertex}
    }
`
