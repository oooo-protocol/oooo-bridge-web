import confetti from 'canvas-confetti'

const createSingleConfetti = (options: confetti.Options = {}) => {
  const colors = [
    '#26ccff',
    '#a25afd',
    '#ff5e7e',
    '#88ff5a',
    '#fcff42',
    '#ffa62d',
    '#ff36ff'
  ]

  const getRandomColor = () => {
    return colors[Math.floor(Math.random() * 7) + 1]
  }

  const defaultOptions = {
    particleCount: 2,
    spread: 55,
    scalar: 1,
    colors: [getRandomColor(), getRandomColor()]
  }

  void confetti({
    ...defaultOptions,
    ...options,
    angle: 60,
    origin: { x: 0 }
  })
  void confetti({
    ...defaultOptions,
    ...options,
    angle: 120,
    origin: { x: 1 }
  })
}

export const createConfetti = async (timer: number, options?: confetti.Options) => {
  await new Promise<void>((resolve) => {
    const end = Date.now() + timer

    const frame = () => {
      createSingleConfetti(options)

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      } else {
        resolve()
      }
    }

    frame()
  })
}
