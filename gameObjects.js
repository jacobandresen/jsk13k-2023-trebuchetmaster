import {
  SpriteClass,
  getCanvas,
  gamepadAxis,
  keyPressed,
  pointerPressed,
  getPointer
} from './kontra.mjs';
import { roundRect } from './utils.js';

let usingKeyboard;

export class Trebuchet extends SpriteClass {
  constructor(props) {
    let width = 400;
    let height = 53;

    super({...props, type: 0, width, height, color: '#fff', anchor: { x: 0.25, y: 0.5 } });
    this.position.clamp(0, 0, 0, 0);
  }

  draw() {
    roundRect(0, 10, this.width, this.height, 10, this.color);
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
      this.x = pointer.x;
      usingKeyboard = 0;
    }
  }
};
