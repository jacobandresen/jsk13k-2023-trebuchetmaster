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

// original code from www.benchtophybrid.com
// - ported for kontra.js

export class Ball extends SpriteClass {

  constructor(props) {
    super({...props});
    this.x = 0;         
    this.y = 0;        
    this.xdot = 0;      
    this.ydot = 0;       
    this.radius = 0;      
  }

  draw() {
    const ctx = getContext();

    const scale = 1;
    ctx.translate(this.x,this.y);
    ctx.lineWidth = 2/scale;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000";
  
    ctx.beginPath();               
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2, true); 
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore(); 
  }
}

export class CounterWeight extends SpriteClass {
  constructor(props) {
    super({...props});
    this.x = 0;
    this.y = 0;
    this.H = 0;   
    
    this.pivot = new Ball({mass:0,color:"#AAAAAA"});
    this.pivot.x = 0;                    
    this.pivot.y = 0;

  }
 
  draw() {
    let ctx = getContext();
    let scale = 1;

    ctx.translate(this.x,this.y);
    ctx.lineWidth = 2/scale;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000";
      
    ctx.beginPath();            
    ctx.moveTo(-0.11*this.H, 0.09*this.H);
    ctx.lineTo( 0.11*this.H, 0.09*this.H);
    ctx.lineTo( 0.06*this.H,-0.05*this.H);
    ctx.lineTo(-0.06*this.H,-0.05*this.H);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    this.pivot.draw(scale);       
    ctx.restore(); 
  }

  update(H) {
    this.H = H;
    this.pivot.x = 0;
    this.pivot.y = 0;
    this.pivot.radius = 0.02*H;
  }
 
}

export class Sling extends SpriteClass {
  constructor(props) {
    super({...props});
    this.x = 0;      
    this.y = 0;    
    this.psi = 0;    
    this.psidot = 0;
  }

  draw (scale) {
    let ctx = getContext();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.psi);        
    ctx.strokeStyle = this.color;  
  
    ctx.lineWidth = 3/scale;          
    ctx.beginPath();
    ctx.moveTo(0,0);                
    ctx.lineTo(this.L,0);
    ctx.stroke();
    ctx.restore(); 
  }
}


export class Slot extends SpriteClass {
  constructor(props){
    super({props});
  }

  draw(scale) {
    let ctx = getContext();
    ctx.translate(this.x, this.y);  
    ctx.rotate(-this.angle);         
    ctx.lineWidth = 1/scale;
    ctx.strokeStyle = "#000000";
    
    ctx.beginPath();
    ctx.moveTo(     0,this.W/2);
    ctx.lineTo(this.L,this.W/2);                                 
    ctx.arc(this.L, 0, this.W/2, 0.5*Math.PI, 1.5*Math.PI, true); 
    ctx.lineTo(0,-this.W/2);                                      
    ctx.arc(     0, 0, this.W/2, 1.5*Math.PI, 0.5*Math.PI, true); 
    ctx.closePath();
    
    ctx.globalCompositeOperation = "destination-out"; 
    ctx.globalCompositeOperation = "source-over";     
    ctx.stroke();
    ctx.restore();
  }
}

export class GroundFlat extends SpriteClass  {
  constructor(props) {
    super({...props});
 
    this.x = 0;
    this.y = 0;
    this.h = 0;
    this.w = 0;
  }

  draw() {
    let ctx = getContext();
    let scale = 1;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.lineWidth = 2/scale;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000";
    
    ctx.beginPath(); 
    ctx.fillRect(-this.w/2,0,this.w,this.h);
    ctx.fill();
    ctx.moveTo(-this.w/2,0);
    ctx.lineTo( this.w/2,0);
    ctx.stroke();
    ctx.restore();
  }

  update (H) {
    this.w = H;
    this.h = 0.07*H;
  }
}

export class GroundRamp extends SpriteClass {
  constructor(props) {
    super({...props});
    this.x = 0;          
    this.y = 0;        
    this.H = 0;           
  }

  draw (scale) {
    let ctx = getContext();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.lineWidth = 2/scale; 
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000";  
    
    ctx.beginPath();    
    ctx.moveTo(0,0);
    ctx.lineTo(-1.0*this.H, -1.0*this.H*Math.tan(this.lambda));
    ctx.lineTo(-1.0*this.H,  0.1*this.H);
    ctx.lineTo( 0.2*this.H,  0.1*this.H);
    ctx.lineTo( 0.2*this.H,  0);
    ctx.closePath();
    ctx.fill();                
  
    ctx.beginPath();          
    ctx.moveTo(-1.0*this.H, -1.0*this.H*Math.tan(this.lambda));
    ctx.lineTo(0,0);
    ctx.lineTo(0.2*this.H,0);
    ctx.stroke();
    ctx.restore();
  }

