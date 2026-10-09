import config from './config'

export function calculateCirclePosition(
    distanceCursorCenter: number,
    cursorPosition: number,
    canvasCenter: number,
    motionFactor: number,
    invertedMotionFactor: number,
    tweakedPosition: number
): number {
    // calculate offset depending on parallax enabled or not, using the distance from the cursor to the center with the tweaked parallax factor multiplied by the inverted motion factor. Otherwise, use the basic tweaked position with the inverted motion factor
    const offset = config.parallaxToggle
        ? -distanceCursorCenter * config.parallaxFactor * invertedMotionFactor
        : tweakedPosition * invertedMotionFactor

    // use the motionFactor with the cursor position, the invertedMotionFactor with the center of the canvas (so the last element is as close from the center as possible) then add calculated offset
    return (
        motionFactor * cursorPosition +
        invertedMotionFactor * canvasCenter +
        offset
    )
}

export function calculateCircleRadius(
    value: number,
    baseRadius: number,
    index: number
): number {
    // take into account valueFactor if modified by tweaks
    const factoredValue = Math.max(
        value - (length / 4 - index) * config.valueFactor,
        0
    )

    // uses the frequency value as factor, use it with the baseRadius given in tweaks, then adds the tweaked sizeDifference multiplied by the circle index
    return Math.max(
        (factoredValue / 100) * baseRadius + index * config.sizeDifference,
        0
    )
}
