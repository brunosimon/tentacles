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
        this.tubularSegments = _options.tubularSegments
        this.radialSegments = _options.radialSegments
        this.tension = _options.tension
        this.wireframe = _options.wireframe

        // Set up
        this.container = new THREE.Object3D()

        // Get points
        this.curve = new THREE.CatmullRomCurve3(this.anchors, false, 'centripetal', 1)
        this.curve.curveType = 'catmullrom'
        this.curve.tension = this.tension

        // Create tube
        this.geometry = new THREE.TubeGeometry(this.curve, this.tubularSegments, this.radius, this.radialSegments, false)
        // this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
        // this.material = new THREE.MeshNormalMaterial()
        this.material = new THREE.ShaderMaterial({
            wireframe: this.wireframe,
            uniforms:
            {
                uRadius: { type: 'f', value: this.radius }
            },
            vertexShader: rootVertexShader,
            fragmentShader: rootFragmentShader
        })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.container.add(this.mesh)
    }
}
