var context;
var queue;
var WIDTH = 1300;
var HEIGHT = 640;
var stage;
var points = 0;
var animation;
var fishAnimation;
var fishList = [];
var spriteSheet;
var scoreText;
var score = 0;
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
        {id: 'song', src: 'snd/Long_Time_-TheStrafeBeat._Non-Copyrighted_8-bit_Music.mp3'},
        {id: 'water', src: 'snd/underwater.wav'},
        {id: 'seaCreature', src: 'img/Player.png'},
        {id: 'fish', src: 'img/FishLeft.png'},
        ]);
    queue.load();
    
    
}

function queueLoaded(event)
{
    // Add background image
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"))
    stage.addChild(backgroundImage);
    
    createjs.Sound.play("song", {loop: -1});
    
    spriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('seaCreature')],
        "frames": {"width": 32, "height": 24},
        "animations": { "Move": [0,2],}
        
        
    });
    
    fishSpriteSheet = new createjs.SpriteSheet({
        "images": [queue.getResult('fish')],
        "frames": {"width": 32, "height": 25},
        "animations": { "Swim": [0,2],
                       }
        
    });
    
    createCreature();
    
    for (var i=0, l=40; i<l; i++) {
    var sprite = createFish();
    sprite.x = WIDTH + Math.random()*475;
    }
    // Add ticker
    createjs.Ticker.setFPS(8);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);
    
}



function createCreature ()
{
	animation = new createjs.Sprite(spriteSheet, "Move");
    animation.regX = 32;
    animation.regY = 8;
    animation.x = 100;
    animation.y = 100;
    animation.gotoAndPlay("Move");
    stage.addChild(animation);	
    document.onkeydown = keyPressed;
}

function createFish ()
{
	fishAnimation = new createjs.Sprite(fishSpriteSheet, "Swim");
   // fishAnimation.name = "fish"+i;
    fishAnimation.hSpeed = Math.random() * 5 + 5;
    fishAnimation.y = Math.random()*HEIGHT;
    fishAnimation.regX = 16;
    fishAnimation.regY = 15;
    fishAnimation.gotoAndPlay("Swim");
    stage.addChild(fishAnimation);
    fishList.push(fishAnimation);
    return fishAnimation;
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
function pointCnt(){
    points += 1;
}

function tickEvent(event)
{
    var collision;
    for(i=0;i<fishList.length; i++){
        var fish = fishList[i];
        fish.x -= fish.hSpeed;
        collision = ndgmr.checkRectCollision(animation,fish);
        if(collision){
        stage.removeChild(animation);
        createjs.Sound.removeSound("song");
        createjs.Sound.play("water");
        window.alert("You died but scored: " + points);
        }
        
        if (fish.x < 0) { // If we pass the edge, reset.
            fish.x = WIDTH + Math.random()*325;
    		fish.hSpeed = Math.random() * 8 + 7;
            pointCnt();
        }
      //  fish.x - 10;
    }
    
	if(animation.y > HEIGHT)
	{
        animation.y = HEIGHT;

	}
    if(animation.y < 0){
        animation.y = 0;
    }
    

    stage.update(event);
}