  update(H) {
    this.H = H;
  }
}

export class ArmFixed extends SpriteClass{

  constructor(props){
    super({...props});
    this.x = 0;       
    this.y = 0;        
    
    this.pivot1 = new Ball({mass:0,color:"#AAAAAA"}); 
    this.pivot2 = new Ball({mass:0,color:"#AAAAAA"});  
    
    this.theta = 0;   
    this.thetadot = 0;
    this.theta0 = 0;  
    this.Lb = 0;   
    this.mb = 0;   
    this.Ib = 0;  
  }

  draw(scale) {
    let ctx = getContext();

    ctx.save();
    ctx.translate(this.x, this.y); 
    ctx.rotate(-this.theta);     
    
    ctx.lineWidth = 2/scale;     
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000"; 
          
    ctx.beginPath();         
    ctx.moveTo( this.L1 + 0.2*this.w, 0.2*this.w);
    ctx.lineTo( this.L1 + 0.2*this.w,-0.2*this.w);
    ctx.lineTo( 0.2*this.L1,-0.5*this.w);
    ctx.lineTo(-0.2*this.L2,-0.5*this.w);
    ctx.lineTo(-this.L2 - 0.2*this.w,-0.1*this.w);
    ctx.lineTo(-this.L2 - 0.2*this.w, 0.1*this.w);
    ctx.lineTo(-0.2*this.L2, 0.5*this.w);
    ctx.lineTo( 0.2*this.L1, 0.5*this.w);
    ctx.closePath();
    ctx.fill();             
    ctx.stroke();            
    
    this.pivot1.draw(scale);   
    this.pivot2.draw(scale); 
    ctx.restore();
  }

  mass(){
    let L1 = this.L1;
    let L2 = this.L2;
    let w  = this.w;
    let rhoT = this.rho * this.t;
    
    let b1 = 0.8*L1;
    let b2 = 0.2*L1; 
    let b3 = 0.1*L2; 
    let b4 = 0.9*L2;
    let h1 = 0.3*w; 
    let h2 = 0.4*w; 
    let h3 = 0.4*w; 
    let h4 = 0.2*w;
    
    let M1 = rhoT*h1*b1/2; 
    let M3 = rhoT*h3*b4/2; 
    let M5 = rhoT*h2*b1; 
    let M6 = rhoT*h4*b4; 
    let M7 = rhoT*w *b2;
    let M8 = rhoT*w *b3; 
    
    let x1 =  b2 + b1/3; 
    let x3 = -b3 - b4/3; 
    let x5 =  b2 + b1/2;
    let x6 = -b3 - b4/2; 
    let x7 =  b2/2;     
    let x8 = -b3/2;     
    
    let mb = 2*M1 + 2*M3 + M5 + M6 + M7 + M8;                        
    let Lb = (2*M1*x1 + 2*M3*x3 + M5*x5 + M6*x6 + M7*x7 + M8*x8)/mb;  
    let I1 = (M1/6)*(h1*h1 + b1*b1 + 4*b1*b2 + 6*b2*b2 + 2*h1*h2 + 1.5*h2*h2);  
    let I3 = (M3/6)*(h3*h3 + b4*b4 + 4*b3*b4 + 6*b3*b3 + 2*h3*h4 + 1.5*h4*h4);  
    let I5 = (M5/12)*(h2*h2 + 4*b1*b1 + 12*b2*b2 + 12*b1*b2);                   
    let I6 = (M6/12)*(h4*h4 + 4*b4*b4 + 12*b3*b3 + 12*b3*b4);                   
    let I7 = (M7/12)*(4*b2*b2 + w*w);                                           
    let I8 = (M8/12)*(4*b3*b3 + w*w);                                          
    
    let Ipivot = 2*I1 + 2*I3 + I5 + I6 + I7 + I8;  
    let Ib = Ipivot - mb * Lb * Lb;               
  
    this.Lb = Lb;   
    this.Ib = Ib;   
    this.mb = mb;
  }

  update(){
    this.pivot1.x =  this.L1;
    this.pivot2.x = -this.L2;
    this.pivot1.radius = 0.1*this.w;
    this.pivot2.radius = 0.1*this.w;
  }
}

export class ArmFloating extends SpriteClass {
  constructor(props) {
    super({...props});
    this.x = 0;    
    this.y = 0;      
    this.theta = 0;  
    this.thetadot = 0;  
    this.theta0 = 0;     
    
    this.slot = new Slot(); 
    this.pivot = new Ball({mass:0,color:"#AAAAAA"}); 
    this.pivot.x = -D;                        
    this.pivot.y = 0; 
  }

