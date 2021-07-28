import React, { useEffect, useState, } from "react";
import ReactDOM from "react-dom";
import Konva from "konva";
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

import decodeDna from "../../components/three/3DClams/decodeDna";
import Accordion from "../../components/Accordion";
import lighting from "../../components/three/3DClams/config/lighting-setup-2.json";

import { get } from "lodash";
import "./ModalClam.css";

THREE.Cache.enabled = true;
const cWidth = 400, cHeight = 400, oldMode = true;

const RowStat = ({ label, value }) => (
	<div className="text-sm flex flex-row justify-between my-1">
		<div className="block">
			<p className="text-gray-500 font-semibold">{label}</p>
		</div>
		<div className="block">
			<p className="font-bold">{value}</p>
		</div>
	</div>
);
const loadTexture = (url) => {
	return new Promise((resolve) => {
		new THREE.TextureLoader().load(url, resolve);
	});
};
  
const setKonvaLayerTexture = (layer, color) => {
	layer.hue(parseFloat(color[0]));
	layer.saturation(parseFloat(color[1] / 100));
	layer.value(parseFloat(color[2] / 100));
	layer.batchDraw();
};

export class ModalClam extends React.Component {
	constructor(props) {
		super(props);
		this.mapInfo = [];
		this.clamsArr = [];
		this.state = {selClam:props.selClam, clams:props.clams};
	}
	componentDidMount() {
		this.initScene();
		this.animate();
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (this.state.selClam !== nextProps.selClam) {
			this.setState({selClam:nextProps.selClam}, () => {
				const {selClam} = this.state;
				if (!selClam) return;
				this.totalGroup.rotation.y = 0;
				if (oldMode) {this.camera.position.set(-0.4, 0.9, -1.4);}
				else  this.camera.position.set(0, 0.15, -0.3);
				this.camera.lookAt(0, 0, 0);
				
				this.totalGroup.children.forEach(child => {
					child.visible = child.dnaId === selClam.dna;
				});
			});
		}
		if (!this.clamsArr.length && nextProps.clams.length) {
			this.clamsArr = nextProps.clams;
			this.clamsArr.forEach(clamItem => {
				const traits = decodeDna(clamItem.dnaDecoded);
				const clamDir = "/clam-models/" + traits.shellShape.toLowerCase() + "/";
				const clamGroup = new THREE.Group(); clamGroup.position.z += 0.05;
				clamGroup.visible = false;
				clamGroup.dnaId = clamItem.dna;
				this.totalGroup.add(clamGroup);
				this.loadModel(clamDir, traits, 'shell', clamGroup);
			});
		}
	}

	loadAllTextures = async (traits, clamDir) => {
		const textures = [
			{
				type: "os",
				img: "outerPBS_basecolor.png",
				color: traits.shellColour.HSVadj || traits.shellColour,
			}, {
				type: "is",
				img: "innerPBS_basecolor.png",
				color: traits.innerColour.HSVadj || traits.innerColour,
			}, {
				type: "lip",
				img: "lip_basecolor.png",
				color: traits.lipColour.HSVadj || traits.lipColour,
			}, {
				type: "tongue",
				img: "tongue_BaseColor.png",
				color: traits.tongueColour.HSVadj || traits.tongueColour,
			},
		];
		const loaded = await Promise.all(
			textures.map((k) => loadTexture(clamDir + k.img))
		);
		const base = await loadTexture(
			"/clam-models/patterns/" + traits.pattern.toLowerCase() + "_basecolor.png"
		);
		return Promise.all(
			textures.map((k, i) => this.loadTextureKonva(k, loaded[i], base))
		);
	};

