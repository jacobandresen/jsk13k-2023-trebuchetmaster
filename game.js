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

  initInput();
  startGame();    


  onInput(['down', 'south', 'enter', 'space'], handleInput);
  function handleInput() {
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
  //  if (isPlaying) {
      entities.map(entity => entity.render());
  //    }
  }

  let loop = GameLoop({
    update: gameUpdate,
    render: gameRender
  });
  loop.start();
}

main();