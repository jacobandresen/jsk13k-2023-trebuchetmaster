/*
    KontraJs Breakout Example
*/
import { zzfx } from './ZzFX.js'
import {
  init,
  initInput,
  onInput,
  gamepadAxis,
  keyPressed,
  pointerPressed,
  loadImage,
  collides,
  getWorldRect,
  clamp,
  degToRad,
  rotatePoint,
  movePoint,
  randInt,
  Text,
  Sprite,
  GameLoop
} from './kontra.mjs';
import {
  Trebuchet,
  Block,
  Ball
} from './gameObjects.js';
import {
  roundRect,
  circleRectCollision,
  vectorAngle,
  getSideOfCollision
} from './utils.js';

async function main() {
  let ball, trebuchet, isPlaying, usingKeyboard, entities;

  ///////////////////////////////////////////////////////////////////////////////
  let { canvas, context } = init();
  initInput();

  ///////////////////////////////////////////////////////////////////////////////
  // Objects
  let mainText = Text({
    text: 'Click to Play',
    font: '154px Arial',
    color: 'white',
    x: canvas.width / 2,
    y: canvas.height / 2 + 76,
    anchor: {x: 0.5, y: 0.5}
  });

  ///////////////////////////////////////////////////////////////////////////////
  function startGame() {
    isPlaying = 1;

    trebuchet = new Trebuchet({ x: 256, y: canvas.height - 111 });
    entities = [trebuchet];

  }

  ///////////////////////////////////////////////////////////////////////////////
  onInput(['down', 'south', 'enter', 'space'], handleInput);
  function handleInput() {
    if (ball) return;

    if (!isPlaying)
      startGame();
    else if (!lives) {
      // game over
      isPlaying = 0;
      entities = [];
    }

    if (isPlaying) {
      //ball = new Ball({ x: canvas.width / 2, y: canvas.height / 2 });
      //zzfx(...[,0,500,,.04,.3,1,2,,,570,.02,.02,,,,.04]);
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  function gameUpdate() {
    if (isPlaying) {
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  function gameRender() {
    if (isPlaying) {
      entities.map(entity => entity.render());
      }

    if (!trebuchet || !isPlaying) {
      mainText.text = lives || !isPlaying ? 'Click to Play' : 'Game Over';
      mainText.render();
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Startup GameLoop
  let loop = GameLoop({
    update: gameUpdate,
    render: gameRender
  });
  loop.start();
}

main();
