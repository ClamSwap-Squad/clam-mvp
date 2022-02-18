import React, { useRef, useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise";

const seed = 0;
const noiseWidth = 0.015;
const noiseHeight = 0.03;

const getNoise = (vertice) =>
  ImprovedNoise().noise(
    seed + vertice.x / noiseWidth,
    seed + vertice.y / noiseWidth,
    seed + vertice.z / noiseWidth
  );

console.log(
  getNoise({
    x: 0.01,
    y: 0.02,
    z: 0.03,
  })
)
export default function Model(props) {
  const group = useRef();
  const { nodes, materials } = useGLTF("/pearl-models/Pearl_oval.glb");
  const {
    map,
    envMap,
    emissiveMap,
    envMapIntensity,
    color,
    emissive,
    emissiveIntensity,
    roughness,
    onBeforeCompile,
    glowMaterial,
    backGlowMaterial,
  } = props;

  const [noiseGeometry, setNoiseGeometry] = useState(null);

  useEffect(() => {
    const clonedGeometry = nodes.Oval.geometry.clone();
    const position = clonedGeometry.getAttribute("position");

    const vector = new THREE.Vector3();
    const vertices = [];
    for (let i = 0, l = position.count; i < l; i++) {
      vector.fromBufferAttribute(position, i);
      vector.applyMatrix4(nodes.Oval.matrixWorld);
      vertices.push(vector.clone());
    }

    const noiseMap = vertices.map(getNoise),
      noiseMax = Math.max(...noiseMap),
      noiseMin = -Math.min(...noiseMap);

    for (const v in vertices) {
      if (noiseMap[v] > 0) {
        vertices[v]
          .elevation = noiseMap[v] / noiseMax;
      } else {
        vertices[v]
          .elevation = noiseMap[v] / noiseMin;
      }
      vertices[v]
        .multiplyScalar(1 + vertices[v].elevation * noiseHeight);
    }

    const newPosition = [];
    for (const vert of vertices) {
      newPosition.push(vert.x, vert.y, vert.z);
    }

    clonedGeometry.attributes.position.array = clonedGeometry.attributes.position.array.map(
      (val, i) => newPosition[i]
    );

    setNoiseGeometry(clonedGeometry);
  }, []);

  return (
    <group ref={group} {...props}>
      <mesh geometry={noiseGeometry} material={materials.Pearl}>
        <meshStandardMaterial
          {...materials.Pearl}
          map={map}
          envMap={envMap}
          emissiveMap={emissiveMap}
          envMapIntensity={envMapIntensity}
          emissiveIntensity={emissiveIntensity}
          emissive={emissive}
          color={color}
          roughness={roughness}
          //onBeforeCompile={onBeforeCompile}
        />
      </mesh>
      {glowMaterial && (
        <mesh
          geometry={nodes.Oval.geometry}
          material={glowMaterial}
          scale={1.025}
          layers={1}
          position={[0, -0.001, 0]}
        />
      )}
      {backGlowMaterial && (
        <mesh
          geometry={nodes.Oval.geometry}
          material={backGlowMaterial}
          scale={1.1}
          position={[0, -0.002, 0]}
          layers={1}
        />
      )}
    </group>
  );
}
