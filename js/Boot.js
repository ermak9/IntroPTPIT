var Game = {};

var game;

Game.Boot = function(game){
  game = this;
};


Game.Boot.prototype = {
  init:function(){
    this.input.maxPointers = 1;
    this.stage.disableVisibilityChange = true;
    game = this;
  },

  prelaod:function(){
    this.load.image("status1223", "assets/sprites/status_load.png");
  },

  create:function(){
    this.state.start("Preloader");
  }
}

function setLoader(){
  game.load.image("background", "assets/sprites/background.jpg");
  background = game.add.sprite(0, 0, "background")
  background.width = game.world.width;
  background.height = game.world.height;
}
