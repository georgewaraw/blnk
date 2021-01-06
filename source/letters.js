import {
	Mesh,
	TextBufferGeometry,
	MeshPhongMaterial,
	VideoTexture
} from "three";
import { Utility } from "utility";
import { Shader } from "shader";


const letters = new Mesh();
letters.rotation.set( 270*Math.PI/180, 0, 0 );


letters.initialize = Utility.once( (font) => (
	
	letters.geometry = new TextBufferGeometry(
`A L L E H K
M O D N A R
E X X E S A
D R I N K D
O U B L E E
T I N K O S
S G E X X I
N A R A R A
O B O D Y N
R O N L R G`,
		{
			font,
			size: 5,
			height: 5
		}
	),
	letters.geometry.center(),
	
	letters.material = Shader.set(
		new MeshPhongMaterial({
			depthTest: false,
			transparent: true,
			opacity: 0.3
		}),
		{
			uTime: 0,
			uSpeed: 1,
			uMorph: 0,
			uDistort: 1
		},
		"letters"
	)
));

letters.fadeIn = Utility.once( (video) => (
	
	Utility.animate(
		0,
		0,
		100,
		() => {},
		() => (
			
			letters.material.map = new VideoTexture(video),
			letters.material.needsUpdate = true
		)
	),
	Utility.animate(
		0.3,
		0.9,
		1000,
		(v) => letters.material.opacity = v,
		() => letters.material.depthTest = true
	),
	Utility.animate(
		0,
		0.1,
		2000,
		(v) => Shader.get("letters").uniforms.uMorph.value = v
	),
	Utility.animate(
		1,
		0,
		2000,
		(v) => Shader.get("letters").uniforms.uDistort.value = v
	)
));


export { letters };
