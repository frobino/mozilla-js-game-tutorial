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
class PlayState2 extends Phaser.State {

    // 1] Init (overrridden)
    init() {
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
            right: Phaser.KeyCode.RIGHT,
            up: Phaser.KeyCode.UP
        });

        /**
         * Listener for up key (different approach than _handleInput)
         * NOTE: autocomplete not working for keys.up/left/right
         */
        this.keys.up.onDown.add(
            function () {
                let didJump = this.hero.jump();
                if (didJump) {
                    this.sfx.jump.play();
                }
            },
            this
        );

        // private field used to store how many coins have been collected by Hero
        this.coinPickupCount = 0;
        // private field used to understand if Hero has picked the key
        this.hasKey = false;
    }

    // 2] Preload (overridden)
    preload() {
        // preload background
        this.game.load.image('background', 'images/background.png');
        // preload level structure/positioning of images/sprites
        this.game.load.json('level:1', 'data/level01.json');
        // preload images sprites
        this.game.load.image('ground', 'images/ground.png');
        this.game.load.image('grass:8x1', 'images/grass_8x1.png');
        this.game.load.image('grass:6x1', 'images/grass_6x1.png');
        this.game.load.image('grass:4x1', 'images/grass_4x1.png');
        this.game.load.image('grass:2x1', 'images/grass_2x1.png');
        this.game.load.image('grass:1x1', 'images/grass_1x1.png');
        // preload image invisible-wall, to make spiders not fall from platforms
        this.game.load.image('invisible-wall', 'images/invisible_wall.png');
        // preload image coin counter + numbers
        this.game.load.image('icon:coin', 'images/coin_icon.png');
        this.game.load.image('font:numbers', 'images/numbers.png');
        this.game.load.image('key', 'images/key.png');
        // preload audio asset
        this.game.load.audio('sfx:jump', 'audio/jump.wav');
        this.game.load.audio('sfx:coin', 'audio/coin.wav');
        this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
        this.game.load.audio('sfx:key', 'audio/key.wav');
        this.game.load.audio('sfx:door', 'audio/door.wav');
        // preload images spritesheets (i.e. animated)
        this.game.load.spritesheet('coin', 'images/coin_animated.png', 22, 22);
        this.game.load.spritesheet('spider', 'images/spider.png', 42, 32);
        this.game.load.spritesheet('hero', 'images/hero.png', 36, 42);
        this.game.load.spritesheet('door', 'images/door.png', 42, 66);
    }

    // 3] Create (overrridden)
    create() {
        // create sound entities
        this.sfx = {
            jump: this.game.add.audio('sfx:jump'),
            coin: this.game.add.audio('sfx:coin'),
            stomp: this.game.add.audio('sfx:stomp'),
            key: this.game.add.audio('sfx:key'),
            door: this.game.add.audio('sfx:door')
        };

        this.game.add.image(0, 0, 'background');
        // load the level cached durign preload, including platforms, enemies, heroes, ...
        this._loadlevel(this.game.cache.getJSON('level:1'));
        // create HUD for coins after all the rest, so it is rendered on the top
        this._createHud();
    }

    // _loadlevel helper / private method
    _loadlevel(data) {
        // group of objects that need to appear BELOW all the other sprites.
        // Since this group is created before any other,
        // the objects it contains will appear below the rest.
        this.bgDecoration = this.game.add.group();

        // store all platforms in a Phaser.Group
        this.platforms = this.game.add.group();
        // store all coins in a Phaser.Group
        this.coins = this.game.add.group();
        this.spiders = this.game.add.group();
        this.enemyWalls = this.game.add.group();
        this.enemyWalls.visible = false;

        // spawn all platforms
        data.platforms.forEach(this._spawnPlatform, this);

        // spawn all coins
        data.coins.forEach(this._spawnCoin, this);

        // spawn the door and the key
        this._spawnDoor(data.door.x, data.door.y);
        this._spawnKey(data.key.x, data.key.y);

        // spawn hero and enemies
        this._spawnCharacters({ hero: data.hero, spiders: data.spiders });

        // enable gravity using Phaser physics
        const GRAVITY = 1200;
        this.game.physics.arcade.gravity.y = GRAVITY;
    }

    // _spawnPlatform helper / private method
    _spawnPlatform(platform) {
        let sprite = new Phaser.Sprite();
        sprite = this.platforms.create(platform.x, platform.y, platform.image);
        this.game.physics.enable(sprite);
        // disable gravity for platforms
        sprite.body.allowGravity = false;
        // force the platform under the Hero to be immobile
        sprite.body.immovable = true;
        // create 2 "invisible walls" per spawned platform
        this._spawnEnemyWall(platform.x, platform.y, 'left');
        this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
    }

    // _spawnCoin helper / private method
    _spawnCoin(coin) {
        // NOTE: the following line would be enough. However, by creating a "new Phaser.Sprite()",
        // we enable autocomplete instead of using "any" objects. This can be done ONLY when we
        // are sure about the returned "any". In case of "coins.create", by documentation we know what it returns.
        //
        // let sprite = this.coins.create(coin.x, coin.y, 'coin');
        let sprite = new Phaser.Sprite();
        sprite = this.coins.create(coin.x, coin.y, 'coin');

        sprite.anchor.set(0.5,0.5);
        sprite.animations.add('rotate', [0,1,2,1], 6, true);
        sprite.animations.play('rotate');

        // enable physics of the engine on the sprite (coin),
        // but remove the gravity.
        this.game.physics.enable(sprite);
        sprite.body.allowGravity = false;
    }

    // _spawnCharacters helper / private method
    _spawnCharacters(data) {
        /*
         * spawn hero: choose between
         * -- Hero2 - class ES6 - enables autocomplete
         * -- Hero  - class ES5
         */
        this.hero = new Hero2(this.game, data.hero.x, data.hero.y);
        // this.hero = new Hero(this.game, data.hero.x, data.hero.y);
        this.game.add.existing(this.hero);

        // spawn spiders
        data.spiders.forEach( function (spider) {
            let sprite = new Spider2(this.game, spider.x, spider.y);
            this.spiders.add(sprite);
        }, this);
    };

    // _spawnEnemyWall helper / private method
    // Spawns invisible walls to contain enemies on platforms and not make them fall
    _spawnEnemyWall(x, y, side){
        let sprite = new Phaser.Sprite();
        sprite = this.enemyWalls.create(x, y, 'invisible-wall');
        // anchor and y displacement
        sprite.anchor.set(side === 'left' ? 1 : 0, 1);

        // physic properties
        this.game.physics.enable(sprite);
        sprite.body.immovable = true;
        sprite.body.allowGravity = false;
    }

    // Spawns the door
    _spawnDoor(x, y) {
        // add to bgDecoration group so that door appear behind enemies and other sprites
        this.door = this.bgDecoration.create(x, y, 'door');
        this.door.anchor.setTo(0.5, 1);
        // enable physics to identify collision between Hero and door
        this.game.physics.enable(this.door);
        this.door.body.allowGravity = false;
    };

    // add to bgDecoration group so that door appear behind enemies and other sprites
    _spawnKey(x, y) {
        // add to bgDecoration group so that door appear behind enemies and other sprites
        this.key = this.bgDecoration.create(x, y, 'key');
        this.key.anchor.set(0.5, 0.5);
        // enable physics to identify collision between Hero and key
        this.game.physics.enable(this.key);
        this.key.body.allowGravity = false;

        // add a small 'up & down' animation via a Phaser.Tween
        // This is a way to add simple animation without using a full
        // sprited animation as we have for hero, spiders, etc.
        this.key.y -= 3;
        this.game.add.tween(this.key)
            .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
            .yoyo(true)
            .loop()
            .start();
    };

    // 4] Update (overridden)
    update() {
        this._handleCollisions();
        this._handleInput();
        // update HUD + coincounter
        this.coinFont.text = `x${this.coinPickupCount}`;
    }

    // _handleInput helper / private method
    _handleInput() {
        if (this.keys.left.isDown) {
            this.hero.move(-1);
        } else if (this.keys.right.isDown) {
            this.hero.move(1);
        } else {
            this.hero.move(0);
        }
    };

    // _handleCollision helper / private method
    _handleCollisions() {
        // make the hero collide (i.e. block) against platforms
        this.game.physics.arcade.collide(this.hero, this.platforms);
        // make the spiders collide (i.e. block) against platforms
        this.game.physics.arcade.collide(this.spiders, this.platforms);
        // make the spiders collide (i.e. block) against invisible walls
        this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
        // handle what happens when hero and coin sprites overlap, by using a custom method
        this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin, null, this);
        // handle what happens when hero and enemy overlap (i.e. hero dies)
        this.game.physics.arcade.overlap(this.hero, this.spiders, this._onHeroVsEnemy, null, this);
        // handle what happens when hero and key overlap
        this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey, null, this)
        // handle what happens when hero and door overlap.
        // Note the extra processCallback: only if this returns true (i.e. the hero has the key)
        // then the handler is executed.
        let processCallback = function (hero, door) {
            return this.hasKey && hero.body.touching.down;
        };
        this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor, processCallback, this);
    };

    _onHeroVsCoin(hero, coin) {
        // coin and hero expected to be Phaser.Sprite objects.
        // TODO: check if it is possible in js to specify types.
        coin.kill();
        this.sfx.coin.play();
        this.coinPickupCount++;
    };

    _onHeroVsKey(hero, key) {
        this.sfx.key.play();
        key.kill();
        this.hasKey = true;
    };

    _onHeroVsDoor(hero, door) {
        this.sfx.door.play();
        this.game.state.restart();
        // TODO: go to the next level instead
    };

    _onHeroVsEnemy(hero, enemy){
        // hero and enemy expected to be Phaser.Sprite objects.
        // TODO: try to add autocomplete for 'body.velocity'
        let heroSprite = new Hero2(this.game);
        let enemySprite = new Spider2(this.game);
        heroSprite = hero;
        enemySprite = enemy;

        if (heroSprite.body.velocity.y > 0) {
            // kill enemies when hero is falling
            heroSprite.bounce();
            enemySprite.die();
            this.sfx.stomp.play();
        } else {
            // game over -> restart the game
            this.sfx.stomp.play();
            this.game.state.restart();
        }
    };

    _createHud(){
        // create a font to count coins based on png
        const NUMBERS_STR = '0123456789X ';
        this.coinFont = this.game.add.retroFont('font:numbers', 20, 26, NUMBERS_STR, 6);

        // create a HUD to indicate how many coins has been picked
        let coinIcon = this.game.make.image(0, 0, 'icon:coin');
        this.hud = this.game.add.group();
        this.hud.add(coinIcon);
        this.hud.position.set(10, 10);

        // create a coin counter based on coinFont and put it beside the HUD to count coins
        let coinScoreImg = this.game.make.image(coinIcon.x + coinIcon.width,
            coinIcon.height /2, this.coinFont);
        coinScoreImg.anchor.set(0, 0.5);

        this.hud.add(coinScoreImg);
    }

}