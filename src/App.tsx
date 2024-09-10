import { Camera, Canvas } from "@react-three/fiber"
import { useGLTF, useAnimations } from "@react-three/drei"
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from "react"
import { Vector3 } from "three"
import { FaPlay } from "react-icons/fa"

const CARD_FILE = "./card.gltf"

const pi = Math.PI

const degToRad = (degrees: number) => (degrees * pi) / 180
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max))

const Card = ({ gltf, reset, setReset }: any) => {
  const ref = useRef() as any
  const animations = useAnimations(gltf.animations, ref)
  useLayoutEffect(() => {
    if (reset) {
      const showUp = animations.actions.showUp
      if (showUp) {
        showUp.reset()
        showUp.repetitions = 0
        showUp.clampWhenFinished = true
        showUp.play()
      }
      setReset(false)
    }
  }, [reset, animations])
  return <primitive object={gltf.scene} ref={ref} />
}

const App = () => {
  const gltf = useGLTF(CARD_FILE)
  const [reset, setReset] = useState(true)
  const [move, setMove] = useState(false)
  const [deg, setDeg] = useState(0)
  const handleMovement = (e: any) => {
    if (move) {
      setDeg((d) => clamp(d + e.movementX / 500, degToRad(-180), degToRad(180)))
    }
  }

  useEffect(() => {
    gltf.nodes.Card.setRotationFromAxisAngle(new Vector3(0, 1, 0), deg)
  }, [deg])
  const handleMouseUp = () => {
    setMove(false)
  }
  const handleMouseDown = () => {
    setMove(true)
  }
  const handleTouch = (e: any) => {
    setDeg((d) =>
      clamp(d + e.changedTouches[0] / 500, degToRad(-180), degToRad(180)),
    )
  }

  return (
    <div className="flex flex-col items-center bg-gray-100 p-8 min-h-screen gap-8">
      <button
        className="p-2 rounded-md bg-white"
        onClick={() => {
          setReset(true)
        }}
      >
        <FaPlay />
      </button>
      <div
        className="w-full aspect-[3/2] rounded-md overflow-hidden max-w-3xl"
        onMouseMove={handleMovement}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouch}
      >
        <Canvas camera={gltf.cameras[0] as Camera}>
          <Card gltf={gltf} reset={reset} setReset={setReset} />
          <Suspense fallback={null} />
        </Canvas>
      </div>
    </div>
  )
}

useGLTF.preload(CARD_FILE)

export default App
