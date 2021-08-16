let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

//  Width and Height
let width = ctx.canvas.width = window.innerWidth;
let height = ctx.canvas.height = window.innerHeight;

window.onresize = () => {
  width = ctx.canvas.width = window.innerWidth;
  height = ctx.canvas.height = window.innerHeight;
}

let particles = [];
let radius = 5;
let eating = false;

canvas.addEventListener("mousemove", e => mouse(e));

let mouseObj = {
  x: width/2,
  y: height/2,
}

function mouse(e) {
  if (particleData.mouse) {
    mouseObj.x = e.clientX;
    mouseObj.y = e.clientY;
  }
}


const particleData = {
  speed: 7,
  sight: 60,
  windX: 0,
  windY: 0,
  mouse: false,
  cohesion: true,
  alignment: true,
  separation: true,
  connect: false,
  shape: false,
  color: false,
}

gui.add(particleData, "windX", -10, 10);
gui.add(particleData, "windY", -10, 10);
gui.add(particleData, "speed", 0, 15).onChange(initChange);
gui.add(particleData, "mouse", false, true);
gui.add(particleData, "sight", 0, 200, 1);
gui.add(particleData, "cohesion");
gui.add(particleData, "alignment");
gui.add(particleData, "separation");
gui.add(particleData, "connect");
gui.add(particleData, "shape").onChange(initChange);
gui.add(particleData, "color").onChange(initChange);

let max = 40;

function initChange() {
  particles = init();
}

function init() {
  const arr = [];
  for (let i = 0; i < max; i++) {
    let p = new Particle(Math.random() * (width + radius),
                        Math.random() * (height + radius),
                        Math.random() * 10 - 5,
                        Math.random() * 10 - 5,
                        radius + Math.random() * 2, particleData.shape, 300, particleData.color);
    p.createParticle(ctx);
    arr.push(p);
  }
  return arr;
}

particles = init();

function draw() {
 
  for (let i = 0; i < particles.length; i++) {
    particles[i].createParticle(ctx);    
  }
  if (particleData.connect) {
    connect();
  }
}

let deathCount = 0;

function move() {
  for (let i = 0; i < particles.length; i++) {
    if (particleData.alignment) align(particles[i]);
    if (particleData.cohesion) cohesion(particles[i]);
    if (particleData.separation) separate(particles[i]);
    if (particleData.mouse) {
      mouseFollow(particles[i], mouseObj);
    }
    if (particleData.predator) {
      predator(particles[i], mouseObj);
    }
    wind(particles[i]);
    edge(particles[i]);
    dampener(particles[i]);
  
    particles[i].x += particles[i].xvel;
    particles[i].y += particles[i].yvel;
    if (particles[i].birthTimer >= 500 && particles.length < 300 && particles[i].killTimer <= 300 ) {
      giveBirth(particles[i]);
    }
    if (particles[i].killTimer <= 0) {
      deathCount++;
      particles.splice(i, 1);
    }
  }
}

function giveBirth(particle) {
  // Boid gives birth :) beautiful
  let randInt = flipACoin();
  particle.birthTimer = 0;
  // If true, give birth
  if (randInt == 1) {
    let p = new Particle(Math.random() * (particle.x + radius),
                        Math.random() * (particle.y + radius),
                        Math.random() * 10 - 2,
                        Math.random() * 10 - 2,
                        radius, particleData.shape, 350, particleData.color);
    particles.push(p);
  }
}

function flipACoin() {
  return Math.round(Math.random());
}

function dampener(particle) {
  let speed = Math.sqrt(Math.pow(particle.xvel, 2) + Math.pow(particle.yvel, 2));
  
  if (speed > particleData.speed) {
    particle.xvel = (particle.xvel / speed) * particleData.speed;
    particle.yvel = (particle.yvel / speed) * particleData.speed;
  }
}

function edge(particle) {
  let buffer = 100;
  let turn = 1;
  if (particle.x > width - buffer) {
    particle.xvel += -turn;
  }
  if (particle.x < buffer) {
    particle.xvel += turn;
  }
  if (particle.y > height - buffer) {
    particle.yvel += -turn;
  }
  if (particle.y < buffer) {
    particle.yvel += turn;
  }
}

