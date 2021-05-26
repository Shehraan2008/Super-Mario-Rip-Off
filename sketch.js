let time = (score = coins = 0);
let world = 1;
let gameState = "play";
let mario, marioRunning, marioDead, checkPointSound, deadSound, jumpSound;
let gameOver, gameOverImg, reset, resetImg;
let backgroundImg, invGround, ground, groundImg;
let brickGroup, cactusGroup, cactus, cactusAnimation, brick, brickImg;

// Loading Image Assets.
function preload(params) {
  // Cactus Assets.
  cactusAnimation = loadAnimation(
    "./app/assets/cactus/cactus1.png",
    "./app/assets/cactus/cactus2.png",
    "./app/assets/cactus/cactus3.png",
    "./app/assets/cactus/cactus4.png"
  );

  // Mario Running
  marioRunning = loadAnimation(
    "./app/assets/mario/mario00.png",
    "./app/assets/mario/mario01.png",
    "./app/assets/mario/mario02.png",
    "./app/assets/mario/mario03.png"
  );
  marioDead = loadAnimation("./app/assets/mario/collided.png");

  // Ground Assets.
  backgroundImg = loadImage("./app/assets/bg.jpeg");
  groundImg = loadImage("./app/assets/ground2.png");

  // Character Assets.
  brickImg = loadImage("./app/assets/brick.png");
  resetImg = loadImage("./app/assets/restart.png");
  gameOverImg = loadImage("./app/assets/gameOver.png");

  // Sound Asset
  checkPointSound = loadSound("./app/assets/audio/checkPoint.mp3");
  dieSound = loadSound("./app/assets/audio/die.mp3");
  jumpSound = loadSound("./app/assets/audio/jump.mp3");
}

function setup(params) {
  const canvas = createCanvas(600, 300);

  // The Sprites.
  ground = createSprite(width / 2, height / 2, width, height);
  ground.addImage("background", backgroundImg);
  ground.scale = 0.3;
  ground.x = ground.width / 20;

  invGround = createSprite(width / 3, 260, width + 400, 10);
  invGround.visible = false;

  mario = createSprite(100, 210, 30, 30);
  mario.addAnimation("mario_running", marioRunning);

  reset = createSprite(width / 2, height / 2 + 50, 20, 20);
  reset.addImage(resetImg);
  reset.scale = 0.5;

  gameOver = createSprite(width / 2, height / 2, 100, 50);
  gameOver.addImage(gameOverImg);

  // Groups
  brickGroup = createGroup();
  cactusGroup = createGroup();
}

function draw(params) {
  background(0);

  // Runnning the Game According to the gameState
  if (gameState === "play") {
    // Making them insible
    reset.visible = false;
    gameOver.visible = false;

    // The Moving ground effect
    ground.velocityX = -(4 + (3 * score) / 100);
    if (ground.x < 0) {
      ground.x = ground.width / 20;
    }

    // Scoring Mechanism
    score = score + Math.round(getFrameRate() / 60);
    if (score > 0 && score % 100 === 0) {
      console.log(
        "%cCheackPoint Achieved",
        "color: #5F90F6 ; font-weight: bold ; font-style: italic ;" +
          "font-family: 'monospace' ; text-shadow: 1px 1px 3px black ;"
      );
      checkPointSound.play();
    }

    // He will stay collided with inv ground
    // He will have a certain gravity to let him stay down
    // He will Jump whever Keyis Pressed.
    mario.velocityY = mario.velocityY + 0.8;
    if (keyDown("space") && mario.y >= 150) {
      mario.velocityY = -8;
      jumpSound.play();
    }

    // Creating the obstacles and support points.
    createBrick();
    createCactus();

    // How to make the character die
    if (cactusGroup.isTouching(mario)) {
      mario.changeAnimation("mario_dead", marioDead);
      gameState = "end";
      dieSound.play();
    }

    if (brickGroup.isTouching(mario)) {
      brickGroup.destroyEach();
      coins += Math.round(random(1, 4));
    }
  } else if (gameState === "end") {
    // Making the game fell like over
    gameOver.visible = true;
    reset.visible = true;

    //Stopping the movemnet
    ground.velocityX = 0;
    mario.velocityY = 0;

    // stopping the groups and then deleating them
    cactusGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    cactusGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);

    // To restart the game press the buton
    if (mousePressedOver(reset)) {
      resetGame();
    }
  }

  // Kepping the mario moving
  mario.collide(invGround);

  // Drawing the Sprites.
  drawSprites();

  // The game essentials
  fill(255);
  textFont("VT323");
  textSize(24);
  text(`score: ${score}`, 40, 30);
  text(`world: 0-${world}`, 160, 30);
  text(`time: ${time}`, 320, 30);
  text(`coins: ${coins}`, 460, 30);
}

// Touch Screen interface
function touchStarted(params) {
  if (mario.y >= 150) {
    mario.velocityY = -8;
  }
}

function createCactus(params) {
  if (frameCount % 60 === 0) {
    cactus = createSprite(width, 230, 40, 40);
    cactus.addAnimation("cactusEating", cactusAnimation);
    cactus.velocityX = -(6 + score / 100);
    cactus.scale = 1;
    cactus.lifetime = 200;
    cactusGroup.add(cactus);
  }
}

function createBrick(params) {
  if (frameCount % 90 === 0) {
    brick = createSprite(width, 130, 50, 50);
    brick.addImage("brick", brickImg);
    brick.velocityX = -(4 + (3 * score) / 100);
    brick.lifetime = 200;
    brickGroup.add(brick);
  }
}

function resetGame(params) {
  // Hiding extra sprites and changing mario animaton;
  mario.changeAnimation(marioRunning);
  gameOver.visible = false;
  reset.visible = false;

  // Reseting the groups
  cactusGroup.destroyEach();
  brickGroup.destroyEach();

  // Resseting game Essentials
  gameState = "play";
  score = 0;
  world = 1;
  coins = 0;
  time = 0;
}
