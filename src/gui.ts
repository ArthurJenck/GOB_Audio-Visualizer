import { GUI } from 'dat.gui'
import config, { defaultConfig } from './config'
import presets from './presets'

function createGUI() {
    const gui = new GUI()

    gui.add(config, 'volume', 0, 1, 0.01).listen()

    const ellipsesFolder = gui.addFolder('Ellipses')
    ellipsesFolder.open()
    ellipsesFolder.add(config, 'strokeWidth', 0, 10, 0.01).listen()
    ellipsesFolder.add(config, 'radiusX', 0, 500, 0.01).listen()
    ellipsesFolder.add(config, 'radiusY', 0, 500, 0.01).listen()
    ellipsesFolder.add(config, 'autoRotationToggle').listen()
    ellipsesFolder.add(config, 'autoRotationSpeed', 0.01, 0.99, 0.01).listen()
    ellipsesFolder.add(config, 'rotation', 0, 2 * Math.PI, 0.01).listen()
    ellipsesFolder.add(config, 'startAngle', 0, 2 * Math.PI, 0.01).listen()
    ellipsesFolder.add(config, 'endAngle', 0, 2 * Math.PI, 0.01).listen()
    ellipsesFolder.add(config, 'sizeDifference', -1.5, 10, 0.001).listen()

    const positionsFolder = gui.addFolder('Positions')
    positionsFolder.open()
    positionsFolder.add(config, 'followCursor').listen()
    positionsFolder.add(config, 'parallaxToggle').listen()
    positionsFolder.add(config, 'parallaxFactor', 0, 1, 0.001).listen()
    positionsFolder
        .add(config, 'startPositionX', -window.innerWidth, window.innerWidth, 1)
        .listen()
    positionsFolder
        .add(
            config,
            'startPositionY',
            -window.innerHeight,
            window.innerHeight,
            1
        )
        .listen()
    positionsFolder
        .add(config, 'endPositionX', -window.innerHeight, window.innerHeight, 1)
        .listen()
    positionsFolder
        .add(config, 'endPositionY', -window.innerHeight, window.innerHeight, 1)
        .listen()

    const valuesFolder = gui.addFolder('Frequency values')
    valuesFolder.open()
    valuesFolder.add(config, 'minFreqThreshold', 0, 255).listen()
    valuesFolder.add(config, 'maxFreqThreshold', 0, 255).listen()
    valuesFolder.add(config, 'valueFactor', 0, 3, 0.001).listen()

    const colorsFolder = gui.addFolder('Colors')
    colorsFolder.open()
    colorsFolder.add(config, 'blendingMode', blendingModes).listen()

    const fillFolder = colorsFolder.addFolder('Fill')
    fillFolder.open()
    fillFolder.add(config, 'fill').listen()
    fillFolder.addColor(config, 'fillColor').listen()
    fillFolder.add(config, 'fillOpacity', 0, 1, 0.01).listen()

    const presetsFolder = gui.addFolder('Presets')
    presetsFolder.open()
    presetsFolder
        .add(config, 'preset', 0, presets.length - 1, 1)
        .onChange((presetIndex) => {
            const newPreset = presets[presetIndex]
            Object.assign(config, { ...defaultConfig, preset: presetIndex })
            Object.assign(config, newPreset)
        })
}

const blendingModes = [
    'source-over',
    'source-in',
    'source-out',
    'source-atop',
    'destination-over',
    'destination-in',
    'destination-out',
    'destination-atop',
    'lighter',
    'copy',
    'xor',
    'multiply',
    'screen',
    'overlay',
    'darken',
    'lighten',
    'color-dodge',
    'color-burn',
    'hard-light',
    'soft-light',
    'difference',
    'exclusion',
    'hue',
    'saturation',
    'color',
    'luminosity',
]

export default createGUI
