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
        this.tubularSegments = _options.tubularSegments
        this.radialSegments = _options.radialSegments
        this.radius = _options.radius

        // Set up
        this.container = new THREE.Object3D()

        // Get points
        this.curve = new THREE.CatmullRomCurve3(this.anchors, false, 'centripetal', 1)
        this.curve.curveType = 'catmullrom'
        this.curve.tension = 0.35

        // Create tube
        this.geometry = new THREE.TubeGeometry(this.curve, this.tubularSegments, this.radius, this.radialSegments, false)
        this.material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.container.add(this.mesh)
    }
}
