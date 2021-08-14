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
      .reduce((acc, _, index) => {
        const smoke1 = {
          positionX: Math.random() * 0.3 - 0.35,
          positionY: Math.random() * 0.1 + 0.036,
          positionZ: -0.13 - index * 0.014,
          key: index + '_1',
        };
        const smoke2 = {
          positionX: Math.random() * 0.3,
          positionY: Math.random() * 0.1 + 0.036,
          positionZ: -0.13 - index * 0.0135,
          key: index + '_2',
        };
        acc.push(smoke1, smoke2);
        return acc;
      }, [])
  );
  //0x6e85d2
  const [material] = useState(new THREE.MeshLambertMaterial({color: 0x6e85d2, map: texture, transparent: true, opacity: 1 }));
  const [geometry] = useState(new THREE.PlaneGeometry(0.15, 0.15));
  const { camera } = useThree();

  useEffect(() => {
    return () => {
      material.dispose();
      geometry.dispose();
    }
  }, [])
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
      //vec.add(groupRef.current.position);
      groupRef.current.lookAt(vec);

      const delta = clock.getDelta();
      groupRef.current.children.forEach((mesh) => {
        mesh.rotation.z += (delta * 15);
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
