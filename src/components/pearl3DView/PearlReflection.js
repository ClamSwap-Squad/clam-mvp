import {Reflector, useTexture} from "@react-three/drei";

export const PearlReflection = () => {
  const [texture] = useTexture(['/clam-models/clam-template-bg-3.png']);
  return (
    <Reflector
      resolution={1024}
      mirror={0}
      mixBlur={1}
      mixStrength={2}
      depthScale={0.5}
      minDepthThreshold={0.8}
      maxDepthThreshold={1.1}
      rotation-x={-Math.PI / 2}
      args={[2, 2]}
    >
      {(Material, props) =>
        <Material
          {...props}
          metalness={0}
          roughness={0.5}
          color="#ddd"
          map={texture}
        />}
    </Reflector>
  )
}
