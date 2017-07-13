//Объявление переменных
var doc = window;
var game = new Phaser.Game(doc.innerWidth - 15, doc.innerHeight - 15, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update});
var background, swing, formForObject, brick = null, placeObjects, numPlaces = 0, numPage = 1, maxPage = 2;
var object1, object2, object3, object4, object5, object6, object7, object8, bodies = [];
var buttonMarks, buttonGame, arrowButtonRight, arrowButtonLeft;
var speed = 2, arrowRight, arrowLeft, marks, isOverContact;
var mouseBody, isMouseMove = false, x = 135, y = 500, gameOn = false;
var mouseConstraint, spring = null, spring2;
var posStay = [148, 192, 236, 280, 324, 368, 412, 458, 546 ,588, 632, 676, 720, 764, 808, 852];
var count = 0, bodyMove, movePointer, a, isCreateSpring = false, positionForObject = {x: null, y: null}, isCreateSpring2 = false, body1;
var objects = [], movingObject = null, posStayObject = [], isNeedRotate = false, accuracyRotate = 0.005, textMass = [], scrollHeight, scrollWidth;

//Функция Phaser по умолчанию, загружает ихображения в кэш браузера
function preload(){
  game.load.image("wizball", "assets/wizball.png");
  game.load.image("gem", "assets/gem.png");
  game.load.image("mushroom", "assets/mushroom.png");
  game.load.image("firstaid", "assets/firstaid.png");
  game.load.image("diamond", "assets/diamond.png");
  game.load.image("swing", "assets/swing.png");
  game.load.image("marks", "assets/marks.png");
  game.load.image("brick", "assets/brick.png");
  game.load.image("background", "assets/background.jpg");
  game.load.image("ball", "assets/aqua_ball.png");
  game.load.spritesheet('button', 'assets/button_texture_atlas.png', 193, 71);
  game.load.spritesheet("arrowRight", "assets/arrow_right.png", 40, 40);
  game.load.spritesheet("arrowLeft", "assets/arrow_left.png", 40, 40);
  game.load.spritesheet("buttonMarksOnOff", "assets/button_marks_on_off.png", 67, 16.5);
  game.load.spritesheet("buttonGameOnOff", "assets/button_on_off_game.png", 67, 16.5);
  game.load.spritesheet("buttonArrow", "assets/arrow-button.png", 112, 95);
  game.load.image("placeObjects", "assets/form_object.png")
}

//Функция Phaser по умолчанию, вызывается один раз за игру и создает нужные для работы объекты
function create(){
  background = game.add.image(0, 0, "background");
  background.height = game.height;
  background.width = game.width;

  game.physics.startSystem(Phaser.Physics.P2JS);

  createPlaceObjects();

  marks = game.add.sprite(500, 500, "marks");
  marks.anchor.x = 0.5;
  marks.anchor.y = -0.2;
  marks.scale.x = 1.33

  buttonMarks = game.add.button(67, 16.5, 'buttonMarksOnOff', listenerButtonMarks, this, 0, 0, 0);
  buttonMarks.freezeFrames = true;

  buttonGame = game.add.button(67, 33, 'buttonGameOnOff', listenerButtonGame, this, 0, 0, 0);
  buttonGame.freezeFrames = true;

  for(var i = 0; i < posStay.length; i++){
    var object = {pos: posStay[i], mass: -1};
    posStayObject.push(object);
  }

  createObjects();

  swing.body.collideWorldBounds = true;

  arrowRight = game.add.sprite((swing.position.x + swing.width / 2), swing.position.y, "arrowRight");
  arrowRight.anchor.x = 0;
  arrowRight.anchor.y = 0.5;

  arrowLeft = game.add.sprite((swing.position.x - swing.width / 2), swing.position.y, "arrowLeft");
  arrowLeft.anchor.x = 1;
  arrowLeft.anchor.y = 0.5;

  mouseBody = new p2.Body();
  game.physics.p2.world.addBody(mouseBody);
  game.input.onDown.add(click, this);
  game.input.onUp.add(release, this);
  game.input.addMoveCallback(move, this);

  createTextMass();
  listenerButtonFormRight();
  listenerButtonFormLeft();
}

