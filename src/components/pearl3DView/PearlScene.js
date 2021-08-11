import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { ClamLoading } from "../clam3DView/ClamLoading";

export const PearlScene = (props) => {
  const { children } = props;
  return (
    <Canvas
      camera={{
        fov: 50,
        aspect: 1,
        near: 0.1,
        far: 10,
        position: [0, 0.06, 1],
        zoom: 10,
      }}
    >
      <Suspense fallback={<Html><ClamLoading /></Html>}>
        {children}
        <fog attach="fog" args={['#7b9eba', 1, 2]} />
        <color attach="background" args={['#7b9eba']} />
      </Suspense>
      <spotLight
        args={[0xffffff, 0.5, 28.08, 0.214, 0, 1]}
        position={[0, 8.856156, 1.400072]}
      />
      <OrbitControls
        target={[0, 0.028, 0]}
        minPolarAngle={0}
        maxPolarAngle={Math.PI/2 - 0.06}
        enableRotate={true}
        enablePan={false}
        enableZoom={false}
        panSpeed={0.2}
        rotateSpeed={0.2}
      />
    </Canvas>
  );
};
