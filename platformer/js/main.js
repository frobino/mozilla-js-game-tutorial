/*
 * Phaser pahses:
 * - Init
 * - Preload
 *   cache/preload all images/sprites which will instantiated
 * - Create
 *   instantiate the preloaded images/sprites
 * - Update <-|
 * - Render <-|
 * - Shutdown
 */

 /**
  * PlayState object implementing Phaser phases
  */
PlayState = {};

// Preload
PlayState.preload = function() {
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

// Create
PlayState.create = function() {
  this.game.add.image(0, 0, 'background');
  // load the level cached durign preload
  this._loadlevel(this.game.cache.getJSON('level:1'));
}

// _loadlevel helper
PlayState._loadlevel = function(data) {
  // DEBUG
  // console.log(data);

  // spawn all platforms
  data.platforms.forEach(this._spawnPlatform, this);

  //...
  // spawn hero and enemies
  this._spawnCharacters({hero: data.hero});
}

// _spawnPlatform helper
PlayState._spawnPlatform = function(platform){
  this.game.add.sprite(platform.x, platform.y, platform.image);
}

// _spawnCharacters helper
PlayState._spawnCharacters = function (data) {
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

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
 * MAIN
 */
window.onload = function() {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
  game.state.add('play', PlayState);
  game.state.start('play');
}