// Rule 1: Cohesion
function cohesion(particle) {
  // Bring all particles in neighborhood together to percieved center;
  let centerX = 0;
  let centerY = 0;
  let factor = 100;
  let total = 0;
  let totalArray = [];
  for (let i = 0; i < particles.length; i++) {
    let distance = dist(particle, particles[i]);
    if (particles[i] !== particle && distance < particleData.sight) {
      centerX += particles[i].x;
      centerY += particles[i].y;
      total++;
      totalArray.push(particles[i]);
    }
  }
  particle.group = totalArray;
  if (total > 0) {
  centerX /= total;
  centerY /= total;
  particle.xvel += (centerX - particle.x) / factor;
  particle.yvel += (centerY - particle.y) / factor;
  } if (total < 1) {
    particle.birthTimer = 0;
    particle.killTimer--;
    particle.createParticle(ctx);
  } if (total > 2) {
    particle.birthTimer++;
  }
}

// Rule 2: Align
function align(particle) {
  // Align all particles together based on percieved position
  let Xvel = 0;
  let Yvel = 0;
  let total = 0;
  for (let i = 0; i < particles.length; i++) {
    let distance = dist(particle, particles[i]);
    if (particles[i] != particle && distance < particleData.sight) {
      Xvel += particles[i].xvel;
      Yvel += particles[i].yvel;
      total++;
    }
  }
  if (total > 0) {
    Xvel /= total;
    Yvel /= total;
    particle.xvel += ((Xvel - particle.xvel) * 0.05);
    particle.yvel += ((Yvel - particle.yvel) * 0.05);
  }
}

// Rule 3: Separate
function separate(particle) {
  let min = 50;
  let x = 0;
  let y = 0;
  let factor = 100;
  for (let i = 0; i < particles.length; i++) {
    let distance = dist(particle, particles[i]);
    if (particles[i] !== particle && distance < min) {
      x += (particle.x - particles[i].x);
      y += (particle.y - particles[i].y);
    }
  }
  x /= factor;
  y /= factor;
  particle.xvel += x;
  particle.yvel += y;
}

// Extras:

// Visual connections
const connect = () => {
  for (let i = 0; i < particles.length; i++) {
    let p1 = particles[i];
    for (let j =  i + 1; j < particles.length; j++) {
      let p2 = particles[j];
      let currentDist = dist(p1, p2);

      if (currentDist <= particleData.sight) {
        let percent = 5/4;
        let opacity = 1.25 - currentDist * percent / particleData.sight;

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        if (particleData.color) {
          ctx.strokeStyle = `rgba(${p1.x - 100},${p1.y - 100}, 150, ${opacity})`;
        } else {
          ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`
        }
        ctx.lineWidth = 2;
        ctx.lineTo(p2.x, p2.y, p1.x, p1.y);
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}

// Wind
function wind(particle) {
  let factor = 100;
  particle.xvel += particleData.windX / factor;
  particle.yvel += particleData.windY / factor;
}

// Tendency Towards place
function prefer(particle, obj) {
  let objX = obj.x;
  let objY = obj.y;
  let factor = obj.factor;
  let min = 20;
  let distance = dist(particle, {x: objX, y: objY});
  if (distance < min) {
    eating = !eating;
    obj.eat = true;
    particle.xvel -= (objX - particle.x) + 10;
    particle.yvel -= (objY - particle.y) + 10;
  } else {
    particle.xvel += (objX - particle.x) / factor;
    particle.yvel += (objY - particle.y) / factor;
  }
}

// Tendecy but only for mouse
function mouseFollow(particle, obj) {
  let objX = obj.x;
  let objY = obj.y;
  let factor = 100;
  let min = 80;
  let distance = dist(particle, {x: objX, y: objY});
  if (distance < min) {
    particle.xvel -= ((objX - particle.x) + 10) / factor;
    particle.yvel -= ((objY - particle.y) + 10) / factor;
  } else {
    particle.xvel += (objX - particle.x) / factor;
    particle.yvel += (objY - particle.y) / factor;
  }
}

function dist(a, b) {
  return Math.sqrt(Math.pow((a.x - b.x), 2) + Math.pow((a.y - b.y), 2));
}

function displayInfo() {
  let life = document.getElementById("life");
  let death = document.getElementById("death");

  life.innerHTML = ` ${particles.length}`;
  death.innerHTML = ` ${deathCount}`;
}

function animate() {
  ctx.clearRect(0, 0, width, height);
  move();
  draw();
  displayInfo();
  requestAnimationFrame(animate);
}

animate();