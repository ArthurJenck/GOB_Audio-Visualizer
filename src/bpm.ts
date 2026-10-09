import { guess } from 'web-audio-beat-detector'

let bpm: number = 0

async function getBpm(buffer: AudioBuffer) {
    if (bpm) return bpm
    await guess(buffer).then(({ bpm: detectedBpm }) => {
        bpm = detectedBpm
    })
    return bpm
}

export default getBpm