	loadTextureKonva = async (object, texture, base) => {
		const obj = object.type, img = texture.image, div = document.getElementById('konvaDiv'); // document.createElement("div");
		const stage = new Konva.Stage({ container: div, width: 1024, height: 1024 });// obj + '-canvas',
		const layer = new Konva.Layer();
		const imageArray = [];
		imageArray[obj] = new Konva.Image({ x: 0, y: 0, image: img, width: 1024, height: 1024 });
		layer.add(imageArray[obj]);

		if (obj === "os") {
			const pattern = new Konva.Image({ x: 0, y: 0, image: base.image, width: 1024, height: 1024 }); // fill: '#000', stroke: '#ff0000'
			layer.add(pattern);
		}
		layer.cache();
		layer.filters([Konva.Filters.HSV]);
		stage.add(layer);
		setKonvaLayerTexture(layer, object.color);
		return layer;
	};

	updateShellTextures = (containers, traits, clamGroup) => {
		const osCanvas = containers[0].toCanvas();
		const isCanvas = containers[1].toCanvas();
		const lipCanvas = containers[2].toCanvas();
		const tongueCanvas = containers[3].toCanvas();

		if (osCanvas && isCanvas && lipCanvas && tongueCanvas) {
			const osTexture = new THREE.CanvasTexture(osCanvas);
			const isTexture = new THREE.CanvasTexture(isCanvas);
			const lipTexture = new THREE.CanvasTexture(lipCanvas);
			const tongueTexture = new THREE.CanvasTexture(tongueCanvas);
		
			tongueTexture.rotation = Math.random() * Math.PI;
		
			tongueTexture.flipY = false;
			osTexture.flipY = false;
			isTexture.flipY = false;
			lipTexture.flipY = false;

			clamGroup.children[0].children.forEach((half) => {
				if (half.name == "crown") {
					half.material.map = osTexture;
				} else if (half.name == "lips") {
					half.material.map = lipTexture;
				} else {
					half.children[1].material.map = osTexture;
					if (
						traits.shellShape.toLowerCase() == "heart" ||
						traits.shellShape.toLowerCase() == "sharptooth" ||
						traits.shellShape.toLowerCase() == "hamburger" ||
						traits.shellShape.toLowerCase() == "fan"
					) {
						half.children[0].material.map = lipTexture;
						half.children[2].material.map = isTexture;
					} else {
						if (traits.shellShape != "maxima") {
							half.children[2].material.map = lipTexture;
						}
						half.children[0].material.map = isTexture;
					}
				}
			});
		
			clamGroup.children[1].children[0].material.map = tongueTexture;
		
			osTexture.needsUpdate = true;
			isTexture.needsUpdate = true;
			lipTexture.needsUpdate = true;
			tongueTexture.needsUpdate = true;
		}
	};

