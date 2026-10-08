import { GUI } from 'dat.gui'
import config from './config'

function createGUI() {
    const gui = new GUI()

    gui.add(config, 'volume', 0, 1, 0.01)

    const ellipsesFolder = gui.addFolder('Ellipses')
    ellipsesFolder.add(
        config,
        'positionX',
        -window.innerWidth,
        window.innerWidth,
        0.001
    )
    ellipsesFolder.add(
        config,
        'positionY',
        -window.innerHeight,
        window.innerHeight,
        0.001
    )
    ellipsesFolder.add(config, 'radiusX', 0, 500, 0.01)
    ellipsesFolder.add(config, 'radiusY', 0, 500, 0.01)
    ellipsesFolder.add(config, 'rotation', 0, 2 * Math.PI, 0.01)
    ellipsesFolder.add(config, 'startAngle', 0, 2 * Math.PI, 0.01)
    ellipsesFolder.add(config, 'endAngle', 0, 2 * Math.PI, 0.01)
    ellipsesFolder.add(config, 'spacing', -0.1, 0.1, 0.001)

    const valuesFolder = gui.addFolder('Frequency values')
    valuesFolder.add(config, 'minFreqThreshold', 0, 255)
    valuesFolder.add(config, 'maxFreqThreshold', 0, 255)
    valuesFolder.add(config, 'valueFactor', 0, 10, 0.001)

    const colorsFolder = gui.addFolder('Colors')
    colorsFolder.add(config, 'fill')
    colorsFolder.addColor(config, 'fillColor')
    colorsFolder.add(config, 'blendingMode', blendingModes)
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
