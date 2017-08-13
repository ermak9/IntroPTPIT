Game.LevelFindRotation = function(game){
};

Game.LevelFindRotation.prototype = {create: create, update: update, shutdown: shutdown}

var game, buttonGoBack, buttonCheck;
var doc = window;
var background, swing, formForObject, brick = null, placeObjects, numPlaces = 0, numPage = 1, maxPage = 2;
var object1, object2, object3, object4, object5, object6, object7, object8, bodies = [], objects = [];
var buttonMarkPosition, buttonGame, arrowButtonRight, arrowButtonLeft, buttonTryAgain, buttonNext, checkBox = [];
var speed = 2, arrowRight, arrowLeft, marks, isOverContact;
var mouseBody, isMouseMove = false, x = 135, y = 500, gameOn = false;
var mouseConstraint, spring = null, spring2;
var posStay = [];
var count = 0, bodyMove, movePointer, a, isCreateSpring = false, positionForObject = {x: null, y: null}, isCreateSpring2 = false, body1;
var movingObject = null, posStayObject = [], isNeedRotate = false, accuracyRotate = 0.005, textMass = [], scrollHeight, scrollWidth;
var isCreated = false, countStart = 0;
var primary = {};
var soundWin;
var text, textButtonMarkPosition, forceLeft = 0, forceRight = 0, isObjectDelivered = false;
var textSlider, arrowLeftSlider, arrowRightSlider, textKg;
var buttonRotation1, buttonRotation2, buttonRotation3, buttonRotation1Active = false, buttonRotation2Active = false, buttonRotation3Active = false;

var screenHeight = document.documentElement.clientHeight;
var screenWidth = document.documentElement.clientWidth;

function create(){
  game = this.game;
  background = game.add.image(0, 0, "background");
  background.height = game.world.height;
  background.width = game.world.width;

  grass = game.add.sprite(0, (10 / 14) * screenHeight, "grass")

  game.physics.startSystem(Phaser.Physics.P2JS);

  primaryPositionObjects();

  createButtons();

  createObjects();

  soundWin = game.add.audio("winner");
  soundLose = game.add.audio("loser")

  swing.body.collideWorldBounds = true;

  arrowRight = game.add.sprite((swing.position.x + swing.width / 2), swing.position.y, "arrowRight");
  arrowRight.anchor.x = 0;
  arrowRight.anchor.y = 0.5;

  arrowLeft = game.add.sprite((swing.position.x - swing.width / 2), swing.position.y, "arrowLeft");
  arrowLeft.anchor.x = 1;
  arrowLeft.anchor.y = 0.5;

  createTextMass();

  createRotationImages();
  createTextOnButtons();
}

function createRotationImages(){
  buttonRotation2 = game.add.button((game.world.centerX), 0, "rotation2", listenerButtonRotation2, this, 1, 0, 0);
  buttonRotation2.anchor.setTo(0.5, 0.5);
  buttonRotation2.y = buttonRotation2.height * 1.5;

  buttonRotation1 = game.add.button((buttonRotation2.x - buttonRotation2.width - 20), buttonRotation2.y, "rotation1", listenerButtonRotation1, this, 1, 0, 0);
  buttonRotation1.anchor.setTo(0.5, 0.5);

  buttonRotation3 = game.add.button((buttonRotation2.x + buttonRotation2.width + 20), buttonRotation2.y, "rotation3", listenerButtonRotation3, this, 1, 0, 0);
  buttonRotation3.anchor.setTo(0.5, 0.5);
}

function listenerButtonRotation1(){
  if (buttonRotation2Active){
    buttonRotation2Active = false;
    buttonRotation2.freezeFrames = false;
    buttonRotation2.frame = 0;
  }
  if (buttonRotation3Active){
    buttonRotation3Active = false;
    buttonRotation3.freezeFrames = false;
    buttonRotation3.frame = 0;
  }
  if (!buttonRotation1Active){
    buttonRotation1Active = true;
    buttonRotation1.freezeFrames = true;
    buttonRotation1.frame = 2;
  }
}

function listenerButtonRotation2(){
  if (buttonRotation1Active){
    buttonRotation1Active = false;
    buttonRotation1.freezeFrames = false;
    buttonRotation1.frame = 0;
  }
  if (buttonRotation3Active){
    buttonRotation3Active = false;
    buttonRotation3.freezeFrames = false;
    buttonRotation3.frame = 0;
  }
  if (!buttonRotation2Active){
    buttonRotation2Active = true;
    buttonRotation2.freezeFrames = true;
    buttonRotation2.frame = 2;
  }
}

