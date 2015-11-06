// Game variables for sprites, gameplay and input.
var context;
var queue;
var WIDTH = 1300;
var HEIGHT = 640;
var stage;
var points = 1;
var l = 30;
var animation;
var fishAnimation;
var fishList = [];
var spriteSheet;
var scoreText;
var score = 0;
var KEYCODE_UP = 38, KEYCODE_DOWN = 40, KEYCODE_LEFT = 37, KEYCODE_RIGHT = 39;


// Function that is loaded straight away
window.onload = function ()
{
    var canvas = document.getElementById('theCanvas'); // initilizing canvas
    context = canvas.getContext('2d'); // get a 2d context for the canvas
    context.canvas.width = WIDTH; // set the canvas width
    context.canvas.height = HEIGHT; // set the canvas height
    stage = new createjs.Stage("theCanvas"); // setup the canvas as the stage
    
    
    
    queue = new createjs.LoadQueue(false); // create a queue to store game elements
    queue.installPlugin(createjs.Sound); // install soundjs from queue
    queue.on("complete", queueLoaded, this); // call queueLoaded when told

    // fill the queue with elements and there ids
    queue.loadManifest([
        {id: 'backgroundImage', src: 'img/UnderwaterBG.png'}, // the background
        {id: 'song', src: 'snd/Long_Time_-TheStrafeBeat._Non-Copyrighted_8-bit_Music.mp3'}, // non copyright music
        {id: 'water', src: 'snd/underwater.wav'}, // water sound
        {id: 'seaCreature', src: 'img/Player.png'}, // player sprite
        {id: 'fish', src: 'img/FishLeft.png'}, // enemy sprite
        ]);
    queue.load(); // load queue
    
    
}

// function that sets up everything once loaded
function queueLoaded(event)
{
    // Add background image
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"))
    stage.addChild(backgroundImage);
    
    createjs.Sound.play("song", {loop: -1}); // play bg music
    
    // create the players sprite
    spriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('seaCreature')],
        "frames": {"width": 32, "height": 24},
        "animations": { "Move": [0,2],}
        
        
    });
    
    // create the enemy sprite
    fishSpriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('fish')],
        "frames": {"width": 32, "height": 25},
        "animations": { "Swim": [0,2],
                       }
        
    });
    
    // create player
    createCreature();
    
    // create starter enemys
    for (var i=0; i<l; i++) {
    createFish();
    }
    
    // Add ticker which will update the canvas at 8 frames per second
    createjs.Ticker.setFPS(8);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);
    
}


// create player
function createCreature ()
{
	animation = new createjs.Sprite(spriteSheet, "Move"); // assign sprite to player object
    animation.regX = 32; // set x on sprite image
    animation.regY = 8; // set y on sprite image
    animation.x = 100; // player starter position
    animation.y = 100; // player starter position
    animation.gotoAndPlay("Move"); // play sprite animation
    stage.addChild(animation);	 // add to stage
    
}
// create enemy
function createFish ()
{
	fishAnimation = new createjs.Sprite(fishSpriteSheet, "Swim"); // assign enemy sprite to enemy object
   // fishAnimation.name = "fish"+i;
    fishAnimation.hSpeed = Math.random() * 5 + 5; // enemy random speed
    fishAnimation.y = Math.random()*HEIGHT; // spawn randomly on y
    fishAnimation.x = WIDTH + Math.random()*475; // spawn randomly off screen on x
    fishAnimation.regX = 16; // set position on sprite x
    fishAnimation.regY = 15; // set position on sprite y
    fishAnimation.gotoAndPlay("Swim"); // play animation 
    stage.addChild(fishAnimation); // add to stage
    fishList.push(fishAnimation); // add to array
    return fishAnimation;
}

// give movement and input to player
function keyPressed(event) {
		switch(event.keyCode) {
			case KEYCODE_UP: // up arrow move you 5 pixels up
				animation.y -= 5;
				break;
			case KEYCODE_DOWN: // down arrow moves you 5 pixels down
				animation.y += 5;
				break;
            case KEYCODE_LEFT: // left arrow moves you 5 pixels left
				animation.x -= 5;
				break;
            case KEYCODE_RIGHT: // right arrow moves you 5 pixels right
				animation.x += 5;
				break;
		}
}
// points increase function as more efficent and reliable then adding in ticker
function pointCnt(){
    points += 1;
}
// add 3 enemys to the game
function fishCnt(){
    
    var extraEnemys = 3;
    
    for (var i=0; i<extraEnemys; i++) {
    createFish();
    }
}
// tick event which updates every frame
function tickEvent(event)
{
    var collision; // variable for sprites hitting each other
    for(i=0;i<fishList.length; i++){ // loop through array
        var fish = fishList[i]; // set fish to index in array
        fish.x -= fish.hSpeed; // move fish by his unique speed
        collision = ndgmr.checkRectCollision(animation,fish); // detect if any collision has happend
        if(collision){ // if collision happend execute
        stage.removeChild(animation); // remove player
        createjs.Sound.removeSound("song"); // remove song
        createjs.Sound.play("water"); // add sound of water
        window.alert("You died but scored: " + points); // show song
        }
        
        if (fish.x < 0) { // If we pass the edge, reset.
            fish.x = WIDTH + Math.random()*325; // respawn enemy
    		fish.hSpeed = Math.random() * 8 + 7; // new harder speed
            pointCnt(); // add point
        }
      //  fish.x - 10;
    }
    
    document.onkeydown = keyPressed; // check if any input
    
    if(points % 10 == 0 ){ // everytime you score 10 points add enemys
       fishCnt();
    }
    
    // if statements below keep player in bounds
	if(animation.y > HEIGHT)
	{
        animation.y = HEIGHT;

	}
    if(animation.y < 0){
        animation.y = 0;
    }
    if(animation.x < 0){
        animation.x = 0;
    }
    if(animation.x > WIDTH){
        animation.x = WIDTH;
    }
    
    // update stage at end of frame tick
    stage.update(event);
}