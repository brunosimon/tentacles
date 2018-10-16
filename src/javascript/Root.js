import * as THREE from 'three'
import rootFragmentShader from '../shaders/root.fragment.glsl'
import rootVertexShader from '../shaders/root.vertex.glsl'

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
        this.wireframe = _options.wireframe

        // Set up
        this.container = new THREE.Object3D()
        this.progressValue = 0.5

        // Get points
        this.curve = new THREE.CatmullRomCurve3(this.anchors, false, 'centripetal', 1)
        this.curve.curveType = 'catmullrom'
        this.curve.tension = this.tension

        // Create tube
        this.geometry = new THREE.TubeGeometry(this.curve, this.tubularSegments, this.radius, this.radialSegments, false)
        this.material = new THREE.ShaderMaterial({
            wireframe: this.wireframe,
            uniforms:
            {
                uProgress: { type: 'f', value: 1 },
                uRadius: { type: 'f', value: this.radius },
                uColor: { type: 'v3', value: new THREE.Vector3(this.color[0] / 255, this.color[1] / 255, this.color[2] / 255) },
                uBlurpProgress: { type: 'f', value: 0 },
                uBlurpAmplitude: { type: 'f', value: 0.5 },
                uBlurpStrength: { type: 'f', value: 1 }
            },
            vertexShader: rootVertexShader,
            fragmentShader: rootFragmentShader
        })
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
