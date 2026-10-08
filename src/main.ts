import config from './config'
import createGUI from './gui'
import resize from './resize'

const canvas = document.querySelector('canvas')!
const context = canvas.getContext('2d')!
const audioElement = document.querySelector('audio')!
const inputContainerElement = document.querySelector(
    '.audio-input__container'
)! as HTMLElement
const inputElement = document.querySelector('#audio-input')! as HTMLElement
const playDefaultButton = document.querySelector(
    '#play-default-btn'
)! as HTMLElement

createGUI()

let audioContext: AudioContext
let playing = false
let analyser: AnalyserNode
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
canvas.addEventListener('click', () => {
    playing ? pause() : play()
    const { width, height } = resize()
    canvas.width = width
    canvas.height = height
    tick()
})

playDefaultButton.addEventListener('click', async () => {
    setupCanvas()
})

inputElement.addEventListener('change', async (e: Event) => {
    const target = e.currentTarget as HTMLInputElement
    if (!target.files) return
    const file = target.files[0]
    const url = URL.createObjectURL(file)

    audioElement.src = url

    setupCanvas()
})

async function setupCanvas() {
    hideButtons()
    canvas.style.display = 'block'
    const guiElement = document.querySelector('.dg.main')! as HTMLElement
    guiElement.style.display = 'block'

    audioContext || (await createContext())
    play()
    const { width, height } = resize()
    canvas.width = width
    canvas.height = height
    tick()
}

async function createContext() {
    audioContext = new AudioContext()

    const mediaSourceNode = audioContext.createMediaElementSource(audioElement)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
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

    analyser.getByteFrequencyData(analyserFrequencyBuffer)

    context.clearRect(0, 0, canvas.width, canvas.height)

    context.lineWidth = 1
    context.fillStyle = 'white'
    context.globalCompositeOperation =
        config.blendingMode as GlobalCompositeOperation

    gainNode.gain.value = config.volume

    const parallaxFactor = config.parallaxToggle ? config.parallaxFactor : 0
    const distanceCursorCenter = {
        x: cursor.x - canvas.width / 2,
        y: cursor.y - canvas.height / 2,
    }

    const length = analyserFrequencyBuffer.length

    for (let i = 0; i < length; i++) {
        const frequencyValue = analyserFrequencyBuffer[i]
        const factoredValueCalc =
            frequencyValue - (length / 4 - i) * config.valueFactor
        const factoredValue = factoredValueCalc < 0 ? 0 : factoredValueCalc

        context.beginPath()

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
    }
}

function tick() {
    requestAnimationFrame(tick)
    render()
}

function play() {
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

function hideButtons() {
    playDefaultButton.style.display = 'none'
    inputElement.style.display = 'none'
    inputContainerElement.style.display = 'none'
}
