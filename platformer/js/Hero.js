/**
 * Hero object, deriving from Phaser.Sprite
 */
function Hero(game, x ,y) {
  // call Phaser.Sprite constructor
  Phaser.Sprite.call(this, game, x, y, 'hero');

  // Phaser: make the hero pinned to a specific coord
  this.anchor.set(0.5, 0.5);
  // Phaser: enable physics for this sprite
  this.game.physics.enable(this);
  // Phaser: make the body stay inside the screen bounds
  this.body.collideWorldBounds = true;
};

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

/**
 * add more methods to the class.
 * NOTE: more public/private methods must be added to this
 * subclass AFTER the inherit lines
 */

// public custom method
Hero.prototype.move = function(direction) {
  // Instead of acting directly on the position...
  // this.x += direction * 2.5; // 2.5 pixels each frame

  // ...affect the body (physics) of the sprite
  const SPEED = 200;
  this.body.velocity.x = direction * SPEED;
};
