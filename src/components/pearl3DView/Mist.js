import { useRef, useState, useEffect, useMemo } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei"
import * as THREE from "three";

export const Mist = () => {
  //const texture = useTexture('/pearl-models/patterns/cloud.png');
  const texture = useTexture('/pearl-models/patterns/mist-element.png');
  const groupRef = useRef(null);
  const [vec] = useState(new THREE.Vector3());
  const [smokeParticles] = useState(
    Array.from({ length: 33 })
      .map((_, index) => ({
        positionX: Math.random() * 0.3 - 0.15,
        positionY: Math.random() * 0.1 + 0.036,
        positionZ: -0.13 - index * 0.0135,
        key: index,
      }))
  );

  const [material] = useState(new THREE.MeshLambertMaterial({color: 0x6e85d2, map: texture, transparent: true, opacity: 1 }));
  const [geometry] = useState(new THREE.PlaneGeometry(0.2, 0.25));
  const { camera } = useThree();

  const smokes = useMemo(() => {
    return smokeParticles.map((particle) => (
      <mesh
        position={[particle.positionX, particle.positionY, particle.positionZ]}
        rotation={[0, Math.PI, Math.PI/2]}
        args={[geometry, material]}
        key={particle.key}
      />
    ))
  }, [smokeParticles])

  useFrame(({ clock }) => {
    if (groupRef.current) {
      camera.getWorldDirection( vec );
      vec.y = 0;
      vec.add(groupRef.current.position);
      groupRef.current.lookAt(vec);

      const delta = clock.getDelta();
      groupRef.current.children.forEach((mesh, i) => {
        let k = 1;
        if (i % 2) {
          k = -1;
        }
        mesh.rotation.z += (delta * 0.2);
        mesh.position.x = smokeParticles[i].positionX + Math.sin(clock.elapsedTime * 0.4)* 0.1 * k;
      });
    }
  })

  return (
    <group ref={groupRef}>
      {smokes}
    </group>
  );
};