	initScene = () => {
		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha:true, preserveDrawingBuffer: true});
		this.renderer.setSize(cWidth, cHeight);
		if (!document.getElementById("clamModalContainer")) return false;
		document.getElementById("clamModalContainer").appendChild(this.renderer.domElement);
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
		this.renderer.gammaOutput = true;

		this.camera = new THREE.PerspectiveCamera(75, cWidth / cHeight, 0.1, 1000);
		if (oldMode) {this.camera.position.set(-0.4, 0.9, -1.4); this.camera.zoom = 7; this.camera.updateProjectionMatrix();}
		else  this.camera.position.set(0, 0.15, -0.3);

		this.scene = new THREE.Scene();
		this.totalGroup = new THREE.Object3D(); this.scene.add(this.totalGroup);

		var controls = new OrbitControls(this.camera, this.renderer.domElement);
		controls.enablePan = false;
		controls.enableZoom = false;
		controls.maxPolarAngle = Math.PI / 2;

		if (oldMode) {
			const src = new THREE.ObjectLoader().parse(lighting);
			let objs = src.children;
			do {
				objs[0].intensity *= 0.7;
				this.scene.add(objs[0]);
			} while (objs.length > 0);
		} else {
			const ambientLight = new THREE.AmbientLight( 0xFFFFFF, 0.8 ); this.scene.add( ambientLight );
			const shadowLight = new THREE.DirectionalLight( 0xFFFFFF, 1.5 ); this.scene.add( shadowLight ); shadowLight.position.set(1, 1, 1); shadowLight.castShadow = true;
			this.mainLight = new THREE.DirectionalLight( 0xFFFFFF, 0.6 ); this.scene.add( this.mainLight );
		}
		this.tongueMap = new THREE.TextureLoader().load('/clam-models/tongue-normal.png');
	}

	loadModel = async (clamDir, traits, type, clamGroup) => {
		const modelUrl = (type === 'shell')?clamDir + 'clam.glb': clamDir + 'Tongues/' + traits.tongue.toLowerCase() + '.glb';
		new GLTFLoader().load( modelUrl, async ( gltf ) => {
			const obj = gltf.scene.children[0];
			obj.traverse( (child) => {
				if (child instanceof THREE.Mesh) {
					child.castShadow = true;
					child.receiveShadow = true;
					if (child.material.map) child.material.map.anisotropy = 16;
					if (type === 'tongue') {
						child.material.normalMap = this.tongueMap;
					}
				}
			})
			clamGroup.add(obj);
			if (type === 'shell') {
				this.loadModel(clamDir, traits, 'tongue', clamGroup);
			} else {
				const layers = await this.loadAllTextures(traits, clamDir);
				setTimeout(() => {
					this.updateShellTextures(layers, traits, clamGroup);
				}, 500);
			}
		} );
	}

	animate=()=>{
		if (!this.camera || !this.scene) return;
		requestAnimationFrame(this.animate);
		if (this.mainLight) {
			const camPos = this.camera.position;
			this.mainLight.position.set(camPos.x, camPos.y, camPos.z);
		}
		this.totalGroup.rotation.y += 0.005;
		this.renderer.render(this.scene, this.camera);
	}

	accordionData = () => {
		const {selClam} = this.state;
		if (!selClam) return [];
		return [
			{
				title: "General Stats",
				description: (
					<div>
						<RowStat label="Rarity" value={selClam?get(selClam.dnaDecoded, "[0].rarity"):''} />
						<RowStat label="Lifespan" value={selClam?get(selClam.dnaDecoded, "[0].lifespan"):''} />
						<RowStat label="Size" value={selClam?get(selClam.dnaDecoded, "[0].size"):''} />
					</div>
				),
			}, {
				title: "Body",
				description: (
					<div>
						<RowStat label="Shape" value={selClam?get(selClam.dnaDecoded, "[0].shellShape"):''} />
						<RowStat label="Shell Color" value={selClam?get(selClam.dnaDecoded, "[0].shellColor"):''} />
						<RowStat label="Inner Color" value={selClam?get(selClam.dnaDecoded, "[0].innerColor"):''} />
						<RowStat label="Lip Color" value={selClam?get(selClam.dnaDecoded, "[0].lipColor"):''} />
						<RowStat label="Pattern" value={selClam?get(selClam.dnaDecoded, "[0].pattern"):''} />
					</div>
				),
			}, {
				title: "Tongue",
				description: (
					<div>
						<RowStat label="Shape" value={selClam?get(selClam.dnaDecoded, "[0].tongueShape"):''} />
						<RowStat label="Color" value={selClam?get(selClam.dnaDecoded, "[0].tongueColor"):''} />
					</div>
				),
			},
		];
	}

	onCloseModal = () => {
		this.props.onClose();
	}
	
	render () {
		const {selClam} = this.state;
		return (
			<div className={`clam-modal-back ${selClam?'active':''}`} >
				<div className='clam-modal-wrapper'>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" className='close' onClick={ this.onCloseModal }>
						<path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
					</svg>
					<div className='clam-modal-content'>
						<div className='content-part'>
							<div id='clamModalContainer'></div>
						</div>
						<div className='content-part right'>
							<Accordion data={this.accordionData()}></Accordion>
						</div>
					</div>
					<div className='clam-modal-footer'>
						<div className='button stake'>Stake in Farm</div>
						<div className='button sell'>Sell</div>
					</div>
				</div>
			</div>
		);
	}
}
	