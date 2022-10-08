title = "";

description = `
`;

characters = [
// character frames (a, b, c, d)
`
 llll 
llllll
lcllcl
llllll
llllll
llll
`,
`
 llll 
llllll
lcllcl
llllll
llllll
  llll
`,
`
 llll 
llllll
lcllcl
llllll
llllll
l  lll
`,
`
 llll 
llllll
lcllcl
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
const center = vec(G.WIDTH/2, G.HEIGHT/2); // keeps track of the center?

function update() {
	if (!ticks) { // Init
		player = {
			pos: vec(G.WIDTH/2, G.HEIGHT/2),
		};
		nextSpawnTicks = 0;
		items = [];
		playState = true;
		speed = 50; // lower is faster
	}

	nextSpawnTicks--;

	// Item Spawning
	if (nextSpawnTicks < 0) {
		if (rndi(0, 2)) itemState = true;
		else itemState = false;
		times(rndi(2, 15), (f) => {
			rndAngle = (rnd(0, 2*PI));
			itemPos = vec(75 + 75 * cos(rndAngle), 75 + 75 * sin(rndAngle));
			items.push({
				pos: itemPos,
				state: itemState,
			});
		})
		nextSpawnTicks = rndi(120, 180) / difficulty
	}

	// remove(items, (i) => {}) will actually spawn the items and the function will do stuff like changing pos/moving items
	// probably need to check item state to determine what to spawn

	// Item Logic
	if (input.isJustReleased) playState = !playState;

	if (playState) {
		console.log(true)
		remove(items, (i) => {
			// need to figure out how to have a consistent rate
			xIncrement = (75-i.pos.x)/speed;
			yIncrement = (75-i.pos.y)/speed;
			if (i.state) { // if true, spawns good item, if false, spawns bad item
				char(addWithCharCode("i", floor(ticks/10) % 4), i.pos);
			} else if (!i.state){
				char(addWithCharCode("e", floor(ticks/10) % 4), i.pos);
			}
			if (i.pos.x != 75 && i.pos.y != 75) {
				i.pos.x += xIncrement;
				i.pos.y += yIncrement;
			}
		})
	} else {
		console.log(false)
		remove(items, (i) => {
			i.state = !i.state;
			xIncrement = (75-i.pos.x)/speed; // for consistent speed rate
			yIncrement = (75-i.pos.y)/speed;
			if (i.state) { // if true, spawns good item, if false, spawns bad item
				char(addWithCharCode("i", floor(ticks/10) % 4), i.pos);
			} else {
				char(addWithCharCode("e", floor(ticks/10) % 4), i.pos);
			}
			if (i.pos.x != 75 && i.pos.y != 75) {
				i.pos.x += xIncrement;
				i.pos.y += yIncrement;
			}
		})
	};

	color("black");
	const c = addWithCharCode("a", floor(ticks/10) % 4);
	if (char(c, center).isColliding.char.e || char(c, center).isColliding.char.f || char(c, center).isColliding.char.j || char(c, center).isColliding.char.h) {
		console.log("");
	}

}
