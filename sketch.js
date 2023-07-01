let inc = 0.9; // increment for perlin noise
let scl = 20; // scale for spacing the vectors
let cols, rows; // number of columns and rows
let zoff = 0; // z offset for perlin noise
let particles = []; // array to store particle objects

let flowfield;

class Particle {
  constructor() {
    this.pos = createVector(random(width), random(height)); // initialize particle position randomly
    this.vel = createVector(0, 0); // initialize particle velocity to zero
    this.acc = createVector(0, 0); // initialize particle acceleration to zero
    this.maxSpeed = 2; // set maximum particle speed
    this.prevPos = this.pos.copy(); // initialize previous position to current position
  }

  update() {
    this.vel.add(this.acc); // update velocity based on acceleration
    this.vel.limit(this.maxSpeed); // limit velocity to maximum speed
    this.pos.add(this.vel); // update position based on velocity
    this.acc.mult(0); // reset acceleration to zero
  }

  applyForce(force) {
    this.acc.add(force); // apply a force to the particle
  }

  follow(flowfield) {
    let x = floor(this.pos.x / scl); // calculate x index in flow field
    let y = floor(this.pos.y / scl); // calculate y index in flow field
    let index = x + y * cols; // calculate index of vector in flow field
    let force = flowfield[index]; // get vector from flow field
    this.applyForce(force); // apply vector as force to particle
  }

  show() {
    stroke(50, 255); // set stroke color to black with 50% opacity
    strokeWeight(3); // set stroke weight to 1 pixel
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y); // draw line from previous position to current position
    this.prevPos = this.pos.copy(); // update previous position to current position
  }

  edges() {
    if (this.pos.x > width) this.pos.x = 0; // wrap particle around if it goes off the right edge of the canvas
    if (this.pos.x < 0) this.pos.x = width; // wrap particle around if it goes off the left edge of the canvas
    if (this.pos.y > height) this.pos.y = 0; // wrap particle around if it goes off the bottom edge of the canvas
    if (this.pos.y < 0) this.pos.y = height; // wrap particle around if it goes off the top edge of the canvas
  }
}

function createFlowField(cols, rows, scl) {
  let flowfield = [];

  let noiseScale = 0.1; // set scale for noise values
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(x * noiseScale, y * noiseScale) * TWO_PI * 4; // generate noise value and map to angle between 0 and 2*PI*4
      let vector = p5.Vector.fromAngle(angle); // create vector from angle
      vector.setMag(1); // set magnitude of vector to 1
      flowfield[index] = vector; // store vector in flow field
    }
  }

  return flowfield;
}


function setup() {
  createCanvas(800, 800); // create canvas
  cols = floor(width / scl); // calculate number of columns
  rows = floor(height / scl); // calculate number of rows
  
   flowfield = createFlowField(cols, rows, scl);
  
  for (let i = 0; i < 2000; i++) {
    // create 1000 particles
    particles[i] = new Particle(); // create particle object
  }
}

function draw() {
  background(240); // set background color to white
  let yoff = 0; // initialize y offset for perlin noise
  for (let y = 0; y < rows; y++) {
    let xoff = 0; // initialize x offset for perlin noise
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols; // calculate index of vector
      let angle = noise(xoff, yoff, zoff) * TWO_PI; // calculate angle using perlin noise
      let v = p5.Vector.fromAngle(angle); // create vector from angle
      v.setMag(1); // set magnitude of vector to 1
      flowfield[index] = v; // set vector in flow field array
      xoff += inc; // increment x offset
      stroke(0, 50); // set stroke color to black with 50% opacity
      push(); // save current transformation matrix
      translate(x * scl, y * scl); // translate to current grid cell
      rotate(v.heading()); // rotate to vector heading
      line(0, 0, scl, 0); // draw line from origin to end of cell
      pop(); // restore previous transformation matrix
    }
    yoff += inc; // increment y offset
    zoff += 0.0003; // increment z offset
  }
  for (let i = 0; i < particles.length; i++) {
    particles[i].follow(flowfield); // update particle movement based on flow field
    particles[i].update(); // update particle position
    particles[i].edges(); // check if particle is outside canvas
    particles[i].show(); // draw particle
  }
}
