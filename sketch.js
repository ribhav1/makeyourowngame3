var windowW, windowH;

var x;
var y;
var targetX;
var targetY;

var gameState = 0;

var knife;

var fruitGroup;
var bombGroup;
var powerUpGroup;
var knifeGroup;

var bg;
var healthPowerUp;
var playerSpeedPowerUp;
var fruitSpeedPowerUp;

var appleImg, grapeImg, orangeImg, strawberryImg, watermelonImg;

var playerMoveSpeed = 0.15;
var fruitMoveSpeed = 3;
var bombMoveSpeed = 3;

var bombSpawnRate = 300 ;
var fruitSpawnRate = 50;

var health = 25;
var score = 0;

var bombImg;

var knifeImg;
var restartImg;

function preload(){
  bg = loadImage("background.jpg");

  healthPowerUp = loadImage("healthImg.png");
  playerSpeedPowerUp = loadImage("playerspeedImg.png");
  fruitSpeedPowerUp = loadImage("fruitspeedImg.png");

  appleImg = loadImage("apple.png");
  grapeImg = loadImage("grape.png");
  orangeImg = loadImage("orange.png");
  strawberryImg = loadImage("strawberry.png");
  watermelonImg = loadImage("watermelon.png");

  restartImg = loadImage("restartImg.png");
  knifeImg = loadImage("knifeImg.png");

  bombImg = loadImage("bombImg.png");
}

function setup(){
  windowW = windowWidth - 15
  windowH = windowHeight - 21

  createCanvas(windowW, windowH);

  x = windowW / 2;
  y = windowH / 2;
  targetX = windowW / 2;
  targetY = windowH / 2;

  if(gameState === 0){
  knife = createSprite(x, y, 30, 30);
  
  fruitGroup = new Group();
  
  bombGroup = new Group();

  powerUpGroup = new Group();

  knifeGroup = new Group();
  knifeGroup.add(knife);
  } 
} 

function draw(){
  background(bg);
  fill(255);
  textSize(24);
  text("Score: " + score, 50, 50);
  text("Health: " + health, 50, 100);
  if(gameState === 0){
  x = lerp(x, targetX, playerMoveSpeed);
  y = lerp(y, targetY, playerMoveSpeed);
  
  knifeImg.resize(130, 90);
  knife.addImage(knifeImg);
  knife.setCollider("circle", 0, 0, 60);

  knife.position.x = x;
  knife.position.y = y;

  spawnFruits();
  spawnBomb();
  spawnPowerUp();
  
  for(var i = 0; i < fruitGroup.length; i++){
    if(fruitGroup.get(i).overlap(knifeGroup)){
      fruitGroup.get(i).remove();
      score++;
    }
  }
  for(var i = 0; i < powerUpGroup.length; i++){
    if(powerUpGroup.get(i).overlap(knifeGroup)){
      if(powerUpGroup.get(i).shapeColor === "red"){
        health += 25;
      }
      if(powerUpGroup.get(i).shapeColor === "green"){
        playerMoveSpeed += 0.05;
      }
      if(powerUpGroup.get(i).shapeColor === "yellow"){
        fruitMoveSpeed += 2;
        fruitSpawnRate -= 10;
      }
      powerUpGroup.get(i).remove();
    }
  }
  if(frameCount % 300 === 0){ 
    bombSpawnRate -= 5;
    fruitSpawnRate -= 1;
  }
  for(var i = 0; i < bombGroup.length; i++){
    if(bombGroup.get(i).overlap(knifeGroup)){
      bombGroup.get(i).remove();
      health--;
    }
  }
  if(health === 0){
    gameState = 1;
  }
  }
  if(gameState === 1){
    fruitGroup.removeSprites();
    bombGroup.removeSprites();
    powerUpGroup.removeSprites();
    knife.position.x = windowW / 2;
    knife.position.y = windowH / 2;
    knife.addImage(restartImg);
    knife.setCollider("circle", -4, 0, 63);
    knife.mouseUpdate();
    knife.onMousePressed = function(){
      health = 25;
      score = 0;
      playerMoveSpeed = 0.15;
      fruitMoveSpeed = 3;
      gameState = 0;
    }
    textSize(24);
    text("Final Score: " + score, windowW / 2 - 90, windowH / 2 + 100);
  }
  drawSprites();
}

function mousePressed(){
  targetX = mouseX;
  targetY = mouseY;
}

function spawnFruits(){
  if(frameCount % fruitSpawnRate === 0){
    var randX = random(0, windowW);
    var randY = random(-200, 0);
    var fruit = createSprite(randX, randY, 10, 10);
    fruit.setCollider("circle", 0, 0, 45);
    fruit.setSpeed(fruitMoveSpeed, 90);
    fruit.life = (Math.round((windowH + (abs(fruit.previousPosition.y))) / fruitMoveSpeed));
    var rand = Math.round(random(1, 5));
    switch(rand){
      case 1: fruit.addImage(appleImg);
        break;
      case 2: fruit.addImage(grapeImg);
        break;
      case 3: fruit.addImage(orangeImg);
        break;  
      case 4: fruit.addImage(watermelonImg);
        break;
      case 5: fruit.addImage(strawberryImg);
        break;
      default: 
    }
    fruitGroup.add(fruit);
  }
}

function spawnPowerUp(){
  if(frameCount % 500 === 0){
    var randX = random(15, windowW - 15);
    var randY = random(15, windowH - 15);
    var powerUp = createSprite(randX, randY, 50, 50);
    healthPowerUp.resize(100, 100);
    playerSpeedPowerUp.resize(100, 100);
    fruitSpeedPowerUp.resize(100, 100); 
    powerUp.setCollider("circle", 0, 0, 50);
    powerUp.life = 120;
    var rand = Math.round(random(1, 3));
    switch(rand){
      case 1: powerUp.addImage(healthPowerUp);
              powerUp.shapeColor = "red";
        break;  
      case 2: powerUp.addImage(playerSpeedPowerUp);
              powerUp.shapeColor = "green";
        break;
      case 3: powerUp.addImage(fruitSpeedPowerUp);
              powerUp.shapeColor = "yellow";
        break;  
    }
    powerUpGroup.add(powerUp);
  }
}

function spawnBomb(){
  if(frameCount % bombSpawnRate === 0){
    var randX = random(0, windowW);
    var randY = random(-200, 0);
    var bomb = createSprite(randX, randY, 10, 10);
    bombImg.resize(100, 100);
    bomb.addImage(bombImg);
    bomb.setCollider("circle", 0, 0, 50);
    bomb.setSpeed(bombMoveSpeed, 90);
    bomb.life = (Math.round((windowH + (abs(bomb.previousPosition.y))) / bombMoveSpeed));
    bombGroup.add(bomb);
  }
}