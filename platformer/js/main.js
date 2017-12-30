/**
 * MAIN
 */
window.onload = function() {
  let game = new Phaser.Game(960, 600, Phaser.AUTO, 'game');
  let play = new PlayState();
  game.state.add('play', play);
  game.state.start('play');
}
