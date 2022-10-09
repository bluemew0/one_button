title = "";

description = `
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
	HEIGHT: 150
}

options = {
	viewSize: vec(G.WIDTH, G.HEIGHT),
	theme: "shapeDark",
	seed: 78,
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
 * state: boolean
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
	}

	// Player Movement
	player.pos.y += sin(2*PI);

	nextSpawnTicks--;

	// Item Spawn Timing and Position
	if (nextSpawnTicks < 0) {
		if (rndi(0, 2)) itemState = true;
		else itemState = false;
		times(rndi(2, 15), (f) => {
			rndAngle = (rnd(0, 2*PI));
			itemPos = vec(player.pos.x + radius * cos(rndAngle), player.pos.y + radius * sin(rndAngle));
			items.push({
				pos: itemPos,
				state: itemState,
			});
		})
		nextSpawnTicks = rndi(40, 120) / difficulty
	}

	color("light_yellow");
	arc(player.pos, 13, 1);
	// text("O", center.x, center.y);
	color("black");

	// Item Logic and Spawning
	if (input.isJustPressed) {
		playState = !playState;
	}
	const c = addWithCharCode("a", floor(ticks/10) % 4);
	char(c, center);

	remove(items, (i) => {
		xIncrement = (player.pos.x-i.pos.x)/speed; // for consistent speed rate towards center
 		yIncrement = (player.pos.x-i.pos.y)/speed;
		let x;
		if (playState) {
			if (i.state) {
				x = char(addWithCharCode("i", floor(ticks/10) % 4), i.pos).isColliding.rect.light_yellow;
				if (x) {
					score++;
					play("coin");
				}
			}
			else if (!i.state) {
				x = char(addWithCharCode("e", floor(ticks/10) % 4), i.pos).isColliding.rect.light_yellow;
				if (x) {
					play("hit");
					end();
				}
			}
		} else {
			if (i.state) {
				x = char(addWithCharCode("e", floor(ticks/10) % 4), i.pos).isColliding.rect.light_yellow;
				if (x) {
					play("hit");
					end();
				}
			} else if (!i.state) {
				x = char(addWithCharCode("i", floor(ticks/10) % 4), i.pos).isColliding.rect.light_yellow;
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
