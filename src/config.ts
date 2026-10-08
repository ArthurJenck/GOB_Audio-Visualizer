const config = {
    volume: 0.5,
    positionX: -208,
    positionY: -255,
    radiusX: 41,
    radiusY: 35,
    rotation: 0.8,
    startAngle: 3.94,
    endAngle: 3.46,
    spacing: -0.34,
    minFreqThreshold: 40,
    maxFreqThreshold: 250,
    valueFactor: 1.5,
    fill: true,
    fillColor: 'rgb(255,255,255)',
    fillOpacity: 1,
    blendingMode: 'color',
}

export default config

export type Config = typeof config
