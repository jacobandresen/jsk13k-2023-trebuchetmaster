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

this.M11= -this.mP*(this.LAl**)2*(-1+2*math.sin(this.Aq)*math.cos(this.Sq)/math.sin(this.Aq+this.Sq))
    + this.IA3 + this.IW3 + this.mA*(LAcg**2)
    + this.mP*(this.LAl**2) * (math.sin(this.Aq)**2)/math.sin(this.Aq+this.Sq)^2
    + this.mW*(this.LAs**2)
    + this.LW**2
    + 2 * this.LAs * this.LW * math.cos(this.Wq)
    )

this.M12= this.IW3 + this.LW * this.mW * (this.LW +this.LAs*math.cos(Wq))

this.M21= this.IW3 + this.LW * mW * (this.LW + this.LAs * math.cos(Wq))

this.M22= this.IW3 + this.mW*this.LW**2

this.r1= this.Grav * this.LAcg * this.mA * math.sin(Aq)
     + this.LAl * this.LS * this.mP * (math.sin(Sq)*(this.Aw + this.Sw)**2
      + math.cos(this.Sq)*(math.cos(this.Aq + this.Sq) * this.Sw*(this.Sw + 2*this.Aw)
       /math.sin(this.Aq + this.Sq) + (this.COS(this.Aq + this.Sq)/math.sin(this.Aq + this.Sq)
      +this.LAl*math.cos(this.Aq)/(this.LS*math.sin(this.Aq+this.Sq)))*this.Aw**2))
      + this.LAl*this.mP*math.sin(this.Aq)*(this.LAl*math.sin(this.Sq)*this.Aw**2
      - this.LS*(math.COS(this.Aq+this.Sq)*this.Sw*(this.Sw+2*this.Aw)/math.sin(this.Aq+this.Sq)
      +(math.cos(this.Aq+this.Sq)/math.sin(this.Aq+this.Sq)
      + this.LAl*math.COS(this.Aq)/(this.LS*mat.sin(this.Aq+this.Sq)))*this.Aw**2))
      /math.sin(this.Aq+this.Sq) - this.Grav*this.mW*(this.LAs*math.sin(this.Aq)
      +this.LW*math.sin(this.Aq+thisWq))
      - this.LAs*this.LW*this.mW*math.sin(this.Wq)*(this.Aw**2-(this.Aw+this.Ww)**2);

this.r2= -this.LW*this.mW*(this.Grav*math.sin(this.Aq+this.Wq)+this.LAs*maht.sin(this.Wq)*this.Aw**2);

this.Aw'= (this.r1*this.M22-this.r2*this.M12)/(this.M11*this.M22-this.M12*this.M21);

this.Ww'= -(this.r1*this.M21-this.r2*this.M11)/(this.M11*this.M22-this.M12*this.M21);


this.Aq'= Aw;

this.Wq'= Ww;

this.Sq'= Sw;

this.Aw'= (this.r1*this.M22-this.r2*this.M12)/(this.M11*this.M22-this.M12*this.M21);

this.Ww'= -(this.r1*this.M21-this.r2*this.M11)/(this.M11*this.M22-this.M12*this.M21);

this.Sw'= -math.cos(this.Aq+this.Sq)*this.Sq'*(this.Sq'+2*this.Aq')/math.sin(tihs.Aq+thisSq)
  - (math.cos(this.Aq+this.Sq)/ math.sin(this.Aq+this.Sq)
    +this.LAl*math.cos(this.Aq)/(this.LS*math.sin(this.Aq+this.Sq)))*this.Aq'**2
    - (this.LAl*math.sin(this.Aq)+this.LS*math.sin(this.Aq+this.Sq))*this.Aq''
    /(this.LS*math.sin(this.Aq+this.Sq));

//https://virtualtrebuchet.com/documentation/explanation/AnglesToXY

this.WeightCG = {
  X: this.LAs*math.SIN(this.Aq) + this.LW*math.SIN(this.Aq + this.Wq)  ,
  Y: -this.LAs*math.COS(this.Aq) - this.LW*math.COS(this.Aq + this.Wq)
  };

this.WeightArmPoint = {
  X:  this.LAs*math.sin(Aq),  
  Y: -this.LAs*math.cos(Aq)
};

this.ArmCG = {
  X: -this.LAcg*math.sin(Aq),
  Y: this.LAcg*math.cos(Aq)
};


this.ArmSlingPoint = {
   X: -this.LAl*math.sin(this.Aq),
   Y: = this.LAl*math.cos(this.Aq)
};

this.Projectile = {
   X: -this.LAl*math.SIN(this.Aq) - this.LS*math.sin(this.Aq+this.Sq),
   Y: this.LAl*math.COS(this.Aq) + this.LS*math.cosS(this.Aq+this.Sq)
}

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
