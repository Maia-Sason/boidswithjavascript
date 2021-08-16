class Particle {
  constructor(x, y, xvel, yvel, radius, shape, killTimer, color) {
    this.x = x;
    this.y = y;
    this.xvel = xvel;
    this.yvel = yvel;
    this.radius = radius;
    this.sight = 20;
    this.center = 0;
    this.shape = shape;
    this.killTimer = killTimer;
    this.birthTimer = 0;
    this.pulse = 0;
    this.color = color;
  }

  createParticle(ctx) {
    if (this.shape) {
      this.pulse++;
      // Transformation rotation
      const angle = Math.atan2(this.yvel, this.xvel);
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);
      ctx.translate(-this.x, -this.y);



      // Shadow for boids
      let innerRadius = 5;
      let outerRadius = 70;
      let radius = 60;

      var gradient = ctx.createRadialGradient(this.x - 10, this.y, innerRadius, this.x - 10, this.y, outerRadius);
      if (this.color) {
      gradient.addColorStop(0, 'rgba(255, 255, 255, .3)');
      gradient.addColorStop(.07, `rgba(${this.x - 100},${this.y - 100}, 150, .1)`);
      gradient.addColorStop(.2, 'rgba(255, 255, 255, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 255, 255, .3)');
        gradient.addColorStop(.07, `rgba(255, 255, 255, .1)`);
        gradient.addColorStop(.2, 'rgba(255, 255, 255, 0)');
      }
      ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);

      ctx.fillStyle = gradient;
      ctx.fill();
  
      ctx.beginPath();
      if (this.killTimer <= 300) {
      ctx.lineTo(this.x - 15, this.y + 5);
      ctx.lineTo(this.x - 15, this.y - 5);
      ctx.lineTo(this.x, this.y);
      } else {
        ctx.lineTo(this.x - 12, this.y + 2);
      ctx.lineTo(this.x - 12, this.y - 2);
      ctx.lineTo(this.x, this.y);
      }
      if (this.color) {
        if (this.killTimer < 50) {
          ctx.fillStyle = `rgba(${(this.y + this.x) / 2 - 100}, 200, ${(this.y + this.x) / 2}, ${50/300})`;
        } else if (this.killTimer <= 300) {
          ctx.fillStyle = `rgb(${this.x - 100}, ${this.y - 100}, 150)`;
        } else {
          ctx.fillStyle = `rgb(${this.x - 50}, ${this.y - 50}, 250)`;
        }
      } else {
        if (this.killTimer < 50) {
          ctx.fillStyle = "red";
        } else if (this.killTimer <= 300) {
          ctx.fillStyle = "white";
        } else {
          ctx.fillStyle = "blue";
        }
      }
      ctx.fill();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.closePath();
    } else {
      ctx.beginPath();
      
      if (this.killTimer <= 300) {
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      } else {
        ctx.arc(this.x, this.y, this.radius / 2, 0, Math.PI * 2);
      }
      if (this.color) {
        ctx.fillStyle = `rgb(${this.x - 100}, ${this.y - 100}, 150)`;
      } else {
        ctx.fillStyle = "white";
      }
      ctx.fill();
      ctx.closePath();
    }
  }
}

