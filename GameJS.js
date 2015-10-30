var context;
var queue;
var WIDTH = 1300;
var HEIGHT = 640;
var stage;
var animation;
var fishAnimation;
var spriteSheet;
var scoreText;
var score = 0;
var creatureXPos = 100;
var creatureYPos = 100;
var KEYCODE_UP = 38, KEYCODE_DOWN = 40;

window.onload = function ()
{
    var canvas = document.getElementById('theCanvas');
    context = canvas.getContext('2d');
    context.canvas.width = WIDTH;
    context.canvas.height = HEIGHT;
    stage = new createjs.Stage("theCanvas");
    
    
    
    queue = new createjs.LoadQueue(false);
    queue.installPlugin(createjs.Sound);
    queue.on("complete", queueLoaded, this);

    
    queue.loadManifest([
        {id: 'backgroundImage', src: 'img/UnderwaterBG.png'},
        {id: 'water', src: 'snd/underwater.wav'},
        {id: 'seaCreature', src: 'img/SeaCreature.png'},
        {id: 'fish', src: 'img/FishLeft.png'},
        ]);
    queue.load();
    
    
}

function queueLoaded(event)
{
    // Add background image
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"))
    stage.addChild(backgroundImage);
    
    // Keep track of Fish eaten
    scoreText = new createjs.Text("Fish: " + score.toString(), "36px Arial", "#FDD");
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);
    
    createjs.Sound.play("water", {loop: -1});
    
    spriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('seaCreature')],
        "frames": {"width": 148, "height": 102},
        "animations": { "Move": [0,4],
                      speed: 0.5}
        
    });
    
    fishSpriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('fish')],
        "frames": {"width": 31, "height": 30},
        "animations": { "Swim": [0,3],
                      speed: 1}
        
    });
    
    
    createCreature();
    createFish();
    // Add ticker
    createjs.Ticker.setFPS(15);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);
    
}

function createCreature ()
{
	animation = new createjs.Sprite(spriteSheet, "Move");
    animation.regX = 72;
    animation.regY = 51;
    animation.x = creatureXPos;
    animation.y = creatureYPos;
    animation.gotoAndPlay("Move");
    stage.addChildAt(animation,1);	
    document.onkeydown = keyPressed;
}

function createFish ()
{
	fishAnimation = new createjs.Sprite(fishSpriteSheet, "Swim");
    fishAnimation.regX = 16;
    fishAnimation.regY = 15;
    fishAnimation.x = 500;
    fishAnimation.y = 400;
    fishAnimation.gotoAndPlay("Swim");
    stage.addChildAt(fishAnimation, 1);	
}

function keyPressed(event) {
		switch(event.keyCode) {
			case KEYCODE_UP: 
				animation.y -= 5;
				break;
			case KEYCODE_DOWN: 
				animation.y += 5;
				break;
		}
		stage.update();
}

function tickEvent()
{
	
	if(animation.y > HEIGHT)
	{
        		animation.y = HEIGHT;

	}
    if(animation.y < 0){
        animation.y = 0;
    }

	fishAnimation.x -= 5;
    
}