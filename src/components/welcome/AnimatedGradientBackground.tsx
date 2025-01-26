import { useEffect, useRef } from 'react'

export default function AnimatedGradientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    let gradientPosition = { x: 0, y: 0 }
    let gradientVelocity = { x: 1, y: 1 }

    const drawGradient = () => {
      const { width, height } = canvas

      // Update gradient position
      gradientPosition.x += gradientVelocity.x
      gradientPosition.y += gradientVelocity.y

      // Bounce off edges
      if (gradientPosition.x <= 0 || gradientPosition.x >= width) {
        gradientVelocity.x *= -1
      }
      if (gradientPosition.y <= 0 || gradientPosition.y >= height) {
        gradientVelocity.y *= -1
      }

      // Create gradient
      const gradient = ctx.createRadialGradient(
        gradientPosition.x, gradientPosition.y, 0,
        gradientPosition.x, gradientPosition.y, Math.max(width, height)
      )
      gradient.addColorStop(0, 'white')
      gradient.addColorStop(1, 'lightgray')

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
    }

    const animate = () => {
      drawGradient()
      animationFrameId = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

