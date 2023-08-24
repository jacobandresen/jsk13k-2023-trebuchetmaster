import { zzfx } from './ZzFX.js'
import {
  SpriteClass,
  getCanvas,
  gamepadAxis,
  keyPressed,
  pointerPressed,
  getPointer,
  Sprite
} from './kontra.mjs';
import { roundRect } from './utils.js';

let usingKeyboard;

export class Trebuchet extends SpriteClass {
  constructor(props) {
    let canvas = getCanvas();
    let width = 400;
    let height = 53;

    super({
      ...props,
      type: 0,
      width,
      height,
      color: '#fff',
      anchor: { x: 0.5, y: 0.5 }
    });

    this.position.clamp(0, 0, 0, 0);
  }

  draw() {
    let { width, height, color } = this;
    roundRect(0, -100, width, height, 10, this.color);
  }

  update() {
    let pointer = getPointer();
    let axisX = gamepadAxis('leftstickx', 0);
    if (Math.abs(axisX) > 0.4) {
      this.x += axisX;
    }
    let keyboardDirection = keyPressed('arrowright') - keyPressed('arrowleft');
    if (keyboardDirection) {
      this.x += 38 * keyboardDirection;
      usingKeyboard = 1;
    }
    else if (!usingKeyboard || pointerPressed('left')) {
      // move to mouse/touch  
      this.x = pointer.x;
      usingKeyboard = 0;
    }
  }
};

export class Arm extends SpriteClass {

  constructor(props) {
    let canvas = getCanvas();
    let length = 10;
    let mass = 100;
    super({
      ...props,
      type: 0,
      width,
      height,
      color: '#fff',
      anchor: { x: 0.5, y: 0.5 }
    });
  }

  draw() {
  }

  update() {
  }
};

export class Weight extends SpriteClass { 
  constructor(props) {
    super({
      ...props,
      type: 1
    })
  }

  draw() {
    let { width, height, color } = this;
    roundRect(0, 0, width, height, 8, color);
  }
}

export class Projectile extends SpriteClass {
  // Projectile Type
  // Mass of Projectile
  // Projectile Diameter
  // Windspeed

  constructor(props) {
    super({
      ...props,
      type: 1
    })
  }

  draw() {
    let { width, height, color } = this;
    roundRect(0, 0, width, height, 8, color);
  }

  bounce() {
    zzfx(...[,,1e3,,.03,.02,1,2,,,940,.03,,,,,.2,.6,,.06]);
  }
}