  draw (scale) {
    let ctx = getContext();
    ctx.save();
    ctx.translate(this.x,this.y);
    ctx.rotate(-this.theta);
  
    ctx.lineWidth = 2/scale;        
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000"; 
  
    ctx.beginPath();              
    ctx.rect(-this.L2,-this.w/2,this.L2+0.1*this.w,this.w);
    ctx.closePath();        
    ctx.fill();                     
    ctx.stroke();                
  
    this.slot.draw(scale);    
    this.pivot.draw(scale);
  
    ctx.restore(); 
  }

  update(){
    this.pivot.x = -this.D;
    this.pivot.y = 0;
    this.pivot.radius = 0.1*this.w;
    this.slot.L =  0.4*this.L2;
    this.slot.W =  0.2*this.w;
    this.slot.x = -0.9*this.L2; 
    this.slot.y = 0;
    this.slot.angle = 0;  
  }

  mass () {
    const L2  = this.L2;
    const w  = this.w;
    const mb = this.rho * this.t * w * L2;
    this.Ib = (mb/12)*(L2*L2 + w*w);
  }
}

export class BaseFixed extends SpriteClass {

  constructor(props) {
    super({...props});
    this.x = 0;    
    this.y = 0;  
    this.spring = 0.001; 
    this.pivot  = new Ball({m:0, color:"#AAAAAA"});  
  }

  draw(scale) {
    let ctx = getContext();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.lineWidth = 2/scale;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000";
    
    const h0 = this.h0; 
    const W1 = 0.15 * h0; 
    const W2 = 0.30 * h0;
    
    this.pivot.radius  = 0.05 * h0; 
    
    this.pivot.x  = this.x;         
    this.pivot.y  = this.y;       
  
    ctx.beginPath();
    ctx.moveTo( W1/2,-0.1*h0);
    ctx.lineTo(-W1/2,-0.1*h0);
    ctx.lineTo(-W2/2, h0);
    ctx.lineTo( W2/2, h0);
    ctx.closePath();
    ctx.fill(); 
    ctx.stroke();
    ctx.restore();
    
    this.pivot.draw(scale); 
  }

}

export class BaseCart extends SpriteClass {

  constructor(props) {
    super({...props});

    this.x = 0;     
    this.y = 0;     
    this.spring = 0.001;  
    this.pivot  = new Ball({mass: 0, color:"#AAAAAA"}); 
    this.wheel1 = new Ball(0, "#555555"); 
    this.wheel2 = new Ball(0, "#555555"); 
    
    this.xdot = 0;    
  }

  draw (scale) {
    let ctx  = getContext();

    ctx.save();

    ctx.translate(this.x, this.y);
    ctx.lineWidth = 2/scale;
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000";
    
    const h0 = this.h0; 
    const W1 = 0.15 * h0;
    const W2 = 0.30 * h0;
    const W3 = h0;
    const W4 = 0.60 * h0; 
    
    this.pivot.radius  = 0.03 * h0;
    this.wheel1.radius = 0.10 * h0; 
    this.wheel2.radius = 0.10 * h0; 
    
    this.wheel1.x = -0.8 * W3; 
    this.wheel1.y =  h0 + W1; 
    this.wheel2.x =  0.4 * W3;
    this.wheel2.y =  h0 + W1;  
  
    ctx.beginPath(); 
    ctx.moveTo( W1/2,-0.1*h0);
    ctx.lineTo(-W1/2,-0.1*h0);
    ctx.lineTo(-W2/2, h0);
    ctx.lineTo(-W3, h0);
    ctx.lineTo(-W3, h0+W1);
    ctx.lineTo( W4, h0+W1);
    ctx.lineTo( W4, h0);
    ctx.lineTo( W2/2, h0);
    ctx.closePath();
    ctx.fill();    
    ctx.stroke();               
  
    this.pivot.draw(scale);  
    this.wheel1.draw(scale);
    this.wheel2.draw(scale);        
    ctx.restore();
  }
}

export class BaseFloating extends SpriteClass {
  constructor(props) {
    super({...props});
    this.x  = 0;
    this.y  = 0; 
 
    this.slotV = new Slot();
    this.slotH = new Slot();       
    this.pivot = new Ball({mass:0,color:"#AAAAAA"}); 
    this.pivot.x = - this.W;
    this.pivot.y = - this.H;
  }

