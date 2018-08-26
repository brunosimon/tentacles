import Root from './Root.js'
import * as THREE from 'three'

export default class Roots
{
    /**
     * Constructor
     */
    constructor(_options)
    {
        // Options
        this.helpers = _options.helpers
        this.origin = _options.origin
        this.destination = _options.destination
        this.steps = _options.steps
        this.torsionAngle = _options.torsionAngle
        this.rootsCount = _options.rootsCount
        this.rootsRadius = _options.rootsRadius
        this.rootsSpaceBetween = _options.rootsSpaceBetween
        this.rootsTubularSegments = _options.rootsTubularSegments
        this.rootsRadialSegments = _options.rootsRadialSegments
        this.rootsTension = _options.rootsTension

        // Set up
        this.container = new THREE.Object3D()

        this.way = new THREE.Vector3()
        this.way.subVectors(this.destination, this.origin)

        this.direction = this.way.clone().normalize()

        if(this.helpers)
        {
            // Origin helper
            this.originHelper = new THREE.Mesh(new THREE.SphereBufferGeometry(0.04, 6, 6), new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true }))
            this.originHelper.position.copy(this.origin)
            this.container.add(this.originHelper)

            // Destination helper
            this.destinationHelper = new THREE.Mesh(new THREE.SphereBufferGeometry(0.04, 6, 6), new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true }))
            this.destinationHelper.position.copy(this.destination)
            this.container.add(this.destinationHelper)
        }

        this.setItems()
    }

    /**
     * Set items
     */
    setItems()
    {
        const allPoints = []

        /**
         * Define circles
         */
        const circles = []
        circles.push({ radius: 0, permiter: 0, count: 1, points: [new THREE.Vector3()] }) // First in center

        let count = this.rootsCount - 1
        let circlesCount = 0
        let circleRadius = 0
        let totalPerimeter = 0

        // Count how much circles are needed to fit all the roots
        while(count > 0)
        {
            circleRadius += this.rootsSpaceBetween
            const circlePermiter = Math.PI * 2 * circleRadius
            const availableCountInCircle = Math.floor(circlePermiter / this.rootsSpaceBetween)
            const countInCircle = Math.min(availableCountInCircle, count)

            count -= countInCircle
            totalPerimeter += circlePermiter

            circlesCount++
        }

        // Calculate how much point to fit in each circle
        count = this.rootsCount - 1

        let angleOffset = 0

        for(let i = 0; i < circlesCount; i++)
        {
            const circle = {}

            circle.radius = (i + 1) * this.rootsSpaceBetween
            circle.permiter = Math.PI * 2 * circle.radius
            circle.count = i === circlesCount - 1 ? count : Math.round(circle.permiter / totalPerimeter * this.rootsCount)
            circle.points = []

            count -= circle.count

            // Add points
            for(let j = 0; j < circle.count; j++)
            {
                const point = new THREE.Vector3()
                point.x = Math.cos(j / circle.count * Math.PI * 2 + angleOffset) * circle.radius
                point.y = Math.sin(j / circle.count * Math.PI * 2 + angleOffset) * circle.radius

                circle.points.push(point)
            }

            angleOffset += circle.permiter / circle.count / 2

            circles.push(circle)
        }

        /**
         * define steps
         */
        const steps = []

        // Each step
        for(let i = 0; i < this.steps; i++)
        {
            const step = {}
            step.position = this.origin.clone()
            step.position = step.position.add(this.way.clone().setLength(this.way.length() / (this.steps - 1) * i))
            steps.push(step)

            // Helper
            if(this.helpers)
            {
                const helper = new THREE.Mesh(new THREE.SphereBufferGeometry(0.03, 6, 6), new THREE.MeshBasicMaterial({ color: 0xffff00, wireframe: true }))
                helper.position.copy(step.position)
                this.container.add(helper)
            }
        }

        /**
         * Create points
         */

        // Create direction rotation
        const directionQuaternion = new THREE.Quaternion()
        directionQuaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), this.direction)

        // Create direction matrix
        const directionMatrix = new THREE.Matrix4()
        directionMatrix.makeRotationFromQuaternion(directionQuaternion)

        let angle = 0

        // Each step
        for(const _step of steps)
        {
            // Each circle
            for(const _circle of circles)
            {
                // Each point
                let i = 0
                for(const _point of _circle.points)
                {
                    const point = _point.clone()
                    point.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle)
                    point.applyMatrix4(directionMatrix)
                    point.add(_step.position)

                    allPoints.push(point)

                    i++

                    // Helper
                    if(this.helpers)
                    {
                        const helper = new THREE.Mesh(new THREE.SphereBufferGeometry(0.02, 6, 6), new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true }))
                        helper.position.copy(point)
                        this.container.add(helper)
                    }
                }
            }

            angle += this.torsionAngle / this.steps
        }

        /**
         * Create items
         */
        this.items = []

        for(let i = 0; i < this.rootsCount; i++)
        {
            const anchors = []
            for(let j = i; j < allPoints.length; j += this.rootsCount)
            {
                const point = allPoints[j]
                anchors.push(point)
            }

            const item = new Root({
                anchors: anchors,
                radius: this.rootsRadius,
                tubularSegments: this.rootsTubularSegments,
                radialSegments: this.rootsRadialSegments,
                tension: this.rootsTension
            })

            this.container.add(item.container)

            this.items.push(item)
        }
    }

    /**
     * Destructor
     */
    destructor()
    {

    }
}
