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
//PlayState = {};
function PlayState() {}

// Preload
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

// Create
PlayState.prototype.create = function() {
  this.game.add.image(0, 0, 'background');
  // load the level cached durign preload, including platforms, enemies, heroes, ...
  this._loadlevel(this.game.cache.getJSON('level:1'));
}

// _loadlevel helper / private method
PlayState.prototype._loadlevel = function(data) {
  // DEBUG
  // console.log(data);

  // spawn all platforms
  data.platforms.forEach(this._spawnPlatform, this);

  //...
  // spawn hero and enemies
  this._spawnCharacters({hero: data.hero});
}

// _spawnPlatform helper / private method
PlayState.prototype._spawnPlatform = function(platform){
  this.game.add.sprite(platform.x, platform.y, platform.image);
}

// _spawnCharacters helper / private method
PlayState.prototype._spawnCharacters = function (data) {
    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};