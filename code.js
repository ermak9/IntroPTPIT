var conf = {
    width: 800,
    height: 600,
    renderer: Phaser.CANVAS,
    parent: 'intro',
    transparent: false,
    antialias: false,
    state: this,
    resolution: 2
};

var game = new Phaser.Game(1440, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update});
var background, swing, object1, object2, isOverContact, brick = null, speed = 2, arrowRight, arrowLeft, marks, buttonMarks, buttonGame;
var mouseBody, isMouseMove = false, x = 135, y = 500, gameOn = false;
var mouseConstraint, spring = null, spring2;
var posStay = [148, 192, 236, 280, 324, 368, 412, 458, 546 ,588, 632, 676, 720, 764, 808, 852];
var count = 0, bodyMove, movePointer, a, isCreateSpring = false, positionForObject = {x: null, y: null}, isCreateSpring2 = false, body1;
var objects = [], movingObject = null, posStayObject = [], isNeedRotate = false, accuracyRotate = 0.005, textMass = [];

function preload(){
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
}

function create(){
  game.physics.startSystem(Phaser.Physics.P2JS);

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

  object1 = game.add.sprite(500, 200, "ball");
  object1.selectSwing = null;
  object1.anchor.x = 0.5;
  object1.anchor.y = 1;

  object2 = game.add.sprite(600, 200, "ball");
  object2.selectSwing = null;
  object2.anchor.x = 0.5;
  object2.anchor.y = 1;

  object3 = game.add.sprite(700, 200, "ball");
  object3.selectSwing = null;
  object3.anchor.x = 0.5;
  object3.anchor.y = 1;

  swing = game.add.sprite(500, 500, "swing");

  game.physics.p2.enable([swing, object1, object2, object3]);

  object1.body.collideWorldBounds = true;
  object1.body.spring = null;
  object1.body.posStay = 0;
  object1.alpha = 0.5;
  object1.body.mass = 10;
  object1.body.beginPosX = object1.position.x;
  object1.body.beginPosY = object1.position.y;

  object2.body.collideWorldBounds = true;
  object2.body.spring = null;
  object2.body.posStay = 0;
  object2.body.mass = 5;
  object2.body.beginPosX = object2.position.x;
  object2.body.beginPosY = object2.position.y;

  object3.body.collideWorldBounds = true;
  object3.body.spring = null;
  object3.body.posStay = 0;
  object3.body.mass = 5;
  object3.body.beginPosX = object3.position.x;
  object3.body.beginPosY = object3.position.y;

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

  objects.push(object1);
  objects.push(object2);
  objects.push(object3);

  createTextMass();
}

function update(){
  for (var i = 0; i < objects.length; i++){
    objects[i].body.setZeroVelocity();
  }
  marks.rotation = swing.rotation

  swing.body.x = 500;
  swing.body.y = 500;
  swing.body.setZeroVelocity();

  for (var i = 0; i < objects.length; i++){
    if (objects[i].body.spring !== null){
      updatePos(objects[i].body.posStay);
      objects[i].body.rotation = 0;
      objects[i].body.x = positionForObject.x;
      objects[i].body.y = positionForObject.y;
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

function listenerButtonMarks(){
  if (marks.alpha === 1){
    buttonMarks.frame = 1;
    marks.alpha = 0;
  } else {
    buttonMarks.frame = 0;
    marks.alpha = 1;
  }
}

function listenerButtonGame(){
  if (gameOn){
    gameOn = false;
    buttonGame.frame = 1;
  } else {
    gameOn = true;
    buttonGame.frame = 0;
  }
}

function click(pointer) {
  console.log("click: ");

  var bodies = game.physics.p2.hitTest(pointer.position, [ object1.body, object2.body, object3.body]);

      // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
  var physicsPos = [game.physics.p2.pxmi(pointer.position.x), game.physics.p2.pxmi(pointer.position.y)];

  if (bodies.length){
    for (var i = 0; i < objects.length; i++){
      if (objects[i].body.id === bodies[0].id){
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

    var clickedBody = bodies[0];

    var localPointInBody = [0, 0];
          // this function takes physicsPos and coverts it to the body's local coordinate system
    clickedBody.toLocalFrame(localPointInBody, physicsPos);
          // use a revoluteContraint to attach mouseBody to the clicked body
    mouseConstraint = this.game.physics.p2.createRevoluteConstraint(mouseBody, [0, 0], clickedBody, [game.physics.p2.mpxi(localPointInBody[0]), game.physics.p2.mpxi(localPointInBody[1])]);

    bodyMove = true;
  }

}

function release() {
      // remove constraint from object's body
  game.physics.p2.removeConstraint(mouseConstraint);
  bodyMove = false;
  if (brick !== null){
    brick.kill();
  }
  if (positionForObject.mustCreate){
    movingObject.body.x = positionForObject.x + (13);
    movingObject.body.y = positionForObject.y - (movingObject.body.height / 2);
    movingObject.body.spring = game.physics.p2.createSpring(swing, movingObject, 0, 0, 100);
    posStayObject[movingObject.body.posStay].mass = movingObject.body.mass;
    positionForObject.mustCreate = false;
    isCreateSpring = true;
    movingObject = null;
    isNeedRotate = true;
  } else if (movingObject !== null){
    movingObject.body.x = movingObject.body.beginPosX;
    movingObject.body.y = movingObject.body.beginPosY;
  }

}

function move(pointer) {
      // p2 uses different coordinate system, so convert the pointer position to p2's coordinate system
  mouseBody.position[0] = game.physics.p2.pxmi(pointer.position.x);
  mouseBody.position[1] = game.physics.p2.pxmi(pointer.position.y);
}

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

function updatePos(number){
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
    alfa = 0.22;
  }

  var speedRotate = forceDiff / 10000;
  if (gameOn){
    rotateSwing(alfa, speedRotate, forceLeft, forceRight);
  }
}

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
  }
}

function createTextMass(){
  for (var i = 0; i < objects.length; i++){
    var text = game.add.text(objects[i].position.x, (objects[i].position.y - objects[i].height), objects[i].body.mass + " кг", { font: "20px Arial", fill: "#ff0044", align: "center" });
    text.anchor.setTo(0.5, 0.5);
    textMass.push(text);
  }
}

function updatePositionTextMass(){
  for (var i = 0; i < objects.length; i++){
    textMass[i].position.x = objects[i].position.x;
    textMass[i].position.y = objects[i].position.y - objects[i].height;
  }
}

function updateBalanceArrow(){
  if (swing.rotation < 0.0001 && swing.rotation > -0.0001){
    arrowLeft.frame = 1;
    arrowRight.frame = 1;
  } else {
    arrowLeft.frame = 0;
    arrowRight.frame = 0;
  }
}