  draw(scale) {
    let ctx = getContext();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.lineWidth = 2/scale;   
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "#000000";
   
    ctx.beginPath();  
    ctx.moveTo(         0.1*this.h0,                    0);
    ctx.lineTo(         0.1*this.h0,        -1.05*this.h0);
    ctx.lineTo(        -0.1*this.h0,        -1.05*this.h0);
    ctx.lineTo(        -0.1*this.h0, -this.H-0.05*this.h0);
    ctx.lineTo(-this.W-0.05*this.h0, -this.H-0.05*this.h0);
    ctx.lineTo(-this.W-0.05*this.h0, -this.H+0.05*this.h0);
    ctx.lineTo(        -0.1*this.h0, -this.H+0.05*this.h0);
    ctx.lineTo(        -0.1*this.h0, -0.1*this.h0*Math.tan(this.lambda));
    ctx.lineTo(-this.W-0.10*this.h0, -(this.W+0.1*this.h0)*Math.tan(this.lambda));
    ctx.lineTo(-this.W-0.10*this.h0,         0.15*this.h0);
    ctx.lineTo(          0.5*this.W,         0.15*this.h0);
    ctx.lineTo(          0.5*this.W,                    0);
    ctx.closePath();
    ctx.fill();    
    ctx.stroke();  
  
    this.slotV.draw(scale);
    this.slotH.draw(scale); 
    this.pivot.draw(scale);
    
    ctx.restore();

  }

  update () {
    this.x = 0; 
    this.y = 0;  
    this.slotV.L =  0.90*this.h0;
    this.slotV.W =  0.05*this.h0;
    this.slotV.x =  0;
    this.slotV.y = -0.05*this.h0;
    this.slotV.angle = Math.PI/2;
    this.slotH.L =  0.70*this.W;
    this.slotH.W =  0.05*this.h0;
    this.slotH.x = -0.85*this.W;
    this.slotH.y = -this.H;
    this.slotH.angle = 0;
    this.pivot.x = -this.W;
    this.pivot.y = -this.H;
    this.pivot.radius = 0.02*this.W;
    
  }
}


export class Trebuchet extends SpriteClass {

  constructor(props) {

    super({...props});
    this.cwt     = new CounterWeight({mass:this.m1, color:"#DDDDDD"});                     
    this.proj    = new Ball({mass:this.m2, color:"#E93A90"});                             
    this.arm     = new ArmFixed({L1: this.L1, L2: this.L2, 
        w: this.w, t: this.t, rho: this.rho, beta: this.beta, color:"#AFF53D"});   
    this.base    = new BaseFixed({h0: this.h0, color:"#9CA400"});                        
    this.ground  = new GroundFlat({color:"#A93CD4"});                           
   
    this.g = 9.81;     
    this.I = 0;       
    this.deltaT = 0.001;
  }

  mass() {
    this.arm.mass();
    const L1 = this.arm.L1;
    const L2 = this.arm.L2;
    const Lb = this.arm.Lb;
  
    this.I = this.cwt.mass*L1*L1 + this.proj.mass*L2*L2 + this.arm.Ib + this.arm.mb*Lb*Lb;
    this.m = this.cwt.mass*L1 - this.proj.mass*L2 - this.arm.mb*Lb;
  }

  draw() {
  
    this.cwt.x  =  this.arm.L1*Math.cos(-this.arm.theta);
    this.cwt.y  =  this.arm.L1*Math.sin(-this.arm.theta);
    this.proj.x = -this.arm.L2*Math.cos(-this.arm.theta);
    this.proj.y = -this.arm.L2*Math.sin(-this.arm.theta);
  
    this.arm.draw(this.scale);
    this.cwt.draw(this.scale); 
    this.proj.draw(this.scale);  
  }

  update() {

    // TODO: grab treb_can2 , treb_tx1, treb_ctx dimensions
    this.scale = 0.8*treb_can2.height/(this.arm.L2 + this.base.h0); 
    this.x0 = treb_can2.width/2; 
    this.y0 = treb_can2.height - 120;
  
    this.ground.y = this.base.h0;
    this.arm.update();                
    this.cwt.update(this.arm.L2); 
    this.ground.update(this.arm.L2); 
    this.proj.radius = 0.5*this.arm.w;
  
    if (this.base.h0 >= this.arm.L2) {
      this.arm.theta = -89*Math.PI/180;
    } else {
      this.arm.theta = Math.asin(this.base.h0/this.arm.L2);
    }
    this.arm.theta0 = this.arm.theta;   
    this.arm.thetadot = 0;
  
    treb_ctx1.save();
    treb_ctx1.translate(this.x0,this.y0);  
    treb_ctx1.scale(this.scale,this.scale);
    this.ground.draw(treb_ctx1,this.scale); 
    treb_ctx1.restore();                    
    
    treb_ctx3.save();
    treb_ctx3.translate(this.x0,this.y0);   
    treb_ctx3.scale(this.scale,this.scale);
    this.base.draw(treb_ctx3,this.scale);  
    treb_ctx3.restore();                   
  }
};

