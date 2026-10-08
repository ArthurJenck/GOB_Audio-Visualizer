let cursor = { x: window.innerWidth, y: window.innerHeight }

export function onPointerMove(e: PointerEvent) {
    cursor.x = e.clientX
    cursor.y = e.clientY
}

export default cursor
