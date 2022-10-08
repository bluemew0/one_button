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
 * speed: number,
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
let rndPos;
let itemPos;
const center = vec(G.WIDTH/2, G.HEIGHT/2); // keeps track of the center?

function update() {
	if (!ticks) { // Init
		player = {
			pos: vec(G.WIDTH/2, G.HEIGHT/2),
		};
		nextSpawnTicks = 0;
		items = [];
		playState = true;
		speed = 1;
	}

	color("black");
	char(addWithCharCode("a", floor(ticks/10) % 4), player.pos);
	// char(addWithCharCode("e", floor(ticks/10) % 4), player.pos);
	// char(addWithCharCode("i", floor(ticks/10) % 4), player.pos);

	nextSpawnTicks--;
	// Item Spawning
	if (nextSpawnTicks < 0) {
		itemPos = [vec(0, 0), vec(0, G.HEIGHT), vec(G.WIDTH, 0), vec(G.WIDTH, G.HEIGHT)];
		rndPos = itemPos[rndi(0, 4)];

		if (rndi(0, 2)) itemState = true;
		else itemState = false;
		items.push({
			pos: rndPos,
			state: itemState,
			speed: speed
		});
		nextSpawnTicks = rndi(120, 240) 
	}
	// use push to add items to spawn array
	// ex. items.push({typedef for object})
	// can use nextSpawnTicks to help control how much is spawned at once
	// needs to have a pos, state, 

	remove(items, (i) => {
		if (i.state) {
			char(addWithCharCode("e", floor(ticks/10) % 4), i.pos);
		} else {
			char(addWithCharCode("i", floor(ticks/10) % 4), i.pos);
		}
	})
	// remove(items, (i) => {}) will actually spawn the items and the function will do stuff like changing pos/moving items
	// probably need to check item state to determine what to spawn

	// Item Logic
	if (input.isJustPressed) playState = !playState;
	if (playState == true) {
		// switch states of items to the opposite, use !
		// need a way to access all item states at once
	} else {

	};

}
