import {
  SpriteClass,
  gamepadAxis,
  keyPressed,
  pointerPressed,
  getPointer,
  getContext
} from './kontra.mjs';
import { roundRect } from './utils.js';

let usingKeyboard;

export class Trebuchet extends SpriteClass {

  constructor(props) {
    super({...props, type: 0, width: 400, height: 50, color: '#fff' });

    // stage 1+ 2 parameters
    this.wQ = 0.0;    // angle between pole and weight
    this.sQ = 0.0;    // angle between long arm and sling
    this.Aq = 0.0;    // angle between long arm and pole 
  
    this.LA1 = 0.0;   // lenght of long arm
    this.LAs = 0.0;   // length of short arm
 
    this.LAcg = 0.0;  // length of long arm to center of gravity
    this.LW = 0.0;    // length of weight string
    this.h = 0.0;     // height of pol
    this.LS = 0.0;    // ground length (from long arm to pole)
  
    this.Grav = 0.0;  // Gravitational Acceleration
    this.mA = 0.0;    // Mass of Arm
    this.mW = 0.0;    // Mass of Weight
    this.mP = 0.0;    // Mass of Projectile
    this.IA3 = 0.0;   // Inertia of Arm
    this.IW3 = 0.0;   // Inertia of Weight

    this.Aw = 0.0;  
    this.Ww = 0.0;
    this.Sw = 0.0;
  
    // stage 3 parameters
    this.d = 0.0; // density of air
    this.WS = 0.0; // Wind speed
    this.Aeff = 0.0; // Effective Area of the Projectile
    this.mP = 0.0 ; // Mass of Projectile
    this.Cd = 0.0 ; // Drag Coefficient of Projectile

    this.position.clamp(0, 0, 0, 0);
    this.pole = new Pole({x: 0, y:0});


    // results
    // TODO: draw objects using in the correct positions using simulation results
    this.WeightCG = {
      x: 0,
      y: 0
    };

    this.WeightArmPoint = {
      x: 0,
      y: 0
    };

    this.ArmCG = {
      x: 0,
      y: 0
    };

    this.ArmSlingPoint = {
      x: 0,
      y: 0
    }

    this.Projectile = {
      x: 0,
      y: 0
    }

    this.smallArm = new SmallArm({x:0, y:0});
    this.largeArm = new LargeArm({x:0, y:0});
    this.sling = new Sling();
  }

  draw() {
    // TODO: discern which stage we are in
    // TODO: update placement and position of objecs from simulation result
    this.pole.draw();
    this.smallArm.draw();
    this.largeArm.draw();
    this.sling.draw();
  }

  stage1() {
/*
// https://virtualtrebuchet.com/documentation/explanation/EquationsOfMotion

let M11= -mP*LAl^2*(-1+2*SIN(Aq)*COS(Sq)/SIN(Aq+Sq)) + IA3 + IW3 + mA*LAcg^2 + mP*LAl^2*SIN(Aq)^2/SIN(Aq+Sq)^2 + mW*(LAs^2+LW^2+2*LAs*LW*COS(Wq))

let M12= IW3 + LW*mW*(LW+LAs*COS(Wq))

let M21= IW3 + LW*mW*(LW+LAs*COS(Wq))

let M22= IW3 + mW*LW^2

let r1= Grav*LAcg*mA*SIN(Aq) + LAl*LS*mP*(SIN(Sq)*(Aw+Sw)^2+COS(Sq)*(COS(Aq+Sq)*Sw*(Sw+2*Aw)/SIN(Aq+Sq)+(COS(Aq+Sq)/SIN(Aq+Sq)+LAl*COS(Aq)/(LS*SIN(Aq+Sq)))*Aw^2)) + LAl*mP*SIN(Aq)*(LAl*SIN(Sq)*Aw^2-LS*(COS(Aq+Sq)*Sw*(Sw+2*Aw)/SIN(Aq+Sq)+(COS(Aq+Sq)/SIN(Aq+Sq)+LAl*COS(Aq)/(LS*SIN(Aq+Sq)))*Aw^2))/SIN(Aq+Sq) - Grav*mW*(LAs*SIN(Aq)+LW*SIN(Aq+Wq)) - LAs*LW*mW*SIN(Wq)*(Aw^2-(Aw+Ww)^2)

let r2= -LW*mW*(Grav*SIN(Aq+Wq)+LAs*SIN(Wq)*Aw^2)

let Aw'= (r1*M22-r2*M12)/(M11*M22-M12*M21)

let Ww'= -(r1*M21-r2*M11)/(M11*M22-M12*M21)


let Aq'= Aw

let Wq'= Ww

let Sq'= Sw

let Aw'= (r1*M22-r2*M12)/(M11*M22-M12*M21)

let Ww'= -(r1*M21-r2*M11)/(M11*M22-M12*M21)

let Sw'= -COS(Aq+Sq)*Sq'*(Sq'+2*Aq')/SIN(Aq+Sq) - (COS(Aq+Sq)/SIN(Aq+Sq)+LAl*COS(Aq)/(LS*SIN(Aq+Sq)))*Aq'^2 - (LAl*SIN(Aq)+LS*SIN(Aq+Sq))*Aq''/(LS*SIN(Aq+Sq))

//https://virtualtrebuchet.com/documentation/explanation/AnglesToXY

this.WeightCG = {

X: LAs*SIN(Aq) + LW*SIN(Aq+Wq)
,
Y: -LAs*COS(Aq) - LW*COS(Aq+Wq)
  };

Weight/Arm Point:

X = LAs*SIN(Aq)

Y = -LAs*COS(Aq)

Arm CG:

X = -LAcg*SIN(Aq)

Y = LAcg*COS(Aq)

Arm/Sling Point:

X = -LAl*SIN(Aq)

Y = LAl*COS(Aq)

Projectile:

X = -LAl*SIN(Aq) - LS*SIN(Aq+Sq)

Y = LAl*COS(Aq) + LS*COS(Aq+Sq)

*/
  }

  stage2() {
  }

  stage3() {
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
  }

  draw() {
    roundRect(0, -this.height, this.width, this.height, 10, this.color);
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
    ctx.lineTo(60, -180);
    ctx.lineTo(60, -220);
    ctx.lineTo(120, -220);
    ctx.lineTo(120, -180);
    ctx.fill(); 
  }  
}
export class LargeArm extends SpriteClass {
  constructor(props) {
    super({...props});
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
