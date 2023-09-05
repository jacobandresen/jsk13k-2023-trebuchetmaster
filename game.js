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
    
    // 1DOF simulation from www.benchtophybrid.com (ported to kontra.js)
    let m1 = 10;                // mass of counterweight (kg)
    let m2 = 0.1;               // mass of projectile (kg)
    let L1 = 0.15;              // length from pivot to short end of arm (m)
    let L2 = 0.4;               // length from pivot to long end of arm (m)
    let w  = 0.04;              // height of arm (m)
    let t  = 0.01;              // thickness of arm (m)
    let h0  = 0.2;              // height of pivot (m)
    let rho = 600;              // density of arm (kg/m^3)
    let beta = -70*Math.PI/180; // hook angle

    trebuchet = new Trebuchet({ m1, m2, L1, L2, w, t, h0, rho, beta });
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