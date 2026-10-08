const dpr = window.devicePixelRatio

function resize() {
    const width = window.innerWidth * (dpr / 2)
    const height = window.innerHeight * (dpr / 2)

    return { width, height }
}

export default resize
