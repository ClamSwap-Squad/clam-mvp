import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";

import { PearlBackground } from "./PearlBackground";
import { ClamLoading } from "../clam3DView/ClamLoading";

export const PearlScene = (props) => {
  const { children } = props;
  return (
    <Canvas
      camera={{
        fov: 50,
        aspect: 1,
        near: 0.1,
        far: 100,
        position: [0, 0.06, 1],
        zoom: 10,
      }}
      dpr={window.devicePixelRatio}
    >
      <Suspense fallback={<Html><ClamLoading /></Html>}>
        {children}
        {/*<fog attach="fog" args={['#7b9eba', 1, 3]} />*/}
        {/*<color attach="background" args={['#7b9eba']} />*/}
        <PearlBackground />
      </Suspense>
      <spotLight
        args={[0xffffff, 0.5, 28.08, 0.214, 0, 1]}
        position={[0, 8.856156, 0]}
      />
      <OrbitControls
        target={[0, 0.028, 0]}
        minPolarAngle={0}
        maxPolarAngle={Math.PI/2 - 0.2}
        enableRotate={true}
        enablePan={false}
        enableZoom={false}
      />
    </Canvas>
  );
};
