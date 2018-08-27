export default class Animation
{
    constructor(_options)
    {
        this.defaultDuration = typeof _options.defaultDuration !== 'undefined' ? _options.defaultDuration : 1000

        this.time = null
        this.start = null
        this.delta = null
        this.duration = null
        this.progress = 0
        this.running = false
    }

    frame()
    {
        const time = Date.now()
        this.delta = time - this.time

        this.time = time
    }

    play(_duration = null)
    {
        this.duration = _duration === null ? this.defaultDuration : _duration
        this.time = Date.now()
        this.start = this.time

        this.frame()
    }
}
