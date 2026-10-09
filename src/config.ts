export const config = {
    // Global
    volume: 0.5,

    // Ellipses
    strokeWidth: 1,

    radiusX: 35,
    radiusY: 35,
    autoRotationToggle: false,
    autoRotationSpeed: 0.5,
    rotation: 0.8,
    startAngle: 3.94,
    endAngle: 3.46,
    sizeDifference: -0.8,

    // Position
    followCursor: true,
    parallaxToggle: true,
    parallaxFactor: 0.65,
    startPositionX: 0,
    startPositionY: 0,
    endPositionX: 0,
    endPositionY: 0,

    // Frequency values
    minFreqThreshold: 40,
    maxFreqThreshold: 250,
    valueFactor: 1.6,

    // Colors
    blendingMode: 'color',
    // Fill
    fill: true,
    fillColor: 'rgb(255,255,255)',
    fillOpacity: 1,

    // Presets
    preset: 0,
    cycle: false,
}

export const defaultConfig = { ...config } as Config

export type Properties = keyof Config
export type Config = Partial<typeof config>

export default config
