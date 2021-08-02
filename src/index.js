import './index.scss';
import ClientGame from './client/clientGame';

const menu = document.getElementById('menu');
const submitBtn = document.getElementById('submitBtn');
const input = document.getElementById('name');
const form = document.getElementById('nameForm');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  menu.parentNode.removeChild(menu);
  ClientGame.init({ tagId: 'game', playerName: input.value });
});



// window.addEventListener('load', () => {
//   ClientGame.init({ tagId: 'game' });
// });

/*
import MaleWalk from './assets/Male-3-Walk.png';
import terrainAtlas from './assets/terrain.png';
import worldCfg from './configs/world.json';
import sprites from './configs/sprites.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const spriteW = 48;
const spriteH = 48;

const terrain = document.createElement('img');
terrain.src = terrainAtlas;

terrain.addEventListener('load', () => {
	const {map} = worldCfg;
	map.forEach((cfgRow, y) => {
		cfgRow.forEach((cfgCell, x) => {
			const [sX, sY, sW, sH] = sprites.terrain[cfgCell[0]].frames[0];
			ctx.drawImage(terrain, sX, sY, sW, sH, x * spriteW, y * spriteH, spriteW, spriteH);
		})
	});
})


/*
const shoots = 3;
const screenWidth = 600;
const screenHeight = 600;
let cycle = 0;

let bottomPressed = false;
let upPressed = false;
let leftPressed = false;
let rightPressed = false;

let pY = screenHeight / 2 - spriteH / 2;
let pX = screenWidth / 2 - spriteW / 2;
let spriteDirection = 0;
const playerStep = 10;
const backgroundStep = 10;

const img = document.createElement('img');
img.src = MaleWalk;

function keyDownHandler(e) {
  if (e.key === 'Down' || e.key === 'ArrowDown') {
    bottomPressed = true;
  } else if (e.key === 'Up' || e.key === 'ArrowUp') {
    upPressed = true;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = true;
  } else if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key === 'Down' || e.key === 'ArrowDown') {
    bottomPressed = false;
  } else if (e.key === 'Up' || e.key === 'ArrowUp') {
    upPressed = false;
  } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
    leftPressed = false;
  } else if (e.key === 'Right' || e.key === 'ArrowRight') {
    rightPressed = false;
  }
}

function checkBounds() {
  if (pX <= 0) {
    pX = 0;
  }
  if (pX >= screenWidth - spriteW) {
    pX = screenWidth - spriteW;
  }
  if (pY <= 0) {
    pY = 0;
  }
  if (pY >= screenHeight - spriteH) {
    pY = screenHeight - spriteH;
  }
}

function updateAnimation() {
  cycle = (cycle + 1) % shoots;
}

function checkMovement() {
  if (bottomPressed) {
    pY += playerStep;
    updateAnimation();
    spriteDirection = spriteH * 0;
  } else if (upPressed) {
    pY -= playerStep;
    updateAnimation();
    spriteDirection = spriteH * 3;
  } else if (leftPressed) {
    pX -= playerStep;
    updateAnimation();
    spriteDirection = spriteH * 1;
  } else if (rightPressed) {
    pX += playerStep;
    updateAnimation();
    spriteDirection = spriteH * 2;
  }
}

function drawGrassTypeA(x, y, step, color, invert) {
  const stepWithDirection = invert ? -step : step;
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(x, y);
  ctx.lineTo(x + stepWithDirection, y);
  ctx.moveTo(x + 2 * stepWithDirection, y);
  ctx.lineTo(x + 3 * stepWithDirection, y);
  ctx.moveTo(x + stepWithDirection, y + stepWithDirection);
  ctx.lineTo(x + 2 * stepWithDirection, y + stepWithDirection);
  ctx.stroke();
}

function drawGrassTypeB(x, y, step, color, invert) {
const stepWithDirection = invert ? -step : step;  
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.moveTo(x, y);
  ctx.lineTo(x + stepWithDirection, y);
  ctx.moveTo(x + stepWithDirection, y - stepWithDirection);
  ctx.lineTo(x + 3 * stepWithDirection, y - stepWithDirection);
  ctx.stroke();
}

function drawGrassTypeC(x, y, step, color1, color2, invert) {
	const stepWithDirection = invert ? -step : step;
  ctx.beginPath();
  ctx.strokeStyle = color1;
  ctx.moveTo(x, y);
  ctx.lineTo(x + 3 * stepWithDirection, y);
  ctx.moveTo(x + stepWithDirection, y + stepWithDirection);
  ctx.lineTo(x + 4 * stepWithDirection, y + stepWithDirection);
  ctx.moveTo(x + 3 * stepWithDirection, y + 2 * stepWithDirection);
  ctx.lineTo(x + 4 * stepWithDirection, y + 2 * stepWithDirection);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = color2;
  ctx.moveTo(x + 2 * stepWithDirection, y + 2 * stepWithDirection);
  ctx.lineTo(x + 3 * stepWithDirection, y + 2 * stepWithDirection);
  ctx.moveTo(x + 3 * stepWithDirection, y + 3 * stepWithDirection);
  ctx.lineTo(x + 4 * stepWithDirection, y + 3 * stepWithDirection);
  ctx.stroke();
}

function drawFlower(x, y, step, color1, color2) {
  ctx.beginPath();
  ctx.strokeStyle = color1;
  ctx.moveTo(x + step, y);
  ctx.lineTo(x + 2 * step, y);
  ctx.moveTo(x, y + step);
  ctx.lineTo(x + step, y + step);
  ctx.moveTo(x + 2 * step, y + step);
  ctx.lineTo(x + 3 * step, y + step);
  ctx.moveTo(x + step, y + 2 * step);
  ctx.lineTo(x + 2 * step, y + 2 * step);
  ctx.stroke();

  ctx.beginPath();
  ctx.strokeStyle = color2;
  ctx.moveTo(x + step, y + step);
  ctx.lineTo(x + 2 * step, y + step);
  ctx.stroke();
}

function drawBackground() {
  ctx.fillStyle = '#679F37';
  ctx.fillRect(0, 0, screenWidth, screenHeight);

  ctx.lineWidth = 10;

  drawGrassTypeA(250, 50, backgroundStep, '#548B30', false);
  drawGrassTypeA(550, 200, backgroundStep, '#548B30', true);
  drawGrassTypeA(300, 450, backgroundStep, '#548B30', false);
  drawGrassTypeA(100, 200, backgroundStep, '#548B30', true);
  drawGrassTypeA(500, 500, backgroundStep, '#548B30', false);
  drawGrassTypeA(200, 300, backgroundStep, '#548B30', true);
  drawGrassTypeA(50, 450, backgroundStep, '#548B30', false);
  drawGrassTypeA(450, 400, backgroundStep, '#548B30', true);

  drawGrassTypeB(150, 100, backgroundStep, '#95BC74', false);
  drawGrassTypeB(450, 70, backgroundStep, '#95BC74', true);
  drawGrassTypeB(420, 220, backgroundStep, '#95BC74', true);
  drawGrassTypeB(80, 380, backgroundStep, '#95BC74', false);
  drawGrassTypeB(160, 530, backgroundStep, '#95BC74', true);
  drawGrassTypeB(310, 250, backgroundStep, '#95BC74', false);
  drawGrassTypeB(510, 470, backgroundStep, '#95BC74', true);
  drawGrassTypeB(320, 560, backgroundStep, '#95BC74', false);

  drawGrassTypeC(30, 40, backgroundStep, '#548B30', '#32531C', false);
  drawGrassTypeC(100, 150, backgroundStep, '#548B30', '#32531C', true);
  drawGrassTypeC(200, 380, backgroundStep, '#548B30', '#32531C', false);
  drawGrassTypeC(460, 120, backgroundStep, '#548B30', '#32531C', false);
  drawGrassTypeC(520, 310, backgroundStep, '#548B30', '#32531C', false);
  drawGrassTypeC(70, 510, backgroundStep, '#548B30', '#32531C', true);
  drawGrassTypeC(250, 490, backgroundStep, '#548B30', '#32531C', false);
  drawGrassTypeC(320, 100, backgroundStep, '#548B30', '#32531C', false);

  drawFlower(210, 170, backgroundStep, '#F8FBE7', '#FDD836');
  drawFlower(450, 320, backgroundStep, '#F8FBE7', '#FDD836');
  drawFlower(370, 370, backgroundStep, '#F8FBE7', '#FDD836');
  drawFlower(130, 470, backgroundStep, '#F8FBE7', '#FDD836');
}

function draw() {
  ctx.clearRect(0, 0, screenWidth, screenHeight);

  drawBackground();

  ctx.drawImage(img, cycle * spriteW, spriteDirection, spriteW, spriteH, pX, pY, 48, 48);
}

document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

img.addEventListener('load', () => {
  setInterval(() => {
    checkMovement();
    checkBounds();
    draw();
  }, 120);
});
*/
