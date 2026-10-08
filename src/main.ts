import config from './config'
import createGUI from './gui'
import resize from './resize'

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
let cursor = { x: window.innerWidth, y: window.innerHeight }

addEventListener('resize', () => {
    const { width, height } = resize()
    canvas.width = width
    canvas.height = height
})
addEventListener('pointermove', onPointerMove)
canvas.addEventListener('click', async () => {
    audioContext || (await createContext())
    playing ? pause() : play()
    const { width, height } = resize()
    canvas.width = width
    canvas.height = height
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
    //     canvas.width / length + config.sliceWidthOffset

    // const barWidth = canvas.width / 2 / length
    // let x = 0

    const parallaxFactor = config.parallaxToggle ? config.parallaxFactor : 0
    const distanceCursorCenter = {
        x: cursor.x - canvas.width / 2,
        y: cursor.y - canvas.height / 2,
    }

    const length = analyserFrequencyBuffer.length

    for (let i = 0; i < length; i++) {
        // const timeDomainValue = analyserTimeDomainBuffer[i]
        const frequencyValue = analyserFrequencyBuffer[i]
        const factoredValueCalc =
            frequencyValue - (length / 4 - i) * config.valueFactor
        const factoredValue = factoredValueCalc < 0 ? 0 : factoredValueCalc

        context.beginPath()

        // context.strokeStyle = `rgb(${255 - effectiveValue}, ${255 - effectiveValue}, ${255 - effectiveValue})`
        const fillColor = config.fillColor
            .split('(')[1]
            .split(')')[0]
            .split(',')
        context.fillStyle = `rgba(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]}, ${config.fillOpacity})`

        const motionFactor = (length - i) / length
        const invertedFactor = 1 - motionFactor

        const offset = config.parallaxToggle
            ? {
                  x: -distanceCursorCenter.x * parallaxFactor * invertedFactor,
                  y: -distanceCursorCenter.y * parallaxFactor * invertedFactor,
              }
            : {
                  x: config.positionX * invertedFactor,
                  y: config.positionY * invertedFactor,
              }

        const positionX =
            motionFactor * cursor.x +
            invertedFactor * (canvas.width / 2) +
            offset.x

        const positionY =
            motionFactor * cursor.y +
            invertedFactor * (canvas.height / 2) +
            offset.y

        const radiusX =
            (factoredValue / 100) * config.radiusX + i * config.sizeDifference

        const radiusY =
            (factoredValue / 100) * config.radiusY + i * config.sizeDifference

        const rotation = config.autoRotationToggle
            ? elapsed / (1000 - config.autoRotationSpeed * 1000) +
              config.rotation
            : config.rotation

        context.ellipse(
            positionX,
            positionY,
            radiusX,
            radiusY,
            rotation,
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
        // context.rotate((i * (Math.PI * 10)) / length)

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

    // for (let i = 0; i < length; i++) {
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

function onPointerMove(e: PointerEvent) {
    cursor.x = e.clientX
    cursor.y = e.clientY
}
