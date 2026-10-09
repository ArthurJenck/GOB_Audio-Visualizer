const dpr = window.devicePixelRatio

function resize() {
    const widthWithDpr = window.innerWidth * (dpr / 2)
    const heightwithDpr = window.innerHeight * (dpr / 2)

    return {
        width: window.innerWidth,
        height: window.innerHeight,
        widthWithDpr,
        heightwithDpr,
    }
}

export default resize
