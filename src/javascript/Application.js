import * as THREE from 'three'
import ThreeOrbitControls from 'three-orbit-controls'
import { EffectComposer, RenderPass, BloomPass, SMAAPass } from 'postprocessing'
import * as dat from 'dat.gui'

import Sizes from './Sizes.js'
import Time from './Time.js'
import Roots from './Roots.js'

import textures from './Textures.js'

const texturesKeys = Object.keys(textures)

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

        // Load resources
        this.resources = {}

        this.resources.searchImage = new Image()
        this.resources.searchImage.addEventListener('load', () =>
        {
            this.resources.areaImage = new Image()
            this.resources.areaImage.addEventListener('load', () =>
            {
                // Set debug
                this.setDebug()

                // Set environment
                this.setEnvironment()

                // Generate first roots
                this.generate()
            })
            this.resources.areaImage.src = SMAAPass.areaImageDataURL
        })
        this.resources.searchImage.src = SMAAPass.searchImageDataURL
    }

    /**
     * Set debug
     */
    setDebug()
    {
        this.debug = new dat.GUI()
        // this.debug.width = 360

        // Options
        this.options = {}

        this.options.originX = 0
        this.options.originY = - 1.5
        this.options.originZ = 0
        this.options.destinationX = 0
        this.options.destinationY = 2.5
        this.options.destinationZ = 0
        this.options.steps = 6
        this.options.torsionAngle = Math.PI * 0.4
        this.options.rootsCount = 10
        this.options.rootsRadius = 0.15
        this.options.rootsSpaceBetween = 0.4
        this.options.rootsTubularSegments = 50
        this.options.rootsRadialSegments = 12
        this.options.rootsTension = 0.4
        this.options.rootsRandomness = 0.25
        this.options.rootsMinLength = 0.25
        this.options.rootsMaxLength = 1
        this.options.rootsTextureRepeatX = 2
        this.options.rootsTextureRepeatY = 7
        this.options.animationDuration = 2
        this.options.animationOffset = 0
        this.options.blurpMinDuration = 3
        this.options.blurpMaxDuration = 15
        this.options.blurpMinInterval = 0
        this.options.blurpMaxInterval = 5
        this.options.blurpMinAmplitude = 0.15
        this.options.blurpMaxAmplitude = 0.8
        this.options.wireframe = false
        this.options.seed = 'gozu'
        this.options.rootsTexture = texturesKeys[0]

        // this.debug.add(this.options, 'originX').min(- 5).max(5).step(0.1).name('origin x')
        // this.debug.add(this.options, 'originY').min(- 5).max(5).step(0.1).name('origin y')
        // this.debug.add(this.options, 'originZ').min(- 5).max(5).step(0.1).name('origin z')
        // this.debug.add(this.options, 'destinationX').min(- 5).max(5).step(0.1).name('destination x')
        // this.debug.add(this.options, 'destinationY').min(- 5).max(5).step(0.1).name('destination y')
        // this.debug.add(this.options, 'destinationZ').min(- 5).max(5).step(0.1).name('destination z')
        this.debug.add(this.options, 'steps').min(2).max(20).step(1).name('steps')
        this.debug.add(this.options, 'torsionAngle').min(- 10).max(10).step(0.01).name('torsion angle')
        this.debug.add(this.options, 'rootsCount').min(1).max(100).step(1).name('roots count')
        this.debug.add(this.options, 'rootsRadius').min(0.01).max(1).step(0.01).name('roots radius')
        this.debug.add(this.options, 'rootsSpaceBetween').min(0.01).max(1).step(0.01).name('roots space between')
        this.debug.add(this.options, 'rootsTubularSegments').min(2).max(200).step(1).name('roots tubular segments')
        this.debug.add(this.options, 'rootsRadialSegments').min(2).max(20).step(1).name('roots radial segments')
        this.debug.add(this.options, 'rootsTension').min(0).max(1).step(0.01).name('roots tension')
        this.debug.add(this.options, 'rootsRandomness').min(0).max(1).step(0.01).name('roots randomness')
        this.debug.add(this.options, 'rootsMinLength').min(0).max(1).step(0.01).name('roots min length')
        this.debug.add(this.options, 'rootsMaxLength').min(0).max(1).step(0.01).name('roots max length')
        this.debug.add(this.options, 'rootsTexture', texturesKeys).name('roots texture')
        this.debug.add(this.options, 'rootsTextureRepeatX').min(1).max(40).step(0.01).name('roots texture repeat x')
        this.debug.add(this.options, 'rootsTextureRepeatY').min(1).max(40).step(0.01).name('roots texture repeat y')
        this.debug.add(this.options, 'animationDuration').min(0.01).max(10).step(0.01).name('animation duration')
        this.debug.add(this.options, 'animationOffset').min(0.01).max(5).step(0.01).name('animation offset')
        this.debug.add(this.options, 'blurpMinDuration').min(0).max(20).step(0.1).name('blurp min duration')
        this.debug.add(this.options, 'blurpMaxDuration').min(0).max(20).step(0.1).name('blurp max duration')
        this.debug.add(this.options, 'blurpMinInterval').min(0).max(20).step(0.1).name('blurp min interval')
        this.debug.add(this.options, 'blurpMaxInterval').min(0).max(20).step(0.1).name('blurp max interval')
        this.debug.add(this.options, 'blurpMinAmplitude').min(0).max(1).step(0.01).name('blurp min amplitude')
        this.debug.add(this.options, 'blurpMaxAmplitude').min(0).max(1).step(0.01).name('blurp max amplitude')
        this.debug.add(this.options, 'wireframe').name('wireframe')
        this.debug.add(this.options, 'seed').name('seed')

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
        this.camera.position.set(-1.5, -1, 1)
        this.camera.lookAt(new THREE.Vector3())
        this.scene.add(this.camera)

        // Controls
        this.controls = new OrbitControls(this.camera, this.$canvas)

        // // Dummy
        // this.dummy = new THREE.Mesh(new THREE.TorusKnotBufferGeometry(1, 0.4, 120, 20), new THREE.MeshNormalMaterial())
        // this.scene.add(this.dummy)

        // Floor
        this.floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10, 1, 1), new THREE.MeshBasicMaterial({ color: 0x000000 }))
        this.floor.position.y = - 1.9
        this.floor.rotation.x = - Math.PI * 0.5
        this.scene.add(this.floor)

        // Lights
        this.lights = {}
        // this.lights.ambient = new THREE.AmbientLight(0x000000)
        // this.scene.add(this.lights.ambient)

        this.lights.light1 = new THREE.DirectionalLight(0xffffff, 2)
        this.lights.light1.position.x = 1
        this.lights.light1.position.y = 1
        this.lights.light1.position.z = 1
        this.scene.add(this.lights.light1)

        this.lights.light2 = new THREE.DirectionalLight(0xffffff, 0.4)
        this.lights.light2.position.z = - 1
        this.scene.add(this.lights.light2)

        this.lights.light3 = new THREE.DirectionalLight(0xffffff, 0.2)
        this.lights.light3.position.x = - 1
        this.lights.light3.position.y = - 0.5
        this.scene.add(this.lights.light3)

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

        this.passes.bloom = new BloomPass({ intensity: 1 })
        this.passes.bloom.enabled = true
        this.composer.addPass(this.passes.bloom)
        this.passes.list.push(this.passes.bloom)

        this.passes.smaa = new SMAAPass(this.resources.searchImage, this.resources.areaImage)
        this.passes.smaa.enabled = true
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

        // Load all needed textures
        const imagesPromises = []
        for(const _textureName in textures[this.options.rootsTexture])
        {
            const textureUrl = textures[this.options.rootsTexture][_textureName]
            imagesPromises.push(this.loadImage(textureUrl, _textureName))
        }
        Promise
            .all(imagesPromises)
            .then((_textures) =>
            {
                const textures = {}
                for(const _texture of _textures)
                {
                    const texture = new THREE.Texture(_texture.img)
                    texture.needsUpdate = true
                    texture.wrapS = THREE.RepeatWrapping
                    texture.wrapT = THREE.RepeatWrapping
                    textures[_texture.name] = texture
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
                    rootsMinLength: this.options.rootsMinLength,
                    rootsMaxLength: this.options.rootsMaxLength,
                    rootsColors:
                    [
                        [255,106,106], // Red
                        [246,108,255], // Purple
                        [111,221,255], // Bleu
                        [168,208,72], // Green
                        [255,168,91] // Orange
                    ],
                    rootsTextures: textures,
                    rootsTextureRepeatX: this.options.rootsTextureRepeatX,
                    rootsTextureRepeatY: this.options.rootsTextureRepeatY,
                    animationDuration: this.options.animationDuration,
                    animationOffset: this.options.animationOffset,
                    blurpMinDuration: this.options.blurpMinDuration,
                    blurpMaxDuration: this.options.blurpMaxDuration,
                    blurpMinInterval: this.options.blurpMinInterval,
                    blurpMaxInterval: this.options.blurpMaxInterval,
                    blurpMinAmplitude: this.options.blurpMinAmplitude,
                    blurpMaxAmplitude: this.options.blurpMaxAmplitude,
                    wireframe: this.options.wireframe,
                    seed: this.options.seed
                })
                this.scene.add(this.roots.container)
            })
    }

    /**
     * LoadImage
     */
    loadImage(_url, _name)
    {
        return new Promise((_resolve, _reject) =>
        {
            const img = document.createElement('img')
            img.addEventListener('load', () =>
            {
                _resolve({ img, name: _name })
            })
            img.addEventListener('error', () =>
            {
                _reject(new Error(`Failed to load ${_url}`))
            })
            img.src = _url
        })
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

        this.scene.traverse((object) =>
        {
            if(object.geometry)
            {
                object.geometry.dispose()
            }
            if(object.material)
            {
                object.material.dispose()
            }
        })

        this.debug.destroy()
    }
}
