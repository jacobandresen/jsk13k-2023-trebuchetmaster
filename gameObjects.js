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

export class Trebuchet extends SpriteClass {

  constructor(props) {
    super({...props});
    this.cwt     = new CounterWeight({mass:this.m1, color:"#DDDDDD"});                     
    this.proj    = new Ball({mass:this.m2, color:"#E93A90"});                             
    this.arm     = new ArmFixed({L1: this.L1, L2: this.L2, w: this.w, t: this.t, rho: this.rho, beta: this.beta, color:"#AFF53D"});   
    this.base    = new BaseFixed({h0: this.h0, color:"#9CA400"});                        
    this.ground  = new GroundFlat({color:"#A93CD4"});                           
   
    this.g = 9.81;     
    this.I = 0;       
    this.deltaT = 0.001;

    this.Results = {
      sx0: 0, 
      sy0: 0, 
      vx0: 0,
      vy0: 0,
      v0:  0,
      alpha: 0, 
      tMax: 0,
      xMin: 0,
      xMax: 0,
      yMin: 0,
      yMax: 0,
      range: 0,  
      effE: 0,
      effR: 0
    };
  }

  render() {

    this.cwt.x  =  this.arm.L1*Math.cos(-this.arm.theta);
    this.cwt.y  =  this.arm.L1*Math.sin(-this.arm.theta);
    this.proj.x = -this.arm.L2*Math.cos(-this.arm.theta);
    this.proj.y = -this.arm.L2*Math.sin(-this.arm.theta);
  
    this.arm.render();
    this.cwt.render(); 
    this.proj.render();  
  }

  mass() {
    this.arm.mass();
    const L1 = this.arm.L1;
    const L2 = this.arm.L2;
    const Lb = this.arm.Lb;
  
    this.I = this.cwt.mass*L1*L1 + this.proj.mass*L2*L2 + this.arm.Ib + this.arm.mb*Lb*Lb;
    this.m = this.cwt.mass*L1 - this.proj.mass*L2 - this.arm.mb*Lb;
  }

  update() { 
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
  
    this.ground.render(); 
    this.base.render();  
  }

  launch() {
    const L1  = this.arm.L1;            
    const g   = this.g                 
    const h0  = this.base.h0;           
    const m1  = this.cwt.mass;          
    const m2  = this.proj.mass;         

    const theta0    = this.arm.theta;    
    const thetadot0 = this.arm.thetadot;
  
    const H1 = L1*(1 + Math.sin(this.arm.theta0));           
    const H2 = h0 - L2*Math.sin(theta0);                     
    const Hstar = h0 + L2;                                  
   
    const vx0   =  L2 * thetadot0*Math.sin(theta0);                              
    const vy0   = -L2 * thetadot0*Math.cos(theta0);                               
    const v02   =  vx0*vx0 + vy0*vy0;                                             
    const tMax  = (vy0/g)+Math.sqrt((vy0*vy0)/(g*g) + 2*H2/g);                   

    const PE = (m1*H1 - m2*H2)*g;  
    const KE = 0.5*m2*v02;        

    const R      = Math.abs(vx0) * tMax;
    const R0star = 2*PE/(m2*g);
    const Rstar  = R0star*Math.sqrt(2*H2/R0star + 1); 
    const RHstar = R0star*Math.sqrt(2*Hstar/R0star + 1); 

    this.results.effE = KE/PE; 
    this.results.effR = R/Rstar;
    this.results.effH = R/RHstar; 
  
    this.results.H2   = H2;
    this.results.vx0  = vx0;
    this.results.vy0  = vy0;
    this.results.tMax = tMax;
    this.results.R    = R;

//    this.plotProjectile();
  }

