import {
	Color,
	WebGL1Renderer,
	Scene,
	FogExp2,
	PerspectiveCamera
} from "three";
import { Utility } from "utility";

let Game = {
	canvas: null,
	renderer: null,
	scene: null,
	camera: null,
	
	render: null,
	resize: null,
	did: null,
	begin: null,
	end: null,
	reset: null
};

const color = new Color("pink");
let state = "not begin";


Game.canvas = document.getElementById("canvas");

Game.renderer = new WebGL1Renderer({ canvas: Game.canvas });
Game.renderer.setPixelRatio(0.125);
Game.renderer.setSize( window.innerWidth, window.innerHeight );
Game.renderer.sortObjects = false;

Game.scene = new Scene();
Game.scene.background = color;
Game.scene.fog = new FogExp2( color, 0.001 );

Game.camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );


Game.render = Utility.once( (callbacks) => (
	
	Game.renderer.compile( Game.scene, Game.camera ),
	Game.renderer.setAnimationLoop( (time) => (
		
		callbacks.map( (e) => e(time/1000) ),
		
		Game.renderer.render( Game.scene, Game.camera )
	))
));

Game.resize = () => (
	
	Game.renderer.setSize( window.innerWidth, window.innerHeight ),
	
	Game.camera.aspect = window.innerWidth/window.innerHeight,
	Game.camera.updateProjectionMatrix()
);

Game.did = () => state;

Game.begin = () => state = "begin";

Game.end = () => state = "end";

Game.reset = (() => {
	
	let c = -1;
	
	return () => (c+=1) && window.location.reload();
})();


Game = Object.freeze(Game);

export { Game };
