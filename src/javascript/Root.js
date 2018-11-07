import * as THREE from 'three'

import rootTextureVertex from '../shaders/rootTextureVertex.js'
import rootTextureFragment from '../shaders/rootTextureFragment.js'
import rootColorVertex from '../shaders/rootColorVertex.js'
import rootColorFragment from '../shaders/rootColorFragment.js'

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
            THREE.UniformsLib.specularmap,
            THREE.UniformsLib.fog,
            THREE.UniformsLib.lights,
            {
                // Standard material uniforms
                emissive: { value: new THREE.Color(this.textures.emissiveColor) },
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
        uniforms.specularMap.value = this.textures.specular
        uniforms.emissiveMap.value = this.textures.emissive
        uniforms.aoMap.value = this.textures.ambientOcclusion
        uniforms.metalnessMap.value = this.textures.metalness

        this.material = new THREE.ShaderMaterial({
            wireframe: this.wireframe,
            vertexShader: this.textures.type === 'colors' ? rootColorVertex : rootTextureVertex,
            fragmentShader: this.textures.type === 'colors' ? rootColorFragment : rootTextureFragment,
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
                STANDARD: '',

                USE_MAP: '',
                USE_BUMPMAP: '',
                USE_NORMALMAP: '',
                USE_SPECULARMAP: '',
                USE_EMISSIVEMAP: '',
                USE_ROUGHNESSMAP: '',
                USE_METALNESSMAP: '',
                USE_AOMAP: ''
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
