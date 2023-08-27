import {
  SpriteClass,
  gamepadAxis,
  keyPressed,
  pointerPressed,
  getPointer,
  getContext,
  Sprite
} from './kontra.mjs';
import { roundRect } from './utils.js';

let usingKeyboard;

export class Trebuchet extends SpriteClass {
  constructor(props) {
    super({...props, type: 0, width: 400, height: 50, color: '#fff' });
    this.position.clamp(0, 0, 0, 0);
    this.pole = new Pole({x: 0, y:0});
  }

  draw() {
    this.pole.draw();
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

export class Pole extends SpriteClass {
  constructor(props) {
    super({...props, type: 0, width: 20, height: 200, color: '#fff'});
    this.smallArm = new SmallArm({x:0, y:0});
    this.largeArm = new LargeArm({x:0, y:0});
  }

  draw() {
    roundRect(0, -this.height, this.width, this.height, 10, this.color);
    this.smallArm.draw();
    this.largeArm.draw();
  }
}

export class SmallArm extends SpriteClass {
  constructor(props) {
    super({...props, color: '#11f'});
    this.weight = new Weight();
  }

  draw() {
    let ctx = getContext();
    ctx.fillStyle = '#11f'
    ctx.beginPath();
    ctx.moveTo(0, -200);
    ctx.lineTo(0, -175);
    ctx.lineTo(100, -250);
    ctx.lineTo(100, -280);
    ctx.fill();

    this.weight.draw();
  }
}

export class Weight extends SpriteClass {
  constructor(props) {
    super({...props, color: '#11f'});
  }

  draw() {
    let ctx = getContext();
    ctx.fillStyle = '#ff1';
    ctx.beginPath();
    ctx.moveTo(88, - 250);
    ctx.lineTo(88, -200);
    ctx.lineTo(90, -200);
    ctx.lineTo(90, -250);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.lineTo(80, -200);
    ctx.lineTo(80, -220);
    ctx.lineTo(100, -220);
    ctx.lineTo(100, -200);
    ctx.fill(); 
  }  
}

export class LargeArm extends SpriteClass {
  constructor(props) {
    super({...props});
    this.sling = new Sling();
  }

  draw() {
    let ctx = getContext();
    ctx.fillStyle = '#f11'
    ctx.beginPath();
    ctx.moveTo(0, -200);
    ctx.lineTo(0, -180);
    ctx.lineTo(-175, 20);
    ctx.lineTo(-175, 10);
    ctx.fill();

    this.sling.draw();
  }
}

export class Sling extends SpriteClass {
  constructor(props) {
    super({...props, color: '#111'});
  }

  draw() {
    let ctx = getContext();
    ctx.fillStyle = '#1f1'
    ctx.beginPath();
    ctx.moveTo(45, 0);
    ctx.lineTo(45, 5);
    ctx.lineTo(-175, 5);
    ctx.lineTo(-175, 0);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = '#0f0'
 
    ctx.arc(45,0, 15, 90, 180);
    ctx.fill();

  }

}
