import { useRef, useState, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei"
import * as THREE from "three";

import { generateSmokeParticles } from "../../utils/mist";

export const Mist = () => {
  const texture = useTexture('/pearl-models/patterns/mist-element.png');
  const groupRef = useRef(null);
  const [vec] = useState(new THREE.Vector3());

  const [smokeParticles] = useState(generateSmokeParticles());
  const { camera } = useThree();

  const smokes = useMemo(() => {
    return smokeParticles.map((particle) => (
      <mesh
        position={[particle.positionX, particle.positionY, particle.positionZ]}
        rotation={[0, Math.PI, Math.PI/2 * particle.rotationZ]}
        key={particle.key}
      >
        <meshLambertMaterial color={0xffffff} map={texture} transparent={true} opacity={1} />
        <planeGeometry args={[0.15, 0.15]} />
      </mesh>
    ))
  }, [smokeParticles])

  useFrame(() => {
    if (groupRef.current) {
      camera.getWorldDirection( vec );
      vec.y = 0;
      vec.add(groupRef.current.position);
      groupRef.current.lookAt(vec);

      groupRef.current.children.forEach((mesh) => {
        mesh.rotation.z += (0.0015);
        const positionX = mesh.position.x;
        if (positionX < -0.35) {
          mesh.position.x = 0.35;
        } else {
          mesh.position.x -= 0.0003;
        }
      });
    }
  })

  return (
    <group ref={groupRef}>
      {smokes}
    </group>
  );
};