function listenerButtonRotation3(){
  if (buttonRotation2Active){
    buttonRotation2Active = false;
    buttonRotation2.freezeFrames = false;
    buttonRotation2.frame = 0;
  }
  if (buttonRotation1Active){
    buttonRotation1Active = false;
    buttonRotation1.freezeFrames = false;
    buttonRotation1.frame = 0;
  }
  if (!buttonRotation3Active){
    buttonRotation3Active = true;
    buttonRotation3.freezeFrames = true;
    buttonRotation3.frame = 2;
  }
}

function test(){
  console.log("LevelFindRotation");
}

function createTextOnButtons(){
  var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
  textButtonMarkPositions = game.add.text((buttonMarkPosition.x + buttonMarkPosition.width * 1.2), (buttonMarkPosition.y + buttonMarkPosition.width / 2), "Marks", style);
  textButtonMarkPositions.anchor.y = 0.5;
}

function shutdown(){
  console.log("shutdown")
  isObjectDelivered = false;
  objects.splice(0, objects.length);
  objects = [];
  textMass = [];
  posStayObject = [];
  if (gameOn){
    gameOn = false;
  }
  soundWin.stop();
  soundLose.stop();
}

function createButtons(){
  buttonMarkPosition = game.add.button(100, 100, 'check_box', listenerButtonMarkPosition, this, 1, 1, 1);
  buttonMarkPosition.freezeFrames = true;
  buttonMarkPosition.check = true;

  buttonGoBack = game.add.button(0, 0, "button", listenerButtonGoBack, this, 0, 1, 2);

  var x, y;

  buttonCheck = game.add.button(0, 0, "buttonCheck", listenerButtonCheck, this, 0, 1, 2);
  buttonCheck.anchor.setTo(0.5, 0.5);
  x = game.world.centerX;
  y = game.world.height - (2 * buttonCheck.height);
  buttonCheck.position.x = x;
  buttonCheck.position.y = y;

  buttonNext = game.add.button(x, y, "buttonNext", listenerButtonNext, this, 0, 1, 2);
  buttonNext.visible = false;
  buttonNext.anchor.setTo(0.5, 0.5);

  buttonTryAgain = game.add.button(x, y, "buttonTryAgain", listenerButtonTryAgain, this, 0, 1, 2);
  buttonTryAgain.visible = false;
  buttonTryAgain.anchor.setTo(0.5, 0.5);
}

function listenerButtonNext(){
  console.log("listenerButtonNext")
}

function listenerButtonTryAgain(){
  game.state.restart(true, false)
}

function listenerButtonMarkPosition(button){
  if (buttonMarkPosition.check){
    buttonMarkPosition.check = false;
    buttonMarkPosition.frame = 0;
    marks.alpha = 0;
  } else {
    buttonMarkPosition.check = true;
    buttonMarkPosition.frame = 1;
    marks.alpha = 1;
  }
}

function primaryPositionObjects(){
  primary.position = {};
  primary.position.swing = {};
  primary.position.buttonCheck = {};
  primary.position.swing.x = (screenWidth / 12);
  primary.position.swing.y = (screenHeight / 2);
  console.log("Y = " + primary.position.swing.y);
  primary.position.buttonCheck.x = game.world.centerX;
  primary.position.buttonCheck.y = (3 / 14) * screenHeight;

  primary.size = {};
  primary.size.swing = {};
  primary.size.swing.x = (13 / 24) * screenWidth;
  primary.size.swing.y = (1 / 14) * screenHeight;
}

function update(){
  for (var i = 0; i < objects.length; i++){
    objects[i].body.setZeroVelocity();
    objects[i].body.rotateLeft(0);
    objects[i].body.rotateRight(0);
    objects[i].body.rotation = 0;
  }

  marks.rotation = swing.rotation

  swing.position.x = primary.position.swing.x;
  swing.position.y = primary.position.swing.y;
  swing.body.setZeroVelocity();

  for (var i = 0; i < objects.length; i++){
    if (objects[i].body.spring !== null){
      updatePosBrick(objects[i].body.posStay);
      objects[i].body.rotation = 0;
      objects[i].body.x = positionForObject.x;
      objects[i].body.y = positionForObject.y - objects[i].height / 2;
    }
  }
  updateBalanceArrow();
  updatePositionTextMass();

  if (gameOn){
    checkMass();
  }
}

