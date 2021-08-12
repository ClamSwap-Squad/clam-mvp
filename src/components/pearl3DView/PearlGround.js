import { useTexture} from "@react-three/drei";

export const PearlGround = () => {
  const [texture] = useTexture(['/pearl-models/patterns/pearl_bg.jpg']);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh >
        <planeGeometry args={[2, 2]} />
        <meshStandardMaterial opacity={0.55} transparent={true} map={texture} />
      </mesh>
    </group>
  );
}