  plotProjectile() {

    let ctx = getContext();
    const H2    = this.results.H2;
    const vx0   = this.results.vx0;
    const vy0   = this.results.vy0;
    const tMax  = this.results.tMax;

    const g = this.g;                       
    const deltaT = tMax / 100;             
    const projectile  = new Ball({mass:0, color:"#D72D80"});   
    projectile.radius = 10;    
    let xMin = 0;
    let xMax = vx0 * tMax;
    if (vx0 <= 0) {
      xMin = vx0 * tMax;
      xMax = 0;
    }
    
    let yMin = 0;
    let yMax = (vy0*vy0)/(2*g) + H2;
  
    if (vy0 <= 0) {
      yMax = H2; 
    } 
        
    if (vx0 > 0) {
      let x0 = 0;
    } else {
      let x0 = ctx.width; 
    }
    let y0 = ctx.height; 
      
    
    if (ctx.height/(yMax - yMin) < ctx.width/(xMax - xMin)) { 
      let scale = ctx.height/(yMax - yMin);
    } else {
      let scale = ctx.width/(xMax - xMin);
    }

    let t = 0;  
    let me = this;
    function drawFrame () {      
      t += deltaT;

      projectile.x = scale * (vx0 * t) + x0;
      projectile.y = scale * (0.5*g*t*t - vy0*t - H2) + y0;
      projectile.radius = 5;
      projectile.draw(scale);            
      
      if (t < tMax - 0.9*deltaT) { 
        ctx.beginPath();
        ctx.arc(this.projectile.x + 80, this.projectile.y + 20, 2, 0, Math.PI * 2, true);
        ctx.fillStyle = "#B7F15B";
        ctx.fill();
      } else {
        clearInterval(handle);
      }
    }
    let handle = setInterval(drawFrame, 2000*deltaT/tMax);
 
  }
};

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
 
  render() {
    let ctx = getContext();

    ctx.translate(this.x,this.y);
    ctx.lineWidth = 2;
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
    this.pivot.render();       
    ctx.restore(); 
  }

  update(H) {
    this.H = H;
    this.pivot.x = 0;
    this.pivot.y = 0;
    this.pivot.radius = 0.02*H;
  }
}

export class Ball extends SpriteClass {

  constructor(props) {
    super({...props});
    this.x = 0;         
    this.y = 0;        
    this.xdot = 0;      
    this.ydot = 0;       
    this.radius = 0;      
  }

  render() {
    const ctx = getContext();

    ctx.translate(this.x,this.y);
    ctx.lineWidth = 2;
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

export class Sling extends SpriteClass {
  constructor(props) {
    super({...props});
    this.x = 0;      
    this.y = 0;    
    this.psi = 0;    
    this.psidot = 0;
  }

  render () {
    let ctx = getContext();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(-this.psi);        
    ctx.strokeStyle = this.color;  
  
    ctx.lineWidth = 3;          
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

  render() {
    let ctx = getContext();
    ctx.translate(this.x, this.y);  
    ctx.rotate(-this.angle);         
    ctx.lineWidth = 1;
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

  render() {
    let ctx = getContext();
   
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.lineWidth = 2;
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

  render() {
    let ctx = getContext();

    ctx.save();
    ctx.translate(this.x, this.y); 
    ctx.rotate(-this.theta);     
    
    ctx.lineWidth = 2;     
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
    
    this.pivot1.render();   
    this.pivot2.render(); 
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

export class BaseFixed extends SpriteClass {

  constructor(props) {
    super({...props});
    this.x = 0;    
    this.y = 0;  
    this.spring = 0.001; 
    this.pivot  = new Ball({m:0, color:"#AAAAAA"});  
  }

  render() {
    let ctx = getContext();
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.lineWidth = 2;
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
    this.pivot.render(); 
  }
}

export class BaseCart extends SpriteClass {

  constructor(props) {
    super({...props});

    this.x = 0;     
    this.y = 0;     
    this.spring = 0.001;  
    this.pivot  = new Ball({mass:0, color:"#AAAAAA"}); 
    this.wheel1 = new Ball({mass:0, color:"#555555"}); 
    this.wheel2 = new Ball({mass:0, color:"#555555"}); 
    
    this.xdot = 0;    
  }

  render () {
    let ctx  = getContext();

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.lineWidth = 2;
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
  
    this.pivot.render();  
    this.wheel1.render();
    this.wheel2.render();        
    ctx.restore();
  }
}
