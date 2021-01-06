import {
	IcosahedronGeometry,
	Mesh,
	MeshPhongMaterial,
	VideoTexture
} from "three";
import { Utility } from "utility";
import { Shader } from "shader";
import { Game } from "game";
import { Sound } from "sound";
import { Score } from "score";


const enemies = [];

const geometry = new IcosahedronGeometry( 1, 1 );


enemies.initialize = ( video, sound, player ) => (
	
	Utility.times( 16, (_, i) => enemies.push(new Mesh(
		geometry,
		Shader.set(
			new MeshPhongMaterial({
				depthTest: false,
				transparent: true,
				opacity: 0,
				map: new VideoTexture(video)
			}),
			{
				uTime: 0,
				uSpeed: 1,
				uMorph: 0,
				uDistort: 1
			},
			`enemy_${i}`
		)
	))),
	
	enemies.spawn = () => enemies.map( (e, i) => (
		
		Utility.animate(
			0,
			0.6,
			1000,
			(v) => e.material.opacity = v
		),
		
		e.isAvailable = true,
		( i < 4 )
			? (
				
				e.position.set( player.position.x-100, 6, player.position.z ),
				e.isMoving = "east",
				e.attack = () => Utility.animate(
					e.position.x,
					player.position.x,
					Utility.random( 2, 4 ) * 1000,
					(v) => e.position.x = v,
					() => (
						
						e.material.opacity = 0,
						e.isAvailable = false,
						
						Sound.play(sound),
						
						( player.isFacing() === "west" )
							? player.score.increment()
							: (
								
								player.score.decrement(),
								( player.lives.decrement() < 0 ) && (
									
									player.add( Score.get() ),
									Game.end()
								)
							),
						
						enemies.attack()
					),
					""
				)
			)
			: ( i>3 && i<8 )
				? (
					
					e.position.set( player.position.x+100, 6, player.position.z ),
					e.isMoving = "west",
					e.attack = () => Utility.animate(
						e.position.x,
						player.position.x,
						Utility.random( 2, 4 ) * 1000,
						(v) => e.position.x = v,
						() => (
							
							e.material.opacity = 0,
							e.isAvailable = false,
							
							Sound.play(sound),
							
							( player.isFacing() === "east" )
								? player.score.increment()
								: (
									
									player.score.decrement(),
									( player.lives.decrement() < 0 ) && (
										
										player.add( Score.get() ),
										Game.end()
									)
								),
							
							enemies.attack()
						),
						""
					)
				)
				: ( i>7 && i<12 )
					? (
						
						e.position.set( player.position.x, 6, player.position.z-100 ),
						e.isMoving = "south",
						e.attack = () => Utility.animate(
							e.position.z,
							player.position.z,
							Utility.random( 2, 4 ) * 1000,
							(v) => e.position.z = v,
							() => (
								
								e.material.opacity = 0,
								e.isAvailable = false,
								
								Sound.play(sound),
								
								( player.isFacing() === "north" )
									? player.score.increment()
									: (
										
										player.score.decrement(),
										( player.lives.decrement() < 0 ) && (
											
											player.add( Score.get() ),
											Game.end()
										)
									),
								
								enemies.attack()
							),
							""
						)
					)
					: (
						e.position.set( player.position.x, 6, player.position.z+100 ),
						e.isMoving = "north",
						e.attack = () => Utility.animate(
							e.position.z,
							player.position.z,
							Utility.random( 2, 4 ) * 1000,
							(v) => e.position.z = v,
							() => (
								
								e.material.opacity = 0,
								e.isAvailable = false,
								
								Sound.play(sound),
								
								( player.isFacing() === "south" )
									? player.score.increment()
									: (
										
										player.score.decrement(),
										( player.lives.decrement() < 0 ) && (
											
											player.add( Score.get() ),
											Game.end()
										)
									),
								
								enemies.attack()
							),
							""
						)
					)
	)),
	
	enemies.attack = () => {
		
		if( Game.did() === "begin" ) {
			
			const available = enemies.filter( (e) => e.isAvailable );
			
			( available.length )
				? available[ Utility.random(available.length) ].attack()
				: player.toggleBattling();
		}
	}
);

enemies.rotate = (time) => enemies.map( (e) => e.rotation.y = time );


export { enemies };
