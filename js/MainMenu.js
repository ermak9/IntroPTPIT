Game.MainMenu = function(game){

}

Game.MainMenu.prototype = {create: create}

var game, spinObj1, spinObj2, spinObj3;

function create(){
  game = this;

  game = this;
  background = game.add.sprite(0, 0, "background")
  background.width = game.world.width;
  background.height = game.world.height;

  spinObj1 = game.add.button(100, 100, "spinObj1", listenerSpinObj1, this, 0, 0, 0);
  spinObj2 = game.add.button(300, 100, "spinObj2", listenerSpinObj2, this, 0, 0, 0);
  spinObj3 = game.add.button(500, 100, "spinObj3", listenerSpinObj3, this, 0, 0, 0);
};


function listenerSpinObj1(){
  loadLevelCheck();
}

function listenerSpinObj2(){
  loadLevelFindRotation();
}

function listenerSpinObj3(){
  loadLevelFindWeight();
}

function loadLevelCheck(){
  $$i({
  create:'script',
  attribute: {'type':'text/javascript',
    'src':'js/LevelCheck.js'},

  insert:$$().body,

  onready:function() {
    game.state.add("LevelCheck", Game.LevelCheck);
    game.state.start("LevelCheck", true, false);
  }
});
}

function loadLevelFindRotation(){
  $$i({
  create:'script',
  attribute: {'type':'text/javascript',
    'src':'js/LevelFindRotation.js'},

  insert:$$().body,

  onready:function() {
    game.state.add("LevelFindRotation", Game.LevelFindRotation);
    game.state.start("LevelFindRotation", true, false);
  }
});
}

function loadLevelFindWeight(){
  $$i({
  create:'script',
  attribute: {'type':'text/javascript',
    'src':'js/LevelFindWeight.js'},

  insert:$$().body,

  onready:function() {
    game.state.add("LevelFindWeight", Game.LevelFindWeight);
    game.state.start("LevelFindWeight", true, false);
  }
});
}