//Функция для создания формы с объектами
function createPlaceObjects(){
  placeObjects = game.add.sprite(300, 100, "placeObjects");
  var x  = doc.innerWidth - placeObjects.width * 1.5;
  var y  = 200;
  placeObjects.x = x;
  placeObjects.y = y;
  arrowButtonLeft = game.add.button(67, 33, 'arrowRight', listenerButtonFormLeft, this, 0, 0, 0);
  arrowButtonLeft.anchor.x = 0;
  arrowButtonLeft.anchor.y = 0.5;
  x = placeObjects.x;
  y = placeObjects.y + placeObjects.height / 2;
  arrowButtonLeft.x = x;
  arrowButtonLeft.y = y;
  arrowButtonRight = game.add.button(67, 33, 'arrowLeft', listenerButtonFormRight, this, 0, 0, 0);
  arrowButtonRight.anchor.x = 1;
  arrowButtonRight.anchor.y = 0.5;
  x = placeObjects.x + placeObjects.width;
  y = placeObjects.y + placeObjects.height / 2;
  arrowButtonRight.x = x;
  arrowButtonRight.y = y;
}

//Функция для создания объектов
function createObjects(){

  object1 = game.add.sprite(500, 200, "ball");
  object1.selectSwing = null;
  object1.anchor.x = 0.5;
  object1.anchor.y = 1;
  object1.homePage = 1;
  objects.push(object1);

  object2 = game.add.sprite(600, 200, "ball");
  object2.selectSwing = null;
  object2.anchor.x = 0.5;
  object2.anchor.y = 1;
  object2.homePage = 1;
  objects.push(object2);

  swing = game.add.sprite(primary.position.swing.x, primary.position.swing.y, "swing");

  primary.size.swing.x = primary.size.swing.x / swing.width;
  primary.size.swing.y = primary.size.swing.y / swing.height;
  swing.scale.x = primary.size.swing.x;
  primary.position.swing.x = primary.position.swing.x + 0.5 * swing.width;
  swing.position.x = primary.position.swing.x;

  marks = game.add.sprite(primary.position.swing.x, primary.position.swing.y, "marks");
  marks.anchor.x = 0.5;
  marks.anchor.y = -0.2;
  marks.scale.x = primary.size.swing.x * 1.33;

  createPosStay();

  game.physics.p2.enable([swing, object1, object2]);//, object1, object2, object3, object4, object5, object6, object7, object8]);\

  objects.forEach(function (item, i, objects){
    console.log(i)
    item.i = i;
    item.body.collideWorldBounds = true;
    item.body.spring = null;
    item.body.posStay = 0;
    item.body.mass = game.rnd.between(1, 10);
    item.body.beginPosX = item.position.x;
    item.body.beginPosY = item.position.y;
  })

  var rnd1 = game.rnd.between(0, 7), rnd2 = game.rnd.between(8, 15);

  updatePosBrick(rnd1);
  objects[0].body.posStay = rnd1;
  objects[0].body.x = positionForObject.x;
  objects[0].body.y = positionForObject.y - objects[0].height / 2;

  posStayObject[rnd1].mass = objects[0].body.mass;
  objects[0].body.spring = game.physics.p2.createSpring(swing, objects[0], 0, 0, 100);

  updatePosBrick(rnd2);
  objects[1].body.posStay = rnd2;
  objects[1].body.x = positionForObject.x;
  objects[1].body.y = positionForObject.y - objects[1].height / 2;

  posStayObject[rnd2].mass = objects[1].body.mass;
  objects[1].body.spring = game.physics.p2.createSpring(swing, objects[1], 0, 0, 100);
}

//Слушатель кнопки вкл/выкл игру
function gameEnable(){
  gameOn = true;
  isNeedRotate = true;
}

//Функция для обновления позиции кирпичика
function updatePosBrick(number){
  var alfa, a, b, c;
  var brickTest = game.add.sprite(posStay[number] - 13, swing.body.y, "brick");
  brickTest.anchor.x = 1;
  brickTest.anchor.y = 1;
  brickTest.alpha = 0;
  brickTest.position.rotate(swing.body.x, swing.body.y, swing.body.angle, 1);
  brickTest.angle = swing.angle;
  alfa = brickTest.rotation;
  a = 0.5 * brickTest.width;
  b = Math.cos(alfa) * a;
  c = Math.sin(alfa) * a;
  positionForObject.x = brickTest.x + b;
  positionForObject.y = brickTest.y + c - 10;
}

//Функция для проверки качели на новые объекты, которые могли быть на нее положены
function checkMass(){
  var forceDiff = 0, alfa = 0;
  forceLeft = 0;
  forceRight = 0;
  for (var i = 0; i < posStayObject.length; i++){
    if ( i <= 7 && posStayObject[i].mass  > 0){
      forceLeft += posStayObject[i].mass * (8 - i);
    }
    if ( i >= 8 && posStayObject[i].mass  > 0){
      forceRight += posStayObject[i].mass * (i - 7);
    }
  }

  forceDiff = Math.abs(forceLeft - forceRight);

  alfa = 0.005 * forceDiff;
  if (alfa > 0.22){
    alfa = 0.21;
  }

  var speedRotate = forceDiff / 10000;
  if (gameOn){
    rotateSwing(alfa, speedRotate, forceLeft, forceRight);
  }
}

