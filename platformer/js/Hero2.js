/**
 * Hero object, deriving/inheriting from Phaser.Sprite
 * 
 * ES6 version of Hero class
 */
// export default class Hero2 extends Phaser.Sprite {
class Hero2 extends Phaser.Sprite {
    constructor(game, x, y) {
        // call Phaser.Sprite constructor
        super(game, x, y, 'hero');

        // Phaser: make the hero pinned to a specific coord
        this.anchor.set(0.5, 0.5);
        // Phaser: enable physics for this sprite
        this.game.physics.enable(this);
        // Phaser: make the body stay inside the screen bounds
        this.body.collideWorldBounds = true;
    }

    /*
     * add more public/private methods to the class down here
     */

    // public custom method
    move(direction) {
        // Instead of acting directly on the position...
        // this.x += direction * 2.5; // 2.5 pixels each frame

        // ...affect the body (physics) of the sprite
        const SPEED = 200;
        this.body.velocity.x = direction * SPEED;
    }

    // public custom method
    jump() {
        const JUMP_SPEED = 600;
        let canJump = this.body.touching.down;

        if (canJump) {
            this.body.velocity.y = -JUMP_SPEED;
        }

        return canJump;
    };

    // public custom method
    bounce() {
        const BOUNCE_SPEED = 200;
        this.body.velocity.y = -BOUNCE_SPEED;
    };
}
