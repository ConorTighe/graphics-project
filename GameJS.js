var context;
var queue;
var WIDTH = 1300;
var HEIGHT = 640;
var stage;
var animation;
var spriteSheet;
var scoreText;
var score = 0;

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
        ]);
    queue.load();
    
   // gameTimer = setInterval(updateTime, 1000);
    
}

function queueLoaded(event)
{
    // Add background image
    var backgroundImage = new createjs.Bitmap(queue.getResult("backgroundImage"))
    stage.addChild(backgroundImage);
    
    // Keep track of score
    scoreText = new createjs.Text("Fish: " + score.toString(), "36px Arial", "#FDD");
    scoreText.x = 10;
    scoreText.y = 10;
    stage.addChild(scoreText);
    
    createjs.Sound.play("water", {loop: -1});
    
    // Add ticker
    createjs.Ticker.setFPS(15);
    createjs.Ticker.addEventListener('tick', stage);
    createjs.Ticker.addEventListener('tick', tickEvent);
    
}

