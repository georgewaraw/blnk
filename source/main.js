import { Utility } from "utility";
import { Shader } from "shader";
import { Game } from "game";
import { Light } from "light";
import { Score } from "score";
import { Sound } from "sound";
import { player } from "player";
import { enemies } from "enemies";
import { letters } from "letters";
import { buildings } from "buildings";
import { room } from "room";

Utility.font("VT323_Regular").then( (VT323_Regular) => Utility.audio("background").then( (background) => Utility.audio("hit").then( (hit) => {
	
	background.name = "background";
	hit.name = "hit";
	
	document.getElementById("loading").remove();
	
	const video = {
		building_0: document.getElementById("building_0"),
		building_1: document.getElementById("building_1"),
		building_2: document.getElementById("building_2"),
		building_3: document.getElementById("building_3"),
		building_4: document.getElementById("building_4"),
		enemies: document.getElementById("enemies"),
		walls: document.getElementById("walls"),
		windows: document.getElementById("windows")
	};
	
	const begin = () => (
		
		Object.keys(video).map( (e) => video[e].play() ),
		
		Game.begin(),
		Sound.initialize(),
		Sound.play( background, true ),
		player.spawn(),
		letters.fadeIn( video.walls ),
		buildings.fadeIn(),
		room.fadeIn()
	);
	
	Game.canvas.addEventListener( "touchstart", (e) => e.preventDefault() );
	
	window.addEventListener( "resize", Game.resize );
	window.addEventListener( "orientationchange", Game.resize );
	
	window.addEventListener( "mousedown", (e) => {
		
		if( Game.did() === "begin" ) {
			
			const x = e.clientX / window.innerWidth * 2 - 1;
			
			if( x>-0.25 && x<0.25 ) player.walk();
			else if( x < -0.25 ) player.turn("left");
			else player.turn("right");
		} else if( Game.did() === "not begin" ) begin();
		else Game.reset();
	});
	window.addEventListener( "keydown", (e) => {
		
		if( Game.did() === "begin" ) {
			
			switch( e.code ) {
				
				case "ArrowUp":
				case "KeyW":
					player.walk();
					break;
				case "ArrowLeft":
				case "KeyA":
					player.turn("left");
					break;
				case "ArrowRight":
				case "KeyD":
					player.turn("right");
					break;
			}
		} else if( Game.did() === "not begin" ) begin();
		else Game.reset();
	});
	
	(() => {
		
		let start = 0,
			end = 0;
		
		window.addEventListener( "touchstart", (e) => start = e.changedTouches[0].clientX / window.innerWidth * 2 - 1 );
		
		window.addEventListener( "touchend", (e) => ( Game.did() === "begin" )
			? (
				
				end = e.changedTouches[0].clientX / window.innerWidth * 2 - 1,
				
				( Math.abs(start-end) < 0.1 )
					? player.walk()
					: ( start-end > 0 ) 
						? player.turn("left") 
						: player.turn("right")
			)
			: ( Game.did() === "not begin" )
				? begin()
				: Game.reset()
		);
	})();
	
	Score.initialize( VT323_Regular, player );
	player.initialize(enemies);
	enemies.initialize( video.enemies, hit, player );
	letters.initialize(VT323_Regular);
	buildings.initialize([ video.building_0, video.building_1, video.building_2, video.building_3, video.building_4 ]);
	room.initialize({ floorCeiling: video.walls, windows: video.windows });
	
	Game.scene.add( Light.ambient );
	Game.scene.add(player);
	Game.scene.add(buildings);
	Game.scene.add(room);
	Game.scene.add(letters);
	enemies.map( (e) => Game.scene.add(e) );
	
	player.add( Game.camera );
	player.add( Light.point );
	
	Game.render([
		Shader.update,
		
		enemies.rotate,
		buildings.rotate
	]);
})));
