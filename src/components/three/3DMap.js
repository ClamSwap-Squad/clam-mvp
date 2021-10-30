import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

// font awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearchPlus, faSearchMinus } from "@fortawesome/free-solid-svg-icons";

// THREE.JS LIBRARIES
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import loadGLTF from "./loaders/gltf_loader";
import CameraControls from 'camera-controls';

// local file functions
import "./3d_map.scss";
import createWater from "./create_water";
import createSky from "./create_sky";
import { LiteVersionSwitcher } from "../liteVersionSwitcher";
import { CAMERA_SETTINGS } from "constants/mapCameraSettings";

import { ISLAND_OBJECTS, ISLANDS_NAMES } from './constants';
import LoadingScreen from "components/LoadingScreen";
import { MapGuider } from "./mapGuider";
import { GuidedTourButton } from "./mapGuider/GuidedTourButton";

const clock = new THREE.Clock();

THREE.Cache.enabled = true;
CameraControls.install( { THREE: THREE } );

const Map3D = ({ isGuidedTourPassed, setIsGuidedTourPassed }) => {
  const mapRef = useRef(null);
  const hoverLabelRef = useRef(null);
  const cameraControls = useRef(null);
  const modelObjs = useRef([]);
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [hoverName, setHoverName] = useState("");

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  let renderer, scene, camera, water;

  let composer,
    outlinePass,
    effectFXAA,
    outlineMeshes = [],
    hoverStr = "";

  let lighthouseOutlineMeshes,
    farmOutlineMeshes,
    vaultOutlineMeshes,
    marketOutlineMeshes,
    bankOutlineMeshes;

  useEffect(() => {
    create3DScene(mapRef.current, setLoading);
  }, [mapRef]);

  const zoomIn = () => {
    cameraControls.current.dolly( 200, true )
  };

  const zoomOut = () => {
    cameraControls.current.dolly( -200, true )
  };

  const create3DScene = async (element, setLoading) => {
    renderer = new THREE.WebGLRenderer({ antialias: true, logarithmicDepthBuffer: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);

    element.appendChild(renderer.domElement);
    renderer.setClearColor(0xe1e1e1, 1);

    camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
    camera.position.set(650, 350, 500);

    const controls = new CameraControls( camera, renderer.domElement );
    controls.minDistance = CAMERA_SETTINGS.minDistance;
    controls.maxDistance = CAMERA_SETTINGS.maxDistance;
    controls.minPolarAngle = CAMERA_SETTINGS.minPolarAngle;
    controls.maxPolarAngle = CAMERA_SETTINGS.maxPolarAngle;
    controls.mouseButtons.right = CameraControls.ACTION.NONE;
    controls.saveState();
    cameraControls.current = controls;

    scene = new THREE.Scene();

    water = createWater({ scene });
    createSky({ scene, water, renderer });
    addLights();

    modelObjs.current = (await Promise.all(ISLAND_OBJECTS.map(k =>
      loadGLTF(k.objectUrl, scene, k.type, k.name)
    )))
      .map((model, index) => ({
        ...ISLAND_OBJECTS[index],
        model,
        boundingBox: ISLANDS_NAMES[ISLAND_OBJECTS[index].name] && new THREE.Box3().setFromObject(model),
      }));

      // Does it really need?
      Object.values(ISLANDS_NAMES).forEach(val => {
        const islandMesh = modelObjs.current.find(k => k.name === val).model.children[0];
        const pumpkinMesh = islandMesh.children.filter(({ name }) => name.startsWith('pumpkin'));
        pumpkinMesh.forEach((group) => {
          group.children.forEach(el => {
            if(el.material.name === "orange_material") {
              el.material.emissive = new THREE.Color( 0xff4700 );
              el.material.emissiveIntensity = 0.3;
            } else if(el.material.name === "eyes_pumkin") {
              el.material.emissive = new THREE.Color( 0xff6900 );
              el.material.emissiveIntensity = 1;
            }
          });
        });
      })

    setOutlineMeshes();

    setLoading(false);
    composer = new EffectComposer(renderer);
    console.log(scene);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    outlinePass = new OutlinePass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      scene,
      camera
    );
    outlinePass.edgeStrength = 10;
    outlinePass.edgeThickness = 2;
    outlinePass.pulsePeriod = 2;
    outlinePass.edgeGlow = 0.2;
    outlinePass.visibleEdgeColor.set(0x38dcdc);
    outlinePass.hiddenEdgeColor.set(0x38dcdc);
    composer.addPass(outlinePass);

    effectFXAA = new ShaderPass(FXAAShader);
    effectFXAA.uniforms["resolution"].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    composer.addPass(effectFXAA);

    renderer.domElement.addEventListener("mousemove", onMouseMove);
    renderer.domElement.addEventListener("click", onMouseClick);

    animate();
  };

  const addLights = () => {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.1);
    directionalLight.position.set(500, 400, -100);
    directionalLight.rotation.set(0, 0.3, -0.55);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.scale.set(150, 150, 150);
    directionalLight.shadow.mapSize.set(2048, 2048);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0);
    directionalLight2.position.set(-2700, 2000, 900);
    directionalLight2.rotation.set(0, 0.3, 0.6);

    scene.add(directionalLight2);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xe0fffc, 0);
    scene.add(hemiLight);

    /*const vaultPumpkin = new THREE.PointLight(0xf5a442, 1, 100);
    vaultPumpkin.position.set(0, 0, 0);
    vaultPumpkin.castShadow = true;
    scene.add(vaultPumpkin);

    const sphereSize = 100;
    const pointLightHelper = new THREE.PointLightHelper( vaultPumpkin, sphereSize );
    scene.add( pointLightHelper );*/

    const width = 10;
    const height = 10;
    const intensity = 5;
    /** First lamp */
    const pointLight = new THREE.PointLight( 0xffffff, 1, 500, 2);
    pointLight.position.set( -17, 57, 42 );
    scene.add( pointLight );

    const rectLight1 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight1.position.set( -10, 50, 48 );
    rectLight1.lookAt( -17, 57, 42 );
    scene.add( rectLight1 );

    const rectLight2 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight2.position.set( -26, 50, 38 );
    rectLight2.lookAt( -17, 57, 42 );
    scene.add( rectLight2 );

    /** Second lamp */
    const pointLight2 = new THREE.PointLight( 0xffffff, 1, 500, 2);
    pointLight2.position.set( 150, 57, -50 );
    scene.add( pointLight2 );

    const rectLight3 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight3.position.set( 149, 54, -41 );
    rectLight3.lookAt( 150, 57, -50 );
    scene.add( rectLight3 );

    const rectLight4 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight4.position.set( 162, 54, -57 );
    rectLight4.lookAt( 150, 57, -50 );
    scene.add( rectLight4 );

    /** Third lamp */
    const pointLight3 = new THREE.PointLight( 0xffffff, 1, 500, 2);
    pointLight3.position.set( 24, 47, -177 );
    scene.add( pointLight3 );

    const rectLight5 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight5.position.set( 20, 43, -171 );
    rectLight5.lookAt( 24, 47, -177 );
    scene.add( rectLight5 );

    const rectLight6 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight6.position.set( 27, 43, -182 );
    rectLight6.lookAt( 24, 47, -177 );
    scene.add( rectLight6 );

    /** Fourth lamp */
    const pointLight4 = new THREE.PointLight( 0xffffff, 1, 500, 2);
    pointLight4.position.set( -76, 46, -115);
    scene.add( pointLight4 );

    const rectLight7 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight7.position.set( -78, 43, -117 );
    rectLight7.lookAt( -76, 46, -115 );
    scene.add( rectLight7 );

    const rectLight8 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight8.position.set( -66, 43, -109 );
    rectLight8.lookAt( -76, 46, -115 );
    scene.add( rectLight8 );

    /** Fifth lamp */
    const pointLight5 = new THREE.PointLight( 0xffffff, 1, 500, 2);
    pointLight5.position.set( -78, 46,189);
    scene.add( pointLight5 );

    const rectLight9 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight9.position.set( -81, 44,185 );
    rectLight9.lookAt( -78, 46,189 );
    scene.add( rectLight9 );

    const rectLight10 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight10.position.set( -70, 44,195 );
    rectLight10.lookAt( -78, 46,189 );
    scene.add( rectLight10 );

    /** Sixth lamp */
    const pointLight6 = new THREE.PointLight( 0xffffff, 1, 500, 2);
    pointLight6.position.set( -76, 46,319);
    scene.add( pointLight6);

    const rectLight11 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight11.position.set( -68, 44,322 );
    rectLight11.lookAt( -76, 46,319 );
    scene.add( rectLight11 );

    const rectLight12 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight12.position.set( -85, 43,313 );
    rectLight12.lookAt( -76, 46,319 );
    scene.add( rectLight12 );

    /** Seventh lamp */
    const pointLight7 = new THREE.PointLight( 0xffffff, 1, 500, 2);
    pointLight7.position.set( -10, 46,353);
    scene.add( pointLight7);

    const rectLight13 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight13.position.set( -8, 44,357 );
    rectLight13.lookAt( -10, 46, 353 );
    scene.add( rectLight13 );

    const rectLight14 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight14.position.set( -22, 44,346 );
    rectLight14.lookAt( -10, 46, 353 );
    scene.add( rectLight14 );

    /** Eight lamp */
    const pointLight8 = new THREE.PointLight( 0xffffff, 1, 500, 2);
    pointLight8.position.set( 165, 98,-327);
    scene.add( pointLight8);

    const rectLight15 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight15.position.set( 158, 95,-320 );
    rectLight15.lookAt( 165, 98,-327 );
    scene.add( rectLight15 );

    const rectLight16 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight16.position.set( 165, 95,-333 );
    rectLight16.lookAt( 165, 98,-327 );
    scene.add( rectLight16 );

    /** Ninth lamp */
    const pointLight9 = new THREE.PointLight( 0xffffff, 1, 500, 2);
    pointLight9.position.set( 324, 96, -324);
    scene.add( pointLight9);

    const rectLight17 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight17.position.set( 320, 94, -320 );
    rectLight17.lookAt( 324, 96, -324 );
    scene.add( rectLight17 );

    const rectLight18 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight18.position.set( 328, 94, -328 );
    rectLight18.lookAt( 324, 96, -324 );
    scene.add( rectLight18 );

    /** Tenth lamp */
    const pointLight10 = new THREE.PointLight( 0xffffff, 1, 500, 2);
    pointLight10.position.set( 249, 120, -320);
    scene.add( pointLight10);

    const rectLight19 = new THREE.RectAreaLight( 0xffffff, intensity,  width, height );
    rectLight19.position.set( 249, 120, -316 );
    rectLight19.lookAt( 249, 120, -320 );
    scene.add( rectLight19 );
  };

  const getOutlineMesh = (name) => {
    const mesh = modelObjs.current.find(k => k.name === name).model;
    return mesh.children[0].children.filter((el) => el.name === name);
  };

  const setOutlineMeshes = () => {
    lighthouseOutlineMeshes = getOutlineMesh(ISLANDS_NAMES.lighthouse);
    farmOutlineMeshes = getOutlineMesh(ISLANDS_NAMES.farm);
    vaultOutlineMeshes = getOutlineMesh(ISLANDS_NAMES.vault);
    marketOutlineMeshes = getOutlineMesh(ISLANDS_NAMES.market);
    bankOutlineMeshes = getOutlineMesh(ISLANDS_NAMES.bank);

    outlineMeshes = [
      ...lighthouseOutlineMeshes,
      ...farmOutlineMeshes,
      ...marketOutlineMeshes,
      ...bankOutlineMeshes,
      ...vaultOutlineMeshes,
    ];
  };
  let now = Date.now();
  const animate = () => {
    let tDelta = (Date.now() - now) / 1000;
    now = Date.now();
    let t = clock.getElapsedTime();
    if (cameraControls.current) {
      cameraControls.current.update(tDelta);
    }

    requestAnimationFrame(animate);
    if (water) water.material.uniforms["time"].value += 1.0 / 60.0;

    modelObjs.current.forEach(k => {
      if (k.buoyancy) {
        giveBuoyancy(k.model, t, k.buoyancy.factor, k.buoyancy.init);
      }
    });

    flyingSeagulls(tDelta);
    swimmingDolphins(tDelta);

    composer.render();
  };

  const giveBuoyancy = (obj, t, factor, init) => {
    if (obj) {
      const delta = Math.sin(factor + t);
      const newPos = delta * factor;
      obj.position.y = init + newPos;
    }
  };

  const flyingSeagulls = (tDelta) => {
    const seagulls = modelObjs.current.find(k => k.type === 'seagull').model;
    if (seagulls) {
      seagulls.forEach((seagull) => {
        seagull.pivot.rotation.y += seagull.pivot.userData.speed + tDelta / 2;
      });
    }
  };

  const swimmingDolphins = (tDelta) => {
    const dolphins = modelObjs.current.find(k => k.type === 'dolphin').model;
    if (dolphins) {
      dolphins.forEach((dolphin, i) => {
        dolphin.pivot.rotation.x += tDelta;
        let zpos, xpos;
        if (i < 2) {
          zpos = Math.random() * 225 - 500;
          xpos = Math.random() * 70 - 150;
        } else {
          zpos = Math.random() * 100 + 350;
          xpos = Math.random() * 100 - 250;
        }
        if (THREE.Math.radToDeg(dolphin.pivot.rotation.x) % 360 > 120 && !dolphin.pivot.under) {
          dolphin.pivot.position.z = zpos;
          dolphin.pivot.position.x = xpos;
          dolphin.pivot.rotation.x += THREE.Math.degToRad(Math.random() * 90);
          dolphin.pivot.under = true;
        } else if (
          THREE.Math.radToDeg(dolphin.pivot.rotation.x) % 360 <= 120 &&
          THREE.Math.radToDeg(dolphin.pivot.rotation.x) % 360 >= 60
        ) {
          dolphin.pivot.under = false;
        }
      });
    }
  };

  const onMouseMove = (event) => {
    if (event.isPrimary === false) return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    checkIntersection(event);
  };

  const onMouseClick = () => {
    // places: bank, farm, market, vault, lighthouse
    console.log(modelObjs);
    if (hoverStr === '') return;
    const obj = modelObjs.current.find(k => k.name === hoverStr);
    if (obj && obj.url && obj.urlType === 'external') {
      return window.open(obj.url, '_blank');
    } else if (obj && obj.url) {
      return history.push(obj.url);
    } else {
      window.open('', '_self');
    }
  };

  const checkIntersection = () => {
    raycaster.setFromCamera(mouse, camera);
    const intersect = raycaster.intersectObjects(outlineMeshes, true)[0];
    if (intersect) {
      const interParent = intersect.object.parent.name;
      const currentHover = hoverStr;
      switch (interParent) {
        case ISLANDS_NAMES.lighthouse: {
          if (hoverStr !== ISLANDS_NAMES.lighthouse) {
            hoverStr = ISLANDS_NAMES.lighthouse;
            outlinePass.selectedObjects = lighthouseOutlineMeshes;
          }
          break;
        }
        case ISLANDS_NAMES.farm: {
          if (hoverStr !== ISLANDS_NAMES.farm) {
            hoverStr = ISLANDS_NAMES.farm;
            outlinePass.selectedObjects = farmOutlineMeshes;
          }
          break;
        }
        case ISLANDS_NAMES.market: {
          if (hoverStr !== ISLANDS_NAMES.market) {
            hoverStr = ISLANDS_NAMES.market;
            outlinePass.selectedObjects = marketOutlineMeshes;
          }
          break;
        }
        case ISLANDS_NAMES.bank: {
          if (hoverStr !== ISLANDS_NAMES.bank) {
            hoverStr = ISLANDS_NAMES.bank;
            outlinePass.selectedObjects = bankOutlineMeshes;
          }
          break;
        }
        case ISLANDS_NAMES.vault: {
          if (hoverStr !== ISLANDS_NAMES.vault) {
            hoverStr = ISLANDS_NAMES.vault;
            outlinePass.selectedObjects = vaultOutlineMeshes;
          }
          break;
        }
        default:
          console.error("intersect obj is not found");
      }
      if (currentHover !== hoverStr) {
        setHoverName(hoverStr);
      }

      // if (currentHover !== hoverStr) {
      //   setHoverName(hoverStr);
      //   const hoverLabel = hoverLabelRef.current;
      //   hoverLabel.style.left = event.clientX + 50 + "px";
      //   hoverLabel.style.top = event.clientY - 100 + "px";
      //   hoverLabel.style.display = "block";
      // }
    } else {
      if (hoverStr !== "") {
        hoverStr = "";
        outlinePass.selectedObjects = [];
        const hoverLabel = hoverLabelRef.current;
        hoverLabel.style.display = "none";
        setHoverName("");
      }
    }
  };

  return (
    <div>
      {loading && (
        <>
          <LoadingScreen text="Taking you to Clam Island..." />
          <LiteVersionSwitcher />
        </>
      )}
      <button className="zoom-btn zoom-in text-blue-500" onClick={zoomIn}>
        <FontAwesomeIcon icon={faSearchPlus} />
      </button>
      <button className="zoom-btn zoom-out text-blue-500" onClick={zoomOut}>
        <FontAwesomeIcon icon={faSearchMinus} />
      </button>
      <div
        className={`three-container ${hoverName !== "" ? "hover" : ""}`}
        id="container"
        ref={mapRef}
      />
      <div id="hoverLabel" ref={hoverLabelRef}>Opening Soon</div>
      {!isGuidedTourPassed && <MapGuider controls={cameraControls.current} islandModels={modelObjs.current} setIsGuidedTourPassed={setIsGuidedTourPassed} />}
      {isGuidedTourPassed && <GuidedTourButton setIsGuidedTourPassed={setIsGuidedTourPassed} />}
    </div>
  );
};

export default Map3D;
