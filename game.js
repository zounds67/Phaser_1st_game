// The game's settings. Phaser reads them when it builds the game.
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var bombs;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

// Mission 1: Start the game engine
// Build the game from the settings in config.
var game = new Phaser.Game(config);

// Phaser calls preload first, to load the pictures.
function preload ()
{
    // Mission 2: Load the sky picture
    this.load.image('sky', 'assets/sky.png');

    // Mission 4: Load the rest of the art
    this.load.image('ground', 'assets/platform.png');

    // Load 'star' and 'bomb' the same way.
    this.load.image('star', 'assets/star.png');
    this.load.image('bomb', 'assets/bomb.png');

    // Load 'dude' as a spritesheet. Its settings need frameWidth: 32 and frameHeight: 48
     this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });

}

// Then it calls create once, to build the world.
function create ()
{
    // Mission 3: Paint the sky
    this.add.image(400, 300, 'sky');

    // Mission 5: Lay down the ground
    platforms = this.physics.add.staticGroup();

    // Create the ground here.
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    // Mission 6: Build three ledges
    // Three ledges to jump on.
    platforms.create(600, 400, 'ground')
    platforms.create(50, 250, 'ground')
    platforms.create(750, 220, 'ground')

    // Mission 7: Meet the dude
    // Make player a physics sprite at (100, 450) using the 'dude' picture.
    player = this.physics.add.sprite(100, 450, 'dude')

    // A little bounce: 0.2
    player.setBounce(0.2)
    // Keep the player on the screen.
    player.setCollideWorldBounds(true)

    // Mission 8: Stand on solid ground
    // Make player and platforms bump into each other.
    this.physics.add.collider(player, platforms);

    // Mission 9: Teach him to walk
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });
    // Make the 'right' animation: frames 5 to 8.

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });


    // Mission 10: Grab the arrow keys
    // Store the arrow keys in cursors.
    cursors = this.input.keyboard.createCursorKeys()


    // Mission 13: Make it rain stars
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    stars.children.iterate(function (child) {

        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    // Make the stars land on the platforms.
    this.physics.add.collider(stars, platforms);



    // Mission 14: Notice a star
    // When player touches stars, call collectStar.
    this.physics.add.overlap(player, stars, collectStar, null, this);


    // Mission 16: Put a score on the screen
    // Make the score label in the top-left corner.
    scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'})

    // Mission 18: Get the bombs ready
    bombs = this.physics.add.group();
    this.physics.add.collider(bombs, platforms);

    // 2. When the player hits a bomb, call hitBomb: Mission 14’s five inputs, as a collider.
    this.physics.add.collider(player, bombs, hitBomb, null, this)
}

// Then it calls update again and again, about 60 times a second.
function update ()
{
    if (gameOver)
    {
        return;
    }

    // Mission 11: Walk left and right
    if (cursors.left.isDown)
    {
        player.setVelocityX(-160)
        player.anims.play('left', true)

    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160)
        player.anims.play('right', true)
    }
    else
    {
        player.anims.play('turn', false)
        player.setVelocityX(0)

    }

    // Mission 12: Jump!
    // Jump only when up is pressed AND the dude is standing on something.
     if (cursors.up.isDown && player.body.touching.down == true)
    {
         player.setVelocityY(-330)
    }


}

// Phaser calls collectStar when the dude touches a star.
function collectStar (player, star)
{
    // Mission 15: Collect a star
    // star is the one star that was touched.
    star.disableBody(true, true)


    // Mission 17: Make every star count
    // Add 10 points.
    score += 10
    // Show the new score.
    scoreText.setText('Score: ' + score)


    // Mission 20: More stars, more bombs
    if (stars.countActive(true) === 0)
    {
        //  1. A new batch of stars to collect
        stars.children.iterate(function (child) {

            // Bring each child star back at (child.x, 0) here.
            child.enableBody(true, child.x, 0, true, true)
        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        //  2. A new bomb at (x, 16)
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1)
        bomb.setCollideWorldBounds(true)
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20)
    }
}

// Phaser calls hitBomb when a bomb hits the dude.
function hitBomb (player, bomb)
{
    // Mission 19: Game over
    // Freeze the physics.
    this.physics.pause()
    // Turn the player red.
    player.setTint(0xff0000)
    // Face forward.
    player.anims.play('turn')
    // Flip the gameOver switch.
    gameOver = true
}

