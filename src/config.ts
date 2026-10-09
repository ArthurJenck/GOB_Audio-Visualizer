const config = {
    // Global
    volume: 0.5,

    // Ellipses
    strokeWidth: 1,
    positionX: 0,
    positionY: 0,
    radiusX: 35,
    radiusY: 35,
    autoRotationToggle: false,
    autoRotationSpeed: 0.5,
    rotation: 0.8,
    startAngle: 3.94,
    endAngle: 3.46,
    sizeDifference: -0.8,

    // Parallax
    parallaxToggle: true,
    parallaxFactor: 0.65,

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
}

export default config

export type Config = typeof config