//Функция для поворота качели.
//Входные параметры alfa - угол на который нужно повернуть,
//speedRotate - скорось поворота,
//forceLeft - сила которую оказывают на качели объекты, которые лежат на левой стороне качели
//forceRigth - сила которую оказывают на качели объекты, которые лежат на правой стороне качели
function rotateSwing(alfa, speedRotate, forceLeft, forceRight){
  swing.body.rotateLeft(0);
  swing.body.rotateRight(0);
  var swingRotation = swing.body.rotation;

  if (isNeedRotate){
    if (forceLeft > forceRight){
      if (((-alfa + accuracyRotate) > swingRotation) && ((-alfa - accuracyRotate) < swingRotation)){
        swing.body.rotation = -alfa;
        isNeedRotate = false;
      } else if (-alfa > swingRotation){
        swing.body.rotation += speedRotate;
      } else {
        swing.body.rotation -= speedRotate;
      }
    } else if (forceRight > forceLeft){
      if (((alfa + accuracyRotate) > swingRotation) && ((alfa - accuracyRotate) < swingRotation)){
        swing.body.rotation = alfa;
        isNeedRotate = false;
      } else if (alfa < swingRotation){
        swing.body.rotation -= speedRotate;
      } else {
        swing.body.rotation += speedRotate;
      }
    } else if (swing.body.rotation > 0 && alfa === 0  && (forceLeft === forceRight)){
      if ((swingRotation < accuracyRotate) && (swingRotation > -accuracyRotate)){
        swing.body.rotation = 0;
        isNeedRotate = false;
      } else {
        swing.body.rotation -= 0.01;
      }
    } else if ( swing.body.rotation < 0  && alfa === 0 && (forceLeft === forceRight)){
      if ((swingRotation < accuracyRotate) && (swingRotation > -accuracyRotate)){
        swing.body.rotation = 0;
        isNeedRotate = false;
      } else {
        swing.body.rotation += 0.01;
      }
    }
  } else if (forceLeft > forceRight){
    swing.body.rotation = -alfa;
  } else if (forceLeft < forceRight){
    swing.body.rotation = alfa;
  } else {
    swing.body.rotation = alfa;
  }
}

//Функция для создания текста с массой объекта
function createTextMass(){
  for (var i = 0; i < objects.length; i++){
    var text = game.add.text(objects[i].position.x, (objects[i].position.y - objects[i].height / 4), objects[i].body.mass + " кг",
      { font: "20px Arial", fill: "#ff0044", align: "center" });
    text.anchor.setTo(0.5, 0.5);
    textMass.push(text);
  }
}

//Функция для обновления позиции текста с массой объекта
function updatePositionTextMass(){
  for (var i = 0; i < objects.length; i++){
    textMass[i].position.x = objects[i].position.x;
    textMass[i].position.y = objects[i].position.y - objects[i].height / 1.2;
  }
}

//Обновление стрелок с обозначением баланса качели
function updateBalanceArrow(){
  if (swing.rotation < 0.0005 && swing.rotation > -0.0005){
    arrowLeft.frame = 1;
    arrowRight.frame = 1;
  } else {
    arrowLeft.frame = 0;
    arrowRight.frame = 0;
  }
}

function createPosStay(){
  var x;
  for (var i = 1; i <= 8; i++ ){
    x = (swing.position.x - swing.width / 2) + 44 * swing.scale.x * i;
    posStay.push(x);
  }
  for (var i = 8; i >= 1; i-- ){
    x = (swing.position.x + swing.width / 2) - 44 * swing.scale.x * i;
    posStay.push(x);
  }

  for(var i = 0; i < posStay.length; i++){
    var object = {pos: posStay[i], mass: 0};
    posStayObject.push(object);
  }

}

function listenerButtonGoBack(){
  game.state.start("MainMenu", true, false);
}

function listenerButtonCheck(){
  gameEnable();
  checkMass();
  if ((forceLeft > forceRight) && (buttonRotation1Active)){
    soundWin.play();
    buttonCheck.visible = false;
    buttonNext.visible = true;
  } else if ((forceLeft < forceRight) && (buttonRotation3Active)){
    soundWin.play();
    buttonCheck.visible = false;
    buttonNext.visible = true;
  } else if ((forceLeft === forceRight) && (buttonRotation2Active)){
    soundWin.play();
    buttonCheck.visible = false;
    buttonNext.visible = true;
  } else {
    soundLose.play();
    buttonCheck.visible = false;
    buttonTryAgain.visible = true;
  }
}
