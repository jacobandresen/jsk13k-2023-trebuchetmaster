import { zzfx } from './ZzFX.js'
import {
  init,
  initInput,
  onInput,
  Text,
  GameLoop
} from './kontra.mjs';
import {
  Trebuchet
} from './gameObjects.js';

async function main() {
  let trebuchet, isPlaying, entities;
  let { canvas, context } = init();

  let mainText = Text({
    text: 'Click to Play',
    font: '154px Arial',
    color: 'white',
    x: canvas.width / 2,
    y: canvas.height / 2 + 76,
    anchor: {x: 0.5, y: 0.5}
  });

  initInput();

  onInput(['down', 'south', 'enter', 'space'], handleInput);
  function handleInput() {
    if (!isPlaying)
      startGame();    
  }

  function startGame() {
    isPlaying = 1;
    trebuchet = new Trebuchet({ x: 256, y: canvas.height - 111 });
    entities = [trebuchet];
  }

  function gameUpdate() {
    if (isPlaying) {
    }
  }

  function gameRender() {
    if (isPlaying) {
      entities.map(entity => entity.render());
      }

    if (!trebuchet || !isPlaying) {
      mainText.text = !isPlaying ? 'Click to Play' : 'Game Over';
      mainText.render();
    }
  }

  let loop = GameLoop({
    update: gameUpdate,
    render: gameRender
  });
  loop.start();
}

main();
