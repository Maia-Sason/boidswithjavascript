# Boids!
I really wanted to try out making some boids. Birds are fascinating, and the behavior of a bird flock is even more so! The ability for programmers to develop complex organisms with a few rules and control those rules is probably one of the coolest things about giving a computer instructions.
/
### Three cardinal rules:

1. All particles must be drawn to neighbors in their neighborhood.
2. Particles should keep a distance from each other.
3. Particles should try to align to the average direction of all their neighbors.

## Behavior:

These boid particles will follow the 3 rules. They also have some additional rules for life.

Each boid has a set time it can live for, after a certain time of being away from a group it will turn red (if `color` mode is off) and die.

After a boid becomes an adult (indicated by the color white if `color` mode is off and `shape` is on), and after a certain time in a group of boids, a boid particle has a 50% chance of reproducing. A small (blue if `color` mode is turned off and `shape` is on) boid will appear on screen. That boid will grow quickly on its own.

## Modes:

Gui is implemented using `Dat.GUI`.

options are as follows:
* text: (default true), when unchecked, will hide hero text
* windX: (default is 0, no wind), when increased/decreased will push boids left or right
* windY: (default is 0, no wind), when increased/decreased will push boids up or down
* speed: (default is 7), speeds up or slows down boids (also great for resetting boids if they all died)
* mouse: (default false), when checked, boids will follow mouse
* sight: (default 60), changes sight range of all boids
* cohesion: (default on), turns off cohesion when unchecked
* alignment: (default on), turns off alignment when unchecked
* separation: (default on), turns off separation when unchecked
* connect: (default off), turns on a connection line indicating groups connections (may impact performance)
* shape: (default off), changes boid shape to triangle (white: adult, red: senior, blue: child)
* color: (default off), applies color and hues to boids. (may impact performance)

## Resources:
Craig Reynolds: http://www.red3d.com/cwr/boids/
Timm Wong: https://cs.stanford.edu/people/eroberts/courses/soco/projects/2008-09/modeling-natural-systems/boids.html
Ben Eater: https://eater.net/boids, https://github.com/beneater/boids
Conrad Parker: http://www.kfish.org/boids/pseudocode.html

