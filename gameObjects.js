import { zzfx } from './ZzFX.js'
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
    let canvas = getCanvas();
    let width = 231;
    let height = 53;

    // Trebuchet dimensions
    // Arm Lengths
    // Length of Sling
    // Length of Weight
    // Height of Pivot
  
    // Release Angle ?

    // Constructive solid geometry: ( Spriteclass / Canvas )
    // - long arm  : let largeArm = new Arm({x: this.x, y: this.y, length: 100});
    // - short arm  : let smallArm = new Arm({x: this.x, y: this.y, length: 20});
    // - pivot / pole
    // - weight
    // - sling
    // - projectile
  

    // Trajectory equations ( in trebuchet update method )
    // - Runge kutta

    super({
      ...props,
      type: 0,
      width,
      height,
      color: '#fff',
      anchor: { x: 0.5, y: 0.5 }
    });

    this.position.clamp(width / 2, 0, canvas.width - width / 2, canvas.height);
  }

  draw() {

    // Animations ( in trebuchet draw method )
    // - Start
    // - Transition 1
    // - Transition 2

    let { width, height, color } = this;
    roundRect(0, 0, width, height, 10, color);
  }

  update() {
  
    // Joints: (connect models in trebuchet class)
    // - attach weight to small arm
    // - attach sling to long arm (the sling should be nearly as long as  the long arm)
    // - attach projectile to sling

    // TODO: left-right = control string 
    // TODO: up-down = control lever

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

  // Uniform Arm ?
  // Mass of Arm
  // Inertia of Arm
  // Pivot to Arm CG: https://virtualtrebuchet.com/documentation/inputs/arm/PivotToArmCG

  constructor(props) {
    let canvas = getCanvas();
    let length = 10;
    let mass = 100;
    super({
      ...props,
      type: 0,
      width,
      height,
      length,
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
  // Mass of Weight
  // Inertia of Weight
 
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

/*
export class Ball extends SpriteClass {
  constructor(props) {
    super({
      ...props,
      dy: 15,
      anchor: { x: 0.5, y: 0.5 },
      radius: 30
    });
  }

  draw() {
    let { context, radius } = this;
    context.fillStyle = '#fff';
    context.beginPath();
    context.arc(0, 0, radius, 0, 2 * Math.PI);
    context.fill();
  }
}*/