/*
 * Phaser phases:
 * 1] Init
 * 2] Preload
 *    cache/preload all images/sprites which will instantiated
 * 3] Create
 *    instantiate the preloaded images/sprites
 * 4] Update <-|
 * 5] Render <-|
 * 6] Shutdown
 */

 /**
  * PlayState class implementing Phaser phases
  */
function PlayState() {}

// 1] Init
PlayState.prototype.init = function () {
  /**
   * Force the rendering system to round the position values when drawing images
   */
  this.game.renderer.renderSession.roundPixels = true;

  /**
   * Phaser let us detect a key status (and listen to events) via instances of
   * Phaser.Key, each instance being associated to a specific key.
   * We can easily create Phaser.Key instances with the addKeys method.
   */
  this.keys = this.game.input.keyboard.addKeys({
    left: Phaser.KeyCode.LEFT,
    right: Phaser.KeyCode.RIGHT
  });
};

// 2] Preload
PlayState.prototype.preload = function() {
  // preload background
  this.game.load.image('background', 'images/background.png');
  // preload level structure/positioning of images/sprites
  this.game.load.json('level:1','data/level01.json');
  // preload images sprites
  this.game.load.image('ground', 'images/ground.png');
  this.game.load.image('grass:8x1', 'images/grass_8x1.png');
  this.game.load.image('grass:6x1', 'images/grass_6x1.png');
  this.game.load.image('grass:4x1', 'images/grass_4x1.png');
  this.game.load.image('grass:2x1', 'images/grass_2x1.png');
  this.game.load.image('grass:1x1', 'images/grass_1x1.png');
  // preload image hero
  this.game.load.image('hero', 'images/hero_stopped.png');
}

// 3] Create
PlayState.prototype.create = function() {
  this.game.add.image(0, 0, 'background');
  // load the level cached durign preload, including platforms, enemies, heroes, ...
  this._loadlevel(this.game.cache.getJSON('level:1'));
}

// _loadlevel helper / private method
PlayState.prototype._loadlevel = function(data) {
  // DEBUG
  // console.log(data);

  // store all platforms in a Phaser.Group
  this.platforms = this.game.add.group();

  // spawn all platforms
  data.platforms.forEach(this._spawnPlatform, this);

  //...
  // spawn hero and enemies
  this._spawnCharacters({hero: data.hero});

  // enable gravity using Phaser physics
  const GRAVITY = 1200;
  this.game.physics.arcade.gravity.y = GRAVITY;
}

// _spawnPlatform helper / private method
PlayState.prototype._spawnPlatform = function(platform){
  let sprite = this.platforms.create(platform.x, platform.y, platform.image);
  this.game.physics.enable(sprite);
  // disable gravity for platforms
  sprite.body.allowGravity = false;
  // force the platform under the Hero to be immobile
  sprite.body.immovable = true;
}

// _spawnCharacters helper / private method
PlayState.prototype._spawnCharacters = function (data) {
    /*
     * spawn hero: choose between
     * -- Hero2 - class ES6 - enables autocomplete
     * -- Hero  - class ES5
     */
    this.hero = new Hero2(this.game, data.hero.x, data.hero.y);
    // this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

// 4] Update
PlayState.prototype.update = function () {
  this._handleCollisions();
  this._handleInput();
};

// _handleInput helper / private method
PlayState.prototype._handleInput = function () {
  if (this.keys.left.isDown) {
    this.hero.move(-1);
  } else if (this.keys.right.isDown) {
    this.hero.move(1);
  } else {
    this.hero.move(0);
  }
};

PlayState.prototype._handleCollisions = function () {
    this.game.physics.arcade.collide(this.hero, this.platforms);
};
