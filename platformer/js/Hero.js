/**
 * Hero object, deriving from Phaser.Sprite
 */
function Hero(game, x ,y) {
  // call Phaser.Sprite constructor
  Phaser.Sprite.call(this, game, x, y, 'hero');
  this.anchor.set(0.5, 0.5);
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
  this.x += direction * 2.5; // 2.5 pixels each frame
};
