import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

import { PearlBackground } from "./PearlBackground";
import { ClamLoading } from "../clam3DView/ClamLoading";
import { CameraControls } from './PearlCameraControls';

export const PearlScene = (props) => {
  const { children } = props;

  return (
    <Canvas
      camera={{
        fov: 50,
        aspect: 1,
        near: 0.005,
        far: 100,
        position: [0, 0.06, 2],
        zoom: 5,
      }}
      dpr={window.devicePixelRatio}
      onCreated={canvasCtx => {
        canvasCtx.gl.toneMapping = THREE.NoToneMapping;
        canvasCtx.gl.physicallyCorrectLights = true;
      }}
    >
      <Suspense fallback={<Html><ClamLoading /></Html>}>
        {children}
        <PearlBackground />
      </Suspense>
      <ambientLight
        args={[0xffffff, 2]}
      />
      <CameraControls />
    </Canvas>
  );
};
