import * as THREE from 'three'

export default class Root
{
    /**
     * Constructor
     */
    constructor(_options)
    {
        // Options
        this.anchors = _options.anchors
        this.radius = _options.radius
        this.length = _options.length
        this.tubularSegments = _options.tubularSegments
        this.radialSegments = _options.radialSegments
        this.tension = _options.tension
        this.color = _options.color
        this.textures = _options.textures
        this.textureRepeatX = _options.textureRepeatX
        this.textureRepeatY = _options.textureRepeatY
        this.wireframe = _options.wireframe

        // Set up
        this.container = new THREE.Object3D()
        this.progressValue = 0.5

        // Get points
        this.curve = new THREE.CatmullRomCurve3(this.anchors, false, 'centripetal', 1)
        this.curve.curveType = 'catmullrom'
        this.curve.tension = this.tension

        // Tube geometry
        this.geometry = new THREE.TubeGeometry(this.curve, this.tubularSegments, this.radius, this.radialSegments, false)

        // Extended mesh standard material
        const uniforms = THREE.UniformsUtils.merge([
            THREE.UniformsLib.common,
            THREE.UniformsLib.envmap,
            THREE.UniformsLib.aomap,
            THREE.UniformsLib.lightmap,
            THREE.UniformsLib.emissivemap,
            THREE.UniformsLib.bumpmap,
            THREE.UniformsLib.normalmap,
            THREE.UniformsLib.displacementmap,
            THREE.UniformsLib.roughnessmap,
            THREE.UniformsLib.metalnessmap,
            THREE.UniformsLib.fog,
            THREE.UniformsLib.lights,
            {
                // Standard material uniforms
                emissive: { value: new THREE.Color(0x000000) },
                roughness: { value: 0.5 },
                metalness: { value: 0 },
                envMapIntensity: { value: 1 }, // temporary

                // Custom uniforms
                uProgress: { type: 'f', value: 1 },
                uRadius: { type: 'f', value: this.radius },
                uColor: { type: 'v3', value: new THREE.Vector3(this.color[0] / 255, this.color[1] / 255, this.color[2] / 255) },
                uBlurpProgress: { type: 'f', value: 0 },
                uBlurpAmplitude: { type: 'f', value: 0.5 },
                uBlurpStrength: { type: 'f', value: 1 },
                uTextureRepeat: { type: 'f', value: new THREE.Vector2(this.textureRepeatX, this.textureRepeatY) }
            }
        ])

        uniforms.map.value = this.textures.map
        uniforms.normalMap.value = this.textures.normal
        uniforms.roughnessMap.value = this.textures.roughness
        uniforms.emissiveMap.value = this.textures.emissive
        uniforms.aoMap.value = this.textures.ambientOcclusion

        const vertexShader = `
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
                vUv.x *= uTextureRepeat.y + uProgress;
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
        const fragmentShader = `
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

        this.material = new THREE.ShaderMaterial({
            wireframe: this.wireframe,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            // attributes: {},
            uniforms: uniforms,
            extensions:
            {
                derivatives: true,
                fragDepth: false,
                drawBuffers: false,
                shaderTextureLOD: false
            },
            defines:
            {
                USE_MAP: '',
                USE_NORMALMAP: '',
                USE_ROUGHNESSMAP: '',
                STANDARD: '',
                USE_LIGHTMAP: ''
            },
            lights: true
        })

        // Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.container.add(this.mesh)
    }

    get progress()
    {
        return this.progressValue
    }

    set progress(_value)
    {
        const value = _value * this.length

        this.progressValue = value
        this.material.uniforms.uProgress.value = this.progressValue

        return this.progressValue
    }
}
