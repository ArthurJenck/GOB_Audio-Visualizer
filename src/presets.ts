import { defaultConfig, type Config } from './config'
import resize from './resize'

export function setPreset(
    config: Config,
    presetIndex: number,
    cycle: boolean = false
) {
    Object.assign(config, { ...defaultConfig, preset: presetIndex })
    if (cycle) {
        Object.assign(config, {
            ...presets[presetIndex],
            cycle: true,
        })
        return
    }
    const newPreset = presets[presetIndex]
    Object.assign(config, newPreset)
}

function updatePresetInterval(
    timeout: number = 1000,
    config: Config,
    startAt: number = 1
) {
    let i = startAt
    const timer = setInterval(function () {
        i++
        setPreset(config, i % presets.length, true)
    }, timeout)

    return timer
}

let intervalRef: number = 0
export function togglePresetCycle(enabled: boolean, config: Config) {
    const startAt = config.preset ? config.preset + 1 : 1
    if (enabled) {
        setPreset(config, startAt, true)
        intervalRef = updatePresetInterval(1000, config, startAt)
    } else {
        if (intervalRef) clearInterval(intervalRef)
    }
}

const { width, height } = resize()

const presets: Config[] = [
    { ...defaultConfig },
    {
        radiusY: 0,
        rotation: Math.PI / 2,
        startAngle: 0,
        endAngle: Math.PI * 2,
        followCursor: false,
        parallaxToggle: false,
        startPositionX: 24,
        startPositionY: height / 2,
        endPositionX: width - 24,
        endPositionY: height / 2 - height,
        minFreqThreshold: 0,
    },
    {
        strokeWidth: 2.15,
        radiusX: 35,
        radiusY: 35,
        autoRotationToggle: true,
        startAngle: 0,
        endAngle: Math.PI * 2,
        sizeDifference: 0.83,
        parallaxToggle: false,
        startPositionX: -width,
        startPositionY: -height,
        endPositionX: -width,
        endPositionY: -height,
        maxFreqThreshold: 255,
        valueFactor: 1.6,
        fillOpacity: 0.03,
    },
    {
        strokeWidth: 1.8,
        radiusX: 140,
        radiusY: 68.5,
        autoRotationToggle: true,
        autoRotationSpeed: 0.81,
        startAngle: 0.51,
        endAngle: 6.28,
        sizeDifference: -0.69,
        followCursor: false,
        parallaxToggle: false,
        startPositionX: (3 * width) / 4,
        startPositionY: height / 2 - 100,
        endPositionX: -width * 3,
        endPositionY: height * 2,
        valueFactor: 1.07,
        fillColor: 'rgb(24,109,237)',
        fillOpacity: 0.04,
    },
    {
        radiusX: 180,
        radiusY: 35,
        autoRotationToggle: true,
        autoRotationSpeed: 0.3,
        startAngle: 6.06,
        endAngle: 0.76,
        sizeDifference: -1.37,
        followCursor: false,
        parallaxToggle: false,
        startPositionX: (width * 85) / 100,
        startPositionY: height / 4,
        endPositionX: -width * 2,
        endPositionY: height * 0.625,
        valueFactor: 3,
        fillColor: 'rgb(255,92,44)',
    },
    {
        strokeWidth: 0.8,
        radiusX: 0,
        radiusY: 85,
        autoRotationToggle: true,
        autoRotationSpeed: 0.01,
        followCursor: false,
        parallaxToggle: false,
        startPositionX: width / 2,
        startPositionY: height / 2,
        endPositionX: -width / 2 - 10,
        endPositionY: -height / 2,
        valueFactor: 0,
        blendingMode: 'lighter',
    },
    {
        strokeWidth: 0.5,
        radiusX: 35,
        radiusY: 85,
        autoRotationToggle: true,
        autoRotationSpeed: 0.4,
        sizeDifference: -0.3,
        followCursor: true,
        parallaxToggle: true,
        parallaxFactor: 0,
        startPositionX: width / 2,
        startPositionY: height / 2,
        endPositionX: -width / 2 - 100,
        endPositionY: -height / 2,
        valueFactor: 1.1,
        blendingMode: 'darken',
        fillColor: 'rgb(235,14,54)',
        fillOpacity: 0.2,
    },
]

export default presets
