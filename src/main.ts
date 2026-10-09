import {
    calculateCirclePosition,
    calculateCircleRadius,
} from './circleCalculations'
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

// declare event listeners before callback is possible due to classical functions
addEventListener('resize', () => {
    const { width, height } = resize()
    canvas.width = width
    canvas.height = height
})
addEventListener('pointermove', onPointerMove)

// uploading custom music simply replaces the audioElement source before playing as usual
inputElement.addEventListener('change', async (e: Event) => {
    const target = e.currentTarget as HTMLInputElement
    if (!target.files) return
    const file = target.files[0]
    const url = URL.createObjectURL(file)

    audioElement.src = url

    setupCanvas()
})

// play default music without overriding audio element's source
playDefaultButton.addEventListener('click', async () => {
    setupCanvas()
})

async function setupCanvas() {
    // hide upload UI and display canvas + GUI
    hideMainUI()
    canvas.style.display = 'block'
    const guiElement = document.querySelector('.dg.main')! as HTMLElement
    guiElement.style.display = 'block'

    // setup context if no existing one
    audioContext || (await createContext())
    play()
    const { width, height } = resize()
    canvas.width = width
    canvas.height = height
    tick()
}

// on click, play/pause the music
canvas.addEventListener('click', () => {
    playing ? pause() : play()
    tick()
})
async function createContext() {
    audioContext = new AudioContext()

    const mediaSourceNode = audioContext.createMediaElementSource(audioElement)
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    analyserFrequencyBuffer = new Uint8Array(analyser.frequencyBinCount)
    gainNode = audioContext.createGain()

    // mediaSource (input) --> analyser --> gainNode (volume) --> context.destination(output)
    mediaSourceNode.connect(analyser)
    analyser.connect(gainNode)
    gainNode.connect(audioContext.destination)
}

function render() {
    // calculate elapsed time since simulation start + update time
    const currentTime = Date.now()
    delta = currentTime - time
    elapsed += delta
    time = currentTime

    analyser.getByteFrequencyData(analyserFrequencyBuffer)

    // cleanup canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.lineWidth = config.strokeWidth
    context.globalCompositeOperation =
        config.blendingMode as GlobalCompositeOperation

    gainNode.gain.value = config.volume

    // distance between cursor and center of canvas
    const distanceCursorCenter = {
        x: cursor.x - canvas.width / 2,
        y: cursor.y - canvas.height / 2,
    }

    // length of the buffer (= number of circles to display)
    const length = analyserFrequencyBuffer.length

    // convert rgb(x,y,z) syntax to array and use it as fillStyle with the tweaked opacity
    const fillColor = config.fillColor.split('(')[1].split(')')[0].split(',')
    context.fillStyle = `rgba(${fillColor[0]}, ${fillColor[1]}, ${fillColor[2]}, ${config.fillOpacity})`

    // Circles generation loop
    for (let i = 0; i < length; i++) {
        const frequencyValue = analyserFrequencyBuffer[i]

        // amount of motion a circle should have, depending on its index (first one moves a lot, last one almost doesn't at all), value ranges from 1->0
        const motionFactor = (length - i) / length
        // inverted aforementioned factor, for calculation purposes, ranges from 0->1
        const invertedFactor = 1 - motionFactor

        const position = {
            x: calculateCirclePosition(
                distanceCursorCenter.x,
                cursor.x,
                canvas.width / 2,
                motionFactor,
                invertedFactor,
                config.startPositionX,
                config.endPositionX
            ),
            y: calculateCirclePosition(
                distanceCursorCenter.y,
                cursor.y,
                canvas.height / 2,
                motionFactor,
                invertedFactor,
                config.startPositionY,
                config.endPositionY
            ),
        }

        const radius = {
            x: calculateCircleRadius(frequencyValue, config.radiusX, i),
            y: calculateCircleRadius(frequencyValue, config.radiusY, i),
        }

        // calculate rotation depending on the toggle for autoRotation, if enabled use the elapsed time and divide it by the autorotationSpeed inverted by 1000 as elapsed in in ms and multiplied by 1000 to make it matter
        const rotation = config.autoRotationToggle
            ? (elapsed / (1000 - config.autoRotationSpeed * 1000)) *
                  motionFactor +
              config.rotation
            : config.rotation

        // only draw if frequency value is in tweaked range : minFreq -> value -> maxFreq
        if (
            config.maxFreqThreshold >= frequencyValue &&
            frequencyValue >= config.minFreqThreshold
        ) {
            // beginPath should be in loop to prevent the shape to be one long stroke
            context.beginPath()
            context.ellipse(
                position.x,
                position.y,
                radius.x,
                radius.y,
                rotation,
                config.startAngle,
                config.endAngle
            )

            // fill if toggled in tweaks
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

function hideMainUI() {
    playDefaultButton.style.display = 'none'
    inputElement.style.display = 'none'
    inputContainerElement.style.display = 'none'

    const h1 = document.querySelector('h1')! as HTMLHeadingElement
    const buttonsContainer = document.querySelector(
        '.buttons'
    )! as HTMLDivElement

    h1.style.display = 'none'
    buttonsContainer.style.display = 'none'
}
