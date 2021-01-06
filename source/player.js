import { Object3D } from "three";
import { Utility } from "utility";

let acting = false,
	toggling = false,
	battling = false;


const player = new Object3D();
player.rotation.set( 270*Math.PI/180, 0, 0 );
player.position.set( 0, 20, 0 );

player.isFacing = (() => {
	
	let facing = "north";
	
	return ( direction="" ) => facing = direction || facing;
})();

player.lives = (() => {
	
	let value = 3;
	
	const callback = () => value;
	callback.decrement = () => value-=1;
	
	return callback;
})();

player.score = (() => {
	
	let value = 0;
	
	const callback = () => value;
	callback.increment = () => value+=1;
	callback.decrement = () => value-=1;
	
	return callback;
})();


player.spawn = () => (
	
	Utility.animate(
		270*Math.PI/180,
		360*Math.PI/180,
		1250,
		(v) => player.rotation.x = v
	),
	Utility.animate(
		20,
		0,
		1000,
		(v) => player.position.y = v
	)
);

player.turn = (() => {
	
	const directions = [ "north", "east", "south", "west" ];
	let i = 0;
	
	return (direction) => !acting && !toggling && (
		
		acting = true,
		( direction === "left" )
			? (
				
				Utility.animate(
					player.rotation.y,
					player.rotation.y+90*Math.PI/180,
					375,
					(v) => player.rotation.y = v,
					() => acting = false
				),
				player.isFacing( directions[
					( i === 0 )
						? i = 3
						: i -= 1
				])
			)
			: (
				
				Utility.animate(
					player.rotation.y,
					player.rotation.y-90*Math.PI/180,
					375,
					(v) => player.rotation.y = v,
					() => acting = false
				),
				player.isFacing( directions[
					( i === 3 )
						? i = 0
						: i += 1
				])
			)
	);
})();

player.initialize = (enemies) => (
	
	player.walk = () => !acting && !toggling && !battling && (
		
		( player.isFacing()==="north" || player.isFacing()==="south" )
			? !(player.position.x%6) && (
				
				acting = true,
				Utility.animate(
					player.position.z,
					( player.isFacing() === "north" )
						? player.position.z>-43.25 && player.position.z-3
						: player.position.z<43.25 && player.position.z+3,
					375,
					(v) => player.position.z = v,
					() => (
						
						acting = false,
						!Utility.random(20) && player.toggleBattling()
					)
				)
			)
			: !(player.position.z%9) && (
				
				acting = true,
				Utility.animate(
					player.position.x,
					( player.isFacing() === "east" )
						? player.position.x<13.25 && player.position.x+3
						: player.position.x>-13.25 && player.position.x-3,
					375,
					(v) => player.position.x = v,
					() => (
						
						acting = false,
						!Utility.random(20) && player.toggleBattling()
					)
				)
			)
	),
	
	player.toggleBattling = (() => {
		
		let c = 0;
		
		return () => (
			
			toggling = true,
			Utility.animate(
				player.position.y,
				( (c+=1) % 2 )
					? (
						
						battling = true,
						player.position.y+6
					)
					: (
						
						battling = false,
						player.position.y-6
					),
				500,
				(v) => player.position.y = v,
				() => (
					
					toggling = false,
					battling && (
						
						enemies.spawn(),
						enemies.attack()
					)
				)
			)
		);
	})()
);


export { player };
