import { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei"
import * as THREE from "three";

export const Mist = () => {
  //const texture = useTexture('/pearl-models/patterns/cloud.png');
  const texture = useTexture('/pearl-models/patterns/mist-element.png');
  const ref = useRef(null);
  const [vec] = useState(new THREE.Vector3());
  const [material] = useState(new THREE.MeshLambertMaterial({color: 0xffffff, map: texture, transparent: true, opacity: 1 }));
  const [geometry] = useState(new THREE.PlaneGeometry(0.04, 0.04));
  const { camera } = useThree();

  useFrame(({ clock }) => {
    //console.log(camera.rotation);
    if (ref.current) {
      /*console.log(camera.position.x);
      ref.current.rotation.y = camera.rotation.y;*/
      camera.getWorldDirection( vec );
      vec.y = 0;
      vec.add(ref.current.position);
      ref.current.lookAt(vec);
      /*ref.current.children.forEach((mesh, i) => {
        const shiftX = Math.sin(clock.getElapsedTime() * (i + 1) / 5) * 0.002;
        const shiftY = Math.sin(clock.getElapsedTime() * (i + 1) / 5) * 0.001;
        mesh.position.x = defaultPosition.x + shiftX;
        mesh.position.y = defaultPosition.y + shiftY;
      });*/
    }
  })

  return (
    /*<group ref={ref}>
      <mesh position={[0, 0.02, -0.035]} rotation={[0, Math.PI, -Math.PI/2]}>
        <meshLambertMaterial color={0xb9a5cc} map={texture} transparent={true} opacity={1} />
        <planeGeometry args={[0.03, 0.07]} />
      </mesh>

    </group>*/
    <group ref={ref}>
      <mesh position={[0, 0.02, -0.035]} rotation={[0, Math.PI, Math.PI/2]} args={[geometry, material]} />
      <mesh position={[-0.005, 0.017, -0.036]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0, 0.015, -0.037]} rotation={[0, Math.PI, Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0.01, 0.017, -0.038]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0.02, 0.02, -0.039]} rotation={[0, Math.PI, Math.PI/2]} args={[geometry, material]} />
      <mesh position={[-0.025, 0.017, -0.040]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0, -0.015, -0.030]} rotation={[0, Math.PI, Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0.02, 0.017, -0.031]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0, 0.02, -0.035]} rotation={[0, Math.PI, Math.PI/2]} args={[geometry, material]} />
      <mesh position={[-0.005, 0.017, -0.036]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0, 0.015, -0.037]} rotation={[0, Math.PI, Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0.01, 0.017, -0.038]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0.02, 0.02, -0.039]} rotation={[0, Math.PI, Math.PI/2]} args={[geometry, material]} />
      <mesh position={[-0.025, 0.017, -0.040]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0, -0.015, -0.030]} rotation={[0, Math.PI, Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0.02, 0.017, -0.031]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0.01, 0.017, -0.041]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0.02, 0.02, -0.042]} rotation={[0, Math.PI, Math.PI/2]} args={[geometry, material]} />
      <mesh position={[-0.025, 0.017, -0.043]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0, -0.015, -0.044]} rotation={[0, Math.PI, Math.PI/2]} args={[geometry, material]} />
      <mesh position={[0, 0.017, -0.045]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
      <mesh position={[-0.01, 0.017, -0.046]} rotation={[0, Math.PI, -Math.PI/2]} args={[geometry, material]} />
    </group>
  );
};
