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
        // Phaser: configure hero animation
        this.animations.add('stop', [0]);
        this.animations.add('run', [1,2], 8, true);
        this.animations.add('jump', [3]);
        this.animations.add('fall', [4]);
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

    // public custom method. Given a direction (-1: left,
    // 0: no direction, +1: right) update physics and image
    move(direction) {
        // Instead of acting directly on the position...
        // this.x += direction * 2.5; // 2.5 pixels each frame

        // ...affect the body (physics) of the sprite
        const SPEED = 200;
        this.body.velocity.x = direction * SPEED;

        // flip the image (using +/-100% scale) depending on
        // the movement direction, so that the hero faces the correct direction
        if (direction != 0){
            this.scale.x = direction;
        }
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

    // public method to update anumation
    update() {
        let animationName = this._getAnimationName();
        if (this.animations.name != animationName) {
            this.animations.play(animationName);
        }
    }

    // private method
    _getAnimationName() {
        let name = 'stop'; // default animation

        // jumping
        if (this.body.velocity.y < 0) {
            name = 'jump';
        }
        // falling (i.e. falling after a jump)
        else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
            name = 'fall';
        }
        // running
        else if (this.body.velocity.x != 0 && this.body.touching.down) {
            name = 'run';
        }

        return name;
    }
}
