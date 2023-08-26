import {
  init,
  initInput,
  onInput,
  GameLoop
} from './kontra.mjs';
import {
  Trebuchet
} from './gameObjects.js';

async function main() {
  let trebuchet;
  let { canvas } = init();

  initInput();
  startGame();    

  onInput(['down', 'south', 'enter', 'space'], handleInput);
  function handleInput() {
  }

  function startGame() {
    trebuchet = new Trebuchet({ x: 150 , y: canvas.height - 100 });
    entities = [trebuchet];
  }

  function gameUpdate() {
  }

  function gameRender() {
    trebuchet.render();
  }

  let loop = GameLoop({
    update: gameUpdate,
    render: gameRender
  });
  loop.start();
}

main();