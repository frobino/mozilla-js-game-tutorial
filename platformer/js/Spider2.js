/**
 * Spider object, deriving/inheriting from Phaser.Sprite
 * 
 * ES6 version of Spider class
 */
class Spider2 extends Phaser.Sprite {

    // private field
    // TODO: currently js sucks and the only way to create fields is in the constructor.
    // 
    // fSpeed = 0;

    constructor(game, x, y) {
        // call Phaser.Sprite constructor
        super(game, x, y, 'spider');

        // anchor: make the spider pinned to a specific coord
        this.anchor.set(0.5);
        // animations
        this.animations.add('crawl', [0, 1, 2], 8, true);
        this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
        this.animations.play('crawl');

        // Phaser: enable physics for this sprite
        this.game.physics.enable(this);
        // Phaser: make the body stay inside the screen bounds
        this.body.collideWorldBounds = true;

        // declaring "private" field here:
        this.fSpeed = 100;
        this.body.velocity.x = this.fSpeed;

    }

    // override update method. This method is automatically called by the engine between
    // preUpdate and postUpdate phases to update the object properties.
    update() {
        // check against walls and reverse direction if necessary
        if (this.body.touching.right || this.body.blocked.right) {
            this.body.velocity.x = -this.fSpeed; // turn left
        }
        else if (this.body.touching.left || this.body.blocked.left) {
            this.body.velocity.x = this.fSpeed; // turn right
        }
    }

    die() {
        // disabling the body, so the spider stops and isn't taken into account for collisions
        this.body.enable = false;

        this.animations.play('die').onComplete.addOnce(function () {
            this.kill();
        }, this);
    }
}
