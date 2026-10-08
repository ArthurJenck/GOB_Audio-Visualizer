import config from './config'
import createGUI from './gui'

const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!
const audioElement = document.querySelector('audio')!

createGUI()

let audioContext: AudioContext
let playing = false
let analyser: AnalyserNode
let analyserTimeDomainBuffer: Uint8Array<ArrayBuffer>
let analyserFrequencyBuffer: Uint8Array<ArrayBuffer>
let gainNode: GainNode
let time = 0
let delta = 0
let elapsed = 0

addEventListener('resize', resize)
canvas.addEventListener('click', async () => {
    audioContext || (await createContext())
    playing ? pause() : play()
    resize()
    tick()
})

async function createContext() {
    audioContext = new AudioContext()

    const mediaSourceNode = audioContext.createMediaElementSource(audioElement)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    analyserTimeDomainBuffer = new Uint8Array(analyser.frequencyBinCount)
    analyserFrequencyBuffer = new Uint8Array(analyser.frequencyBinCount)

    mediaSourceNode.connect(analyser)

    gainNode = audioContext.createGain()
    analyser.connect(gainNode)
    gainNode.connect(audioContext.destination)
}

function render() {
    const currentTime = Date.now()
    delta = time ? currentTime - time : 0
    elapsed += delta
    time = currentTime

    analyser.getByteTimeDomainData(analyserTimeDomainBuffer)
    analyser.getByteFrequencyData(analyserFrequencyBuffer)

    context.clearRect(0, 0, canvas.width, canvas.height)
    // context.fillStyle = 'rgba(255,255,255,0.1)'
    // context.fillRect(0, 0, canvas.width, canvas.height)

    context.lineWidth = 1
    context.fillStyle = 'white'
    context.globalCompositeOperation =
        config.blendingMode as GlobalCompositeOperation

    gainNode.gain.value = config.volume

    // context.beginPath()
    // context.arc(100, 100, 50, 0, 2 * Math.PI)
    // context.stroke()

    // const sliceWidth =
    //     canvas.width / analyserFrequencyBuffer.length + config.sliceWidthOffset

    // const barWidth = canvas.width / 2 / analyserFrequencyBuffer.length
    // let x = 0

    for (let i = 0; i < analyserFrequencyBuffer.length; i++) {
        // const timeDomainValue = analyserTimeDomainBuffer[i]
        const frequencyValue = analyserFrequencyBuffer[i]
        const factoredValue =
            frequencyValue -
            (analyserFrequencyBuffer.length / 4 - i) * config.valueFactor

        context.beginPath()

        // context.strokeStyle = `rgb(${255 - effectiveValue}, ${255 - effectiveValue}, ${255 - effectiveValue})`
        context.fillStyle = config.fillColor
        context.ellipse(
            frequencyValue * 2 + canvas.width / 2 + config.positionX,
            frequencyValue * 2 + canvas.height / 2 + config.positionY,
            (factoredValue / 100) * config.radiusX + i * config.spacing,
            (factoredValue / 100) * config.radiusY + i * config.spacing,
            // elapsed / 1000 + config.rotation,
            config.rotation,
            config.startAngle,
            config.endAngle
        )

        if (
            config.maxFreqThreshold >= frequencyValue &&
            frequencyValue >= config.minFreqThreshold
        ) {
            if (config.fill) context.fill()
            context.stroke()
        }
        // if (frequencyValue <= config.minFreqThreshold) return
        // if (frequencyValue === config.maxFreqThreshold) return

        // context.save()
        // context.translate(canvas.width / 2, canvas.height / 2)
        // context.rotate((i * (Math.PI * 10)) / analyserFrequencyBuffer.length)

        // const hue = i * 2
        // context.fillStyle = `hsl(${hue}, 100%, 50%)`

        // const red = (i * barHeight) / 30
        // const green = i / 2
        // const blue = barHeight / 2

        // context.fillStyle = `rgb(${red},${green},${blue})`
        // context.fillRect(0, 0, barWidth, barHeight)
        // x += barWidth

        // context.restore()
    }

    // for (let i = 0; i < analyserFrequencyBuffer.length; i++) {
    //     const v = analyserFrequencyBuffer[i] / 128
    //     const y = (v * canvas.height) / 2

    //     if (i === 0) {
    //         context.moveTo(x, y)
    //     } else {
    //         context.lineTo(x, y)
    //     }

    // x += sliceWidth
    // }

    // context.lineTo(canvas.width, canvas.height / 2)
    // context.stroke()
}

// const noise2D = createNoise2D()

// function drawNoise() {
//     const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

//     for (let x = 0; x < canvas.width; x++) {
//         for (let y = 0; y < canvas.height; y++) {
//             const i = (x + y * canvas.width) * 4
//             const value = (noise2D(x, y) + 1) * 128
//             imageData[i] = value
//             imageData[i + 1] = value
//             imageData[i + 2] = value
//             imageData[i + 3] = 255
//         }
//         context.putImageData(imageData, 0, 0)
//     }
// }

function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
}

function tick() {
    requestAnimationFrame(tick)
    render()
}

function play() {
    // drawNoise()

    playing = true
    time = Date.now()
    audioElement.play()
}

function pause() {
    playing = false
    audioElement.pause()
}
