var statusLoad, game;

Game.Preloader = function(game){
  game = this.game;
};

var bmd;
var circle;

var colors;
var i = 0;
var p = null;

Game.Preloader.prototype = {init: init, preload: preload, create: create, loadUpadate: loadUpdate};

function loadUpdate(){
  console.log("loadUpdate")
}

function init(){
  colors = Phaser.Color.HSVColorWheel();

    //  Create a Circle
    circle = new Phaser.Circle(game.world.centerX, game.world.centerY, 500);

    //  Create a BitmapData just to plot Circle points to
    bmd = game.add.bitmapData(game.width, game.height);
    bmd.addToWorld();

    //  And display our circle on the top
    var graphics = game.add.graphics(0, 0);
    graphics.lineStyle(1, 0x00ff00, 1);
    graphics.drawCircle(circle.x, circle.y, circle.diameter);

    p = new Phaser.Point();
}

function preload(){
  this.load.image("statusLoader", "assets/sprites/status_load.png");
  this.load.image("background", "assets/sprites/background.jpg");
  this.load.image("spinObj1", "assets/sprites/spinObj_01.png");
  this.load.image("spinObj2", "assets/sprites/spinObj_02.png");
  this.load.image("spinObj3", "assets/sprites/spinObj_03.png");
  this.load.image("spinObj4", "assets/sprites/spinObj_04.png");
  this.load.image("spinObj5", "assets/sprites/spinObj_05.png");
  this.load.image("spinObj6", "assets/sprites/spinObj_06.png");
  this.load.image("spinObj7", "assets/sprites/spinObj_07.png");
  this.load.image("spinObj8", "assets/sprites/spinObj_08.png");
  this.load.image("wizball", "assets/sprites/wizball.png");
  this.load.image("gem", "assets/sprites/gem.png");
  this.load.image("mushroom", "assets/sprites/mushroom.png");
  this.load.image("firstaid", "assets/sprites/firstaid.png");
  this.load.image("diamond", "assets/sprites/diamond.png");
  this.load.image("swing", "assets/sprites/swing.png");
  this.load.image("marks", "assets/sprites/marks.png");
  this.load.image("brick", "assets/sprites/brick.png");
  this.load.image("background", "assets/sprites/background.jpg");
  this.load.image("ball", "assets/sprites/aqua_ball.png");
  this.load.image("placeObjects", "assets/sprites/form_object.png");
  this.load.image("grass", "assets/sprites/grass.png");
  this.load.spritesheet("texture", "assets/sprites/check.png", 36, 34);

  this.load.spritesheet("buttonNext", "assets/sprites/button_next.png", 200, 50);
  this.load.spritesheet("buttonTryAgain", "assets/sprites/button_try_again.png", 200, 50);
  this.load.spritesheet('button', 'assets/sprites/button_texture_atlas.png', 193, 71);
  this.load.spritesheet("buttonCheck", "assets/sprites/button_check.png", 200, 50);
  this.load.spritesheet('button', 'assets/sprites/button_texture_atlas.png', 193, 71);
  this.load.spritesheet("arrowRight", "assets/sprites/arrow_right.png", 40, 40);
  this.load.spritesheet("arrowLeft", "assets/sprites/arrow_left.png", 40, 40);
  this.load.spritesheet("check_box", "assets/sprites/check_box.png", 50, 50);
  this.load.spritesheet("buttonGameOnOff", "assets/sprites/button_on_off_game.png", 67, 16.5);
  this.load.spritesheet("buttonArrow", "assets/sprites/arrow-button.png", 112, 95);

  this.load.spritesheet("rotation1", "assets/sprites/rotation1.png", 216, 85);
  this.load.spritesheet("rotation2", "assets/sprites/rotation2.png", 216, 85);
  this.load.spritesheet("rotation3", "assets/sprites/rotation3.png", 215, 84);

  this.load.audio("winner", "assets/audio/sound_win.mp3");
  this.load.audio("loser", "assets/audio/sound_lose.mp3");
};

function createStatusLoad(){
  statusLoad = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "statusLoader")
}

function create(){
  this.state.start("MainMenu")
};

function update () {

    for (var c = 0; c < 10; c++)
    {
        circle.random(p);

        //  We'll floor it as setPixel needs integer values and random returns floats
        p.floor();

        bmd.setPixel(p.x, p.y, colors[i].r, colors[i].g, colors[i].b);
    }

    i = game.math.wrapValue(i, 1, 359);

}
