/**
 * MAIN
 */
window.onload = function() {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
  /*
   * playState: choose between
   * -- Playstate2 - class ES6 - enables autocomplete
   * -- PlayState - class ES5
   */
  // let playState = new PlayState();
  let playState = new PlayState2();
  game.state.add('play', playState);
  game.state.start('play');
}
