title = "Playing with Fire";

description = `
Collect blue souls,

avoid red fire!


[TAP] Switch states

`;

characters = [
// character frames (a, b, c, d)
`
 llll 
llllll
lbllbl
llllll
llllll
llll
`,
`
 llll 
llllll
lbllbl
llllll
llllll
  llll
`,
`
 llll 
llllll
lbllbl
llllll
llllll
l  lll
`,
`
 llll 
llllll
lbllbl
llllll
llllll
lll  l
`,
// fire frames(e, f, g, h)
`

  r    
  rr   
 ryrr
 ryyr
  rr 
`,
`
  r   
  rr   
  rr   
 ryyr
 ryrr
  rr 
`,
`

   r   
  rr   
 ryyr
 rryr
  rr 
`,
`
   r
  rr   
  rr   
 rryr
 ryyr
  rr 
`,
// coin frames (i, j, k, l)
`

 bbb 
bbbbb
bbcbb
bbbbb
 bbb
`,
`

 bbb 
bbcbb
bclcb
bbcbb
 bbb
`,
`

 bbb 
bcccb
bclcb
bcccb
 bbb
`,
`

 bbb 
bbcbb
bclcb
bbcbb
 bbb
`
];

const G = {
	WIDTH: 150,
	HEIGHT: 150,
	STAR_SPEED_MIN: 0.5,
	STAR_SPEED_MAX: 1.0
}

options = {
	viewSize: vec(G.WIDTH, G.HEIGHT),
	theme: "shapeDark",
	seed: 387,
	isPlayingBgm: true,
	isReplayEnabled: true
};

// GAME OBJECTS

/**
 * @typedef {{
 * pos: Vector
 * }} Player
 * 
 * @type { Player }
 */
let player

/**
 * @typedef {{
 * pos: Vector,
 * state: boolean,
 * angle: number
 * }} Item
 * 
 * @type { Item }
 */
let item;
let playState;

// /**
//  * @typedef {{
//  * pos: Vector,
//  * speed: number,
//  * state: boolean
//  * }} Coin
//  * 
//  * @type { Coin } 
//  */
// let coin

let nextSpawnTicks;
let items;
let itemState;
let speed;
let rndAngle;
let itemPos;
let xIncrement;
let yIncrement; 
let radius;
let stars;
const center = vec(G.WIDTH/2, G.HEIGHT/2); // keeps track of the center?

function update() {
	if (!ticks) { 
		// Initiate
		player = {
			pos: center,
		};
		nextSpawnTicks = 0;
		items = [];
		playState = true;
		speed = 60; // lower is faster
		radius = 80;

		// Star background init
		stars = times(20, () => {
			const posX = rnd(0, G.WIDTH);
			const posY = rnd(0, G.HEIGHT);
			return {
				pos: vec(posX, posY),
				speed: rnd(G.STAR_SPEED_MIN, G.STAR_SPEED_MAX)
			}
		})
	}

	// Star background
	stars.forEach((s) => {
		s.pos.y += s.speed;
		s.pos.wrap(0, G.WIDTH, 0, G.HEIGHT);
		color("light_yellow");
		box(s.pos, 1);
	});

	nextSpawnTicks--;

	// Item Spawn Timing and Position
	if (nextSpawnTicks < 0) {
		if (rndi(0, 2)) itemState = true;
		else itemState = false; 
		times(rndi(2, 12), (f) => {
			rndAngle = (rnd(0, 2*PI));
			itemPos = vec(player.pos.x + radius * cos(rndAngle), player.pos.y + radius * sin(rndAngle));
			items.push({
				pos: itemPos,
				state: itemState,
				angle: rndAngle
			});
		})
		nextSpawnTicks = rndi(40, 100) / difficulty
	}

	color("yellow");
	arc(player.pos, 13, 1);
	// text("O", center.x, center.y);
	color("black");

	// Item Logic and Spawning
	if (input.isJustPressed) {
		playState = !playState;
	}
	const c = addWithCharCode("a", floor(ticks/10) % 4);
	char(c, player.pos.x, player.pos.y);

	remove(items, (i) => {
		xIncrement = (player.pos.x-i.pos.x)/speed; // for consistent speed rate towards center
 		yIncrement = (player.pos.y-i.pos.y)/speed;
		let x;
		if (playState) {
			if (i.state) {
				color("black");
				x = char(addWithCharCode("i", floor(ticks/10) % 4), i.pos).isColliding.rect.yellow;
				color("light_blue");
				particle(i.pos, 1, 1, i.angle, 0.3);
				if (x) {
					score++;
					play("coin");
				}
			}
			else if (!i.state) {
				color("black");
				x = char(addWithCharCode("e", floor(ticks/10) % 4), i.pos).isColliding.rect.yellow;
				color("light_red");
				particle(i.pos, 1, 1, i.angle, 0.3);
				if (x) {
					play("hit");  
					end();
				}
			}
		} else {
			if (i.state) {
				color("black");
				x = char(addWithCharCode("e", floor(ticks/10) % 4), i.pos).isColliding.rect.yellow;
				color("light_red");
				particle(i.pos, 1, 1, i.angle, 0.3);
				if (x) {
					play("hit");
					end();
				}
			} else if (!i.state) {
				color("black");
				x = char(addWithCharCode("i", floor(ticks/10) % 4), i.pos).isColliding.rect.yellow;
				color("light_blue");
				particle(i.pos, 1, 1, i.angle, 0.3);
				if (x) {
					score++;
					play("coin");
				}
			}
		}
		// movement
		if (i.pos.x != 75 && i.pos.y != 75) { 
			i.pos.x += xIncrement;
			i.pos.y += yIncrement;
		}

		

		return (x);
	})

}
