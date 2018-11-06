import * as THREE from 'three'

export default `
    #define PHYSICAL

    uniform vec3 diffuse;
    uniform vec3 emissive;
    uniform float roughness;
    uniform float metalness;
    uniform float opacity;

    #ifndef STANDARD
        uniform float clearCoat;
        uniform float clearCoatRoughness;
    #endif

    varying vec3 vViewPosition;

    #ifndef FLAT_SHADED

        varying vec3 vNormal;

    #endif

    ${THREE.ShaderChunk.common}
    ${THREE.ShaderChunk.packing}
    ${THREE.ShaderChunk.dithering_pars_fragment}
    ${THREE.ShaderChunk.color_pars_fragment}
    ${THREE.ShaderChunk.uv_pars_fragment}
    ${THREE.ShaderChunk.uv2_pars_fragment}
    ${THREE.ShaderChunk.map_pars_fragment}
    ${THREE.ShaderChunk.alphamap_pars_fragment}
    ${THREE.ShaderChunk.aomap_pars_fragment}
    ${THREE.ShaderChunk.lightmap_pars_fragment}
    ${THREE.ShaderChunk.emissivemap_pars_fragment}
    ${THREE.ShaderChunk.bsdfs}
    ${THREE.ShaderChunk.cube_uv_reflection_fragment}
    ${THREE.ShaderChunk.envmap_pars_fragment}
    ${THREE.ShaderChunk.envmap_physical_pars_fragment}
    ${THREE.ShaderChunk.fog_pars_fragment}
    ${THREE.ShaderChunk.lights_pars_begin}
    ${THREE.ShaderChunk.lights_physical_pars_fragment}
    ${THREE.ShaderChunk.shadowmap_pars_fragment}
    ${THREE.ShaderChunk.bumpmap_pars_fragment}
    ${THREE.ShaderChunk.normalmap_pars_fragment}
    ${THREE.ShaderChunk.roughnessmap_pars_fragment}
    ${THREE.ShaderChunk.metalnessmap_pars_fragment}
    ${THREE.ShaderChunk.logdepthbuf_pars_fragment}
    ${THREE.ShaderChunk.clipping_planes_pars_fragment}

    void main() {

        ${THREE.ShaderChunk.clipping_planes_fragment}

        vec4 diffuseColor = vec4( diffuse, opacity );
        ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
        vec3 totalEmissiveRadiance = emissive;

        ${THREE.ShaderChunk.logdepthbuf_fragment}
        ${THREE.ShaderChunk.map_fragment}
        ${THREE.ShaderChunk.color_fragment}
        ${THREE.ShaderChunk.alphamap_fragment}
        ${THREE.ShaderChunk.alphatest_fragment}
        ${THREE.ShaderChunk.roughnessmap_fragment}
        ${THREE.ShaderChunk.metalnessmap_fragment}
        ${THREE.ShaderChunk.normal_fragment_begin}
        ${THREE.ShaderChunk.normal_fragment_maps}
        ${THREE.ShaderChunk.emissivemap_fragment}

        // accumulation
        ${THREE.ShaderChunk.lights_physical_fragment}
        ${THREE.ShaderChunk.lights_fragment_begin}
        ${THREE.ShaderChunk.lights_fragment_maps}
        ${THREE.ShaderChunk.lights_fragment_end}

        // modulation
        ${THREE.ShaderChunk.aomap_fragment}

        vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

        gl_FragColor = vec4( outgoingLight, diffuseColor.a );

        ${THREE.ShaderChunk.tonemapping_fragment}
        ${THREE.ShaderChunk.encodings_fragment}
        ${THREE.ShaderChunk.fog_fragment}
        ${THREE.ShaderChunk.premultiplied_alpha_fragment}
        ${THREE.ShaderChunk.dithering_fragment}
    }
`