//Функция Phaser по умолчанию, вызывается каждый кадр
function update(){
  for (var i = 0; i < objects.length; i++){
    objects[i].body.setZeroVelocity();
    objects[i].body.rotateLeft(0);
    objects[i].body.rotateRight(0);
    objects[i].body.rotation = 0;
  }
  marks.rotation = swing.rotation

  swing.body.x = 500;
  swing.body.y = 500;
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
  checkMass();
  checkSwing();
  if (!gameOn){
    swing.body.rotation = 0;
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
  var pos = getPositionAtForm();
  object1 = game.add.sprite(500, 200, "ball");
  object1.selectSwing = null;
  object1.anchor.x = 0.5;
  object1.anchor.y = 1;
  object1.position.x = pos.x;
  object1.position.y = pos.y;
  object1.homePage = 1;
  objects.push(object1);

  pos = getPositionAtForm();
  object2 = game.add.sprite(600, 200, "ball");
  object2.selectSwing = null;
  object2.anchor.x = 0.5;
  object2.anchor.y = 1;
  object2.position.x = pos.x;
  object2.position.y = pos.y;
  object2.homePage = 1;
  objects.push(object2);

  pos = getPositionAtForm();
  object3 = game.add.sprite(700, 200, "ball");
  object3.selectSwing = null;
  object3.anchor.x = 0.5;
  object3.anchor.y = 1;
  object3.position.x = pos.x;
  object3.position.y = pos.y;
  object3.homePage = 1;
  objects.push(object3);

  pos = getPositionAtForm();
  object4 = game.add.sprite(700, 200, "wizball");
  object4.selectSwing = null;
  object4.anchor.x = 0;
  object4.anchor.y = 0;
  object4.position.x = pos.x;
  object4.position.y = pos.y;
  object4.homePage = 1;
  objects.push(object4);

  pos = getPositionAtForm();
  object5 = game.add.sprite(700, 200, "diamond");
  object5.selectSwing = null;
  object5.anchor.x = 0;
  object5.anchor.y = 0;
  object5.position.x = pos.x;
  object5.position.y = pos.y;
  object5.homePage = 2;
  objects.push(object5);

  pos = getPositionAtForm();
  object6 = game.add.sprite(700, 200, "mushroom");
  object6.selectSwing = null;
  object6.anchor.x = 0;
  object6.anchor.y = 0;
  object6.position.x = pos.x;
  object6.position.y = pos.y;
  object6.homePage = 2;
  objects.push(object6);

  pos = getPositionAtForm();
  object7 = game.add.sprite(700, 200, "gem");
  object7.selectSwing = null;
  object7.anchor.x = 0;
  object7.anchor.y = 0;
  object7.position.x = pos.x;
  object7.position.y = pos.y;
  object7.homePage = 2;
  objects.push(object7);

  pos = getPositionAtForm();
  object8 = game.add.sprite(700, 200, "firstaid");
  object8.selectSwing = null;
  object8.anchor.x = 0;
  object8.anchor.y = 0;
  object8.position.x = pos.x;
  object8.position.y = pos.y;
  object8.homePage = 2;
  objects.push(object8);

  swing = game.add.sprite(500, 500, "swing");

  game.physics.p2.enable([swing, object1, object2, object3, object4, object5, object6, object7, object8]);

  objects.forEach(function (item, i, objects){
    bodies.push(item.body);
    item.i = i;
    item.body.collideWorldBounds = true;
    item.body.spring = null;
    item.body.posStay = 0;
    item.body.mass = game.rnd.between(1, 20);
    item.body.beginPosX = item.position.x;
    item.body.beginPosY = item.position.y;
  })
}

//Слушатель левой кнопки на форме
function listenerButtonFormLeft(){
  if ( numPage !== 1){
    numPage--;
    updateForm();
  }
}

//Слушатель правой кнопки на форме
function listenerButtonFormRight(){
  if (numPage !== maxPage){
    numPage++;
    updateForm();
  }
}

//Функция возвращающая позицию объекта на форме
function getPositionAtForm(){
  var pos = {x:0, y:0};
  switch(numPlaces){
    case 4:{
      numPlaces = 0;
    }
    case 0:{
      pos.x = placeObjects.x + placeObjects.width / 4;
      pos.y = placeObjects.y + placeObjects.height / 4;
      numPlaces++;
    }break;
    case 1:{
      pos.x = placeObjects.x + placeObjects.width * 0.75;
      pos.y = placeObjects.y + placeObjects.height / 4;
      numPlaces++;
    }break;
    case 2:{
      pos.x = placeObjects.x + placeObjects.width / 4;
      pos.y = placeObjects.y + placeObjects.height * 0.75;
      numPlaces++;
    }break;
    case 3:{
      pos.x = placeObjects.x + placeObjects.width * 0.75;
      pos.y = placeObjects.y + placeObjects.height * 0.75;
      numPlaces++;
    }break;
  }
  return pos;
}

//Функция для обновления формы с объектами при удалении с качель объектов
function updateForm(){
  var max = (numPage * 4) - 1;
  var min = max - 4;
  bodies = [];
  for (var j = min + 1; j <= max; j++){
    console.log(j)
    objects[j].alpha = 1;
    objects[j].body.collideWorldBounds = true;
    bodies.push(objects[j].body);
    objects[j].alive = true;
    textMass[j].alpha = 1;
  }
  if (min !== 0){
    for (var i = 0; i <= min; i++){
      if (objects[i].body.spring === null){
        objects[i].alpha = 0;
        objects[i].body.collideWorldBounds = false;
        objects[i].alive = false;
        textMass[i].alpha = 0;
      } else {
        bodies.push(objects[i].body);
      }
    }
  }
  if ((max + 1) !== objects.length){
    for (var i = (max + 1); i < objects.length; i++){
      if (objects[i].body.spring === null){
        objects[i].alpha = 0;
        objects[i].body.collideWorldBounds = false;
        objects[i].alive = false;
        textMass[i].alpha = 0;
      } else {
        bodies.push(objects[i].body);
      }
    }
  }
}

//Слушатель кнопки вкл/выкл маркеры
function listenerButtonMarks(){
  if (marks.alpha === 1){
    buttonMarks.frame = 1;
    marks.alpha = 0;
  } else {
    buttonMarks.frame = 0;
    marks.alpha = 1;
  }
}

//Слушатель кнопки вкл/выкл игру
function listenerButtonGame(){
  if (gameOn){
    gameOn = false;
    buttonGame.frame = 1;
  } else {
    gameOn = true;
    buttonGame.frame = 0;
  }
}

//Функция срабатывающая при нажатии кнопки мыши. Входной параметр pointer - координаты курсора
function click(pointer) {

  var bodiesHit = game.physics.p2.hitTest(pointer.position, bodies);

      // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
  var physicsPos = [game.physics.p2.pxmi(pointer.position.x), game.physics.p2.pxmi(pointer.position.y)];

  if (bodiesHit.length){
    for (var i = 0; i < objects.length; i++){
      if (objects[i].body.id === bodiesHit[0].id){
        movingObject = objects[i];
      }
    }
    if (movingObject.body.spring != null){
      var spring = movingObject.body.spring;
      game.physics.p2.removeSpring(spring);
      posStayObject[movingObject.body.posStay].mass = -1;
      movingObject.body.posStay = -1;
      movingObject.body.spring = null;
      isNeedRotate = true;
    }

    var clickedBody = bodiesHit[0];

    var localPointInBody = [0, 0];
          // this function takes physicsPos and coverts it to the body's local coordinate system
    clickedBody.toLocalFrame(localPointInBody, physicsPos);
          // use a revoluteContraint to attach mouseBody to the clicked body
    mouseConstraint = this.game.physics.p2.createRevoluteConstraint(mouseBody, [0, 0], clickedBody, [game.physics.p2.mpxi(localPointInBody[0]), game.physics.p2.mpxi(localPointInBody[1])]);

    bodyMove = true;
  }

}

//Функция срабатывающая при отпускании кнопки мыши
function release() {
  game.physics.p2.removeConstraint(mouseConstraint);
  bodyMove = false;
  if (brick !== null){
    brick.kill();
  }
  if (positionForObject.mustCreate){
    movingObject.body.x = positionForObject.x;
    movingObject.body.y = positionForObject.y;
    movingObject.body.spring = game.physics.p2.createSpring(swing, movingObject, 0, 0, 100);
    posStayObject[movingObject.body.posStay].mass = movingObject.body.mass;
    positionForObject.mustCreate = false;
    isCreateSpring = true;
    movingObject = null;
    isNeedRotate = true;
  } else if (movingObject !== null){
    movingObject.body.x = movingObject.body.beginPosX;
    movingObject.body.y = movingObject.body.beginPosY;
    if ( movingObject.homePage !== numPage){
      movingObject.alpha = 0;
      movingObject.body.collideWorldBounds = false;
      movingObject.alive = false;
      textMass[movingObject.i].alpha = 0;
      updateForm();
    }
  }

}

//Функция для перемещения объекта. Входной параметр pointer - координаты курсора
function move(pointer) {
      // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
  mouseBody.position[0] = game.physics.p2.pxmi(pointer.position.x);
  mouseBody.position[1] = game.physics.p2.pxmi(pointer.position.y);
}

//Функция для проверки куда можно поставить объект
function checkSwing(){
  movePointer = game.input.mousePointer;
  if (bodyMove){
    for (var i = 0; i < posStayObject.length; i++){
      if ( (movePointer.x - 13 < posStayObject[i].pos) && (movePointer.x + 13 > posStayObject[i].pos) && (movePointer.y < swing.position.y)){
        if ( brick !== null){
          brick.kill();
        }
        movingObject.body.posStay = i;
        brick = game.add.sprite(posStay[i] - 13, swing.body.y, "brick");
        brick.anchor.x = 0;
        brick.anchor.y = 0.5;
        brick.alpha = 0.75;
        brick.position.rotate(swing.body.x, swing.body.y, swing.body.angle, 1);
        brick.angle = swing.angle;
        positionForObject.mustCreate = true;
        positionForObject.x = brick.x;
        positionForObject.y = brick.y;
        return;
      } else {
        positionForObject.mustCreate = false;
        movingObject.body.posStay = -1;
      }
    }
  }
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
  var forceLeft = 0, forceRight = 0, forceDiff = 0, alfa = 0;
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
      } else {
        swing.body.rotation -= 0.01;
      }
    } else if ( swing.body.rotation < 0  && alfa === 0 && (forceLeft === forceRight)){
      if ((swingRotation < accuracyRotate) && (swingRotation > -accuracyRotate)){
        swing.body.rotation = 0;
      } else {
        swing.body.rotation += 0.01;
      }
    }
  } else if (forceLeft > forceRight){
    swing.body.rotation = -alfa;
  } else {
    swing.body.rotation = alfa;
  }
}

//Функция для создания текста с массой объекта
function createTextMass(){
  for (var i = 0; i < objects.length; i++){
    var text = game.add.text(objects[i].position.x, (objects[i].position.y - objects[i].height / 4), objects[i].body.mass + " кг", { font: "20px Arial", fill: "#ff0044", align: "center" });
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
