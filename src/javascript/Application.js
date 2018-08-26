import * as THREE from 'three'
import ThreeOrbitControls from 'three-orbit-controls'
import { EffectComposer, RenderPass, SMAAPass, SMAAAreaImageData, SMAASearchImageData } from 'postprocessing'
import * as dat from 'dat.gui'

import Sizes from './Sizes.js'
import Time from './Time.js'
import Roots from './Roots.js'

const OrbitControls = ThreeOrbitControls(THREE)

export default class Application
{
    /**
     * Constructor
     */
    constructor(_options)
    {
        // Options
        this.$canvas = _options.$canvas
        this.useComposer = _options.useComposer

        // Set up
        this.time = new Time()
        this.sizes = new Sizes()

        this.setDebug()
        this.setEnvironment()

        this.generate()
    }

    /**
     * Set debug
     */
    setDebug()
    {
        this.debug = new dat.GUI()
        this.debug.width = 360

        // Options
        this.options = {}

        this.options.originX = - 2
        this.options.originY = - 1
        this.options.originZ = 0
        this.options.destinationX = 2
        this.options.destinationY = 1
        this.options.destinationZ = 0
        this.options.steps = 6
        this.options.torsionAngle = Math.PI * 1
        this.options.rootsCount = 10
        this.options.rootsRadius = 0.15
        this.options.rootsSpaceBetween = 0.4
        this.options.rootsTubularSegments = 50
        this.options.rootsRadialSegments = 6
        this.options.rootsTension = 0.4
        this.options.rootsRandomness = 0.25
        this.options.wireframe = false

        this.debug.add(this.options, 'originX').min(- 5).max(5).step(0.1).name('origin x')
        this.debug.add(this.options, 'originY').min(- 5).max(5).step(0.1).name('origin y')
        this.debug.add(this.options, 'originZ').min(- 5).max(5).step(0.1).name('origin z')
        this.debug.add(this.options, 'destinationX').min(- 5).max(5).step(0.1).name('destination x')
        this.debug.add(this.options, 'destinationY').min(- 5).max(5).step(0.1).name('destination y')
        this.debug.add(this.options, 'destinationZ').min(- 5).max(5).step(0.1).name('destination z')
        this.debug.add(this.options, 'steps').min(2).max(20).step(1).name('steps')
        this.debug.add(this.options, 'torsionAngle').min(- 10).max(10).step(0.01).name('torsion angle')
        this.debug.add(this.options, 'rootsCount').min(1).max(100).step(1).name('roots count')
        this.debug.add(this.options, 'rootsRadius').min(0.01).max(1).step(0.01).name('roots radius')
        this.debug.add(this.options, 'rootsSpaceBetween').min(0.01).max(1).step(0.01).name('roots space between')
        this.debug.add(this.options, 'rootsTubularSegments').min(2).max(200).step(1).name('roots tubular segments')
        this.debug.add(this.options, 'rootsRadialSegments').min(2).max(20).step(1).name('roots radial segments')
        this.debug.add(this.options, 'rootsTension').min(0).max(1).step(0.01).name('roots tension')
        this.debug.add(this.options, 'rootsRandomness').min(0).max(1).step(0.01).name('roots randomness')
        this.debug.add(this.options, 'wireframe').name('wireframe')

        for(const _controller of this.debug.__controllers)
        {
            _controller.onFinishChange(() =>
            {
                this.generate()
            })
        }

        this.debug.add(this, 'generate').name('reset()')
    }

    /**
     * Set environments
     */
    setEnvironment()
    {
        // Scene
        this.scene = new THREE.Scene()

        // Renderer
        this.renderer = new THREE.WebGLRenderer({ canvas: this.$canvas })
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)

        // Camera
        this.camera = new THREE.PerspectiveCamera(75, this.sizes.viewport.width / this.sizes.viewport.height, 0.1, 100)
        this.camera.position.set(0, 1, 3)
        this.camera.lookAt(new THREE.Vector3())
        this.scene.add(this.camera)

        // Controls
        this.controls = new OrbitControls(this.camera, this.$canvas)

        // // Dummy
        // this.dummy = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(1, 0.4, 120, 20), new THREE.MeshNormalMaterial())
        // this.scene.add(this.dummy)

        // Composer
        this.composer = new EffectComposer(this.renderer, { depthTexture: true })

        // Passes
        this.passes = {}
        this.passes.list = []
        this.passes.updateRenderToScreen = () =>
        {
            let enabledPassFound = false

            for(let i = this.passes.list.length - 1; i >= 0; i--)
            {
                const pass = this.passes.list[i]

                if(pass.enabled && !enabledPassFound)
                {
                    pass.renderToScreen = true
                    enabledPassFound = true
                }
                else
                {
                    pass.renderToScreen = false
                }
            }
        }

        this.passes.render = new RenderPass(this.scene, this.camera)
        this.composer.addPass(this.passes.render)
        this.passes.list.push(this.passes.render)

        this.passes.smaa = new SMAAPass(SMAASearchImageData, SMAAAreaImageData)
        this.passes.smaa.enabled = window.devicePixelRatio <= 1
        this.composer.addPass(this.passes.smaa)
        this.passes.list.push(this.passes.smaa)

        this.passes.updateRenderToScreen()

        // Time tick
        this.time.on('tick', () =>
        {
            // Renderer
            if(this.useComposer)
            {
                this.composer.render(this.scene, this.camera)
            }
            else
            {
                this.renderer.render(this.scene, this.camera)
            }
        })

        // Resize event
        this.sizes.on('resize', () =>
        {
            this.camera.aspect = this.sizes.viewport.width / this.sizes.viewport.height
            this.camera.updateProjectionMatrix()

            this.renderer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)

            if(this.useComposer)
            {
                for(const _pass of this.passes.list)
                {
                    if(_pass.setSize)
                    {
                        _pass.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
                    }
                }
                this.composer.setSize(this.sizes.viewport.width, this.sizes.viewport.height)
            }
        })
    }

    /**
     * Generate
     */
    generate()
    {
        // Destroy previous roots
        if(this.roots)
        {
            this.roots.destructor()
            this.scene.remove(this.roots.container)
        }

        // Roots
        this.roots = new Roots({
            helpers: false,
            origin: new THREE.Vector3(this.options.originX, this.options.originY, this.options.originZ),
            destination: new THREE.Vector3(this.options.destinationX, this.options.destinationY, this.options.destinationZ),
            steps: this.options.steps,
            torsionAngle: this.options.torsionAngle,
            rootsCount: this.options.rootsCount,
            rootsRadius: this.options.rootsRadius,
            rootsSpaceBetween: this.options.rootsSpaceBetween,
            rootsTubularSegments: this.options.rootsTubularSegments,
            rootsRadialSegments: this.options.rootsRadialSegments,
            rootsTension: this.options.rootsTension,
            rootsRandomness: this.options.rootsRandomness,
            wireframe: this.options.wireframe
        })
        this.scene.add(this.roots.container)
    }

    /**
     * Destructor
     */
    destructor()
    {
        this.time.off('tick')
        this.sizes.off('resize')

        this.controls.dispose()
        this.renderer.dispose()
        this.composer.dispose()

        this.debug.destroy()
    }
}
