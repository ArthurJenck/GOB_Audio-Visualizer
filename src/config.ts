const config = {
    volume: 0.5,
    positionX: 0,
    positionY: 0,
    radiusX: 41,
    radiusY: 35,
    autoRotationToggle: false,
    autoRotationSpeed: 0.5,
    rotation: 0.8,
    startAngle: 3.94,
    endAngle: 3.46,
    sizeDifference: -0.34,
    parallaxToggle: true,
    parallaxFactor: 0.57,
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
