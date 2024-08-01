import { createAnimations } from "./animations.js";

// global phaser

const config = {
  type: Phaser.AUTO, // canvas or webgl
  width: 256,
  height: 244,
  backgroundColor: "#049cd8",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  parent: "game",
  scene: {
    preload, // preload assets (images, sounds, etc)
    create, // create game objects (sprites, etc)
    update, // update game objects (60fps)
  },
};

// it executes before the game starts
function preload() {
  this.load.image("cloud1", "assets/scenery/overworld/cloud1.png");
  this.load.image("floorbricks", "assets/scenery/overworld/floorbricks.png");
  this.load.spritesheet("mario", "assets/entities/mario.png", {
    frameWidth: 18, // width of each frame, in pixels. its calculated from the image width divided by the number of frames in the image 6 marios(18*6=108)
    frameHeight: 16,
  });
  this.load.audio("gameover", "assets/sound/music/gameover.mp3");
}

// it executes when the game starts
function create() {
  // image(x, y, key)
  this.add.image(0, 0, "cloud1").setOrigin(0, 0).setScale(0.15);
  // integrating physics
  this.floor = this.physics.add.staticGroup();

  this.floor
    .create(0, config.height - 16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody();

  this.floor
    .create(0, config.height - 16, "floorbricks")
    .setOrigin(0, 0.5)
    .refreshBody();

  // this.add
  //   .tileSprite(0, config.height - 32, config.width, 32, "floorbricks")
  //   .setOrigin(0, 0);
  // // sprite(x, y, key)
  // this.mario = this.add.sprite(50, 210, "mario").setOrigin(0, 1);
  // integrating physics
  this.mario = this.physics.add
    .sprite(50, 210, "mario")
    .setOrigin(0, 1)
    .setCollideWorldBounds(true);
  // .setColliderWorldBounds(true);
  this.physics.world.setBounds(0, 0, 2000, config.height);
  // create collision between mario and floor
  this.physics.add.collider(this.mario, this.floor);
  // create animation from sprite for walking
  this.anims.create({
    key: "mario-walks",
    frames: this.anims.generateFrameNumbers("mario", { start: 1, end: 3 }),
    frameRate: 10,
    repeat: -1,
  });
  // create animation from sprite for jumping
  this.anims.create({
    key: "mario-jumps",
    frames: [{ key: "mario", frame: 5 }],
    frameRate: 10,
  });

  this.cameras.main.setBounds(0, 0, 2000, config.height);
  this.cameras.main.startFollow(this.mario);

  createAnimations(this);

  // move mario
  this.keys = this.input.keyboard.createCursorKeys();
}

// it executes every frame (60fps) after the game starts
function update() {
  if (this.mario.isDead) return;

  if (this.keys.left.isDown) {
    this.mario.anims.play("mario-walk", true);
    this.mario.x -= 2;
    this.mario.flipX = true;
  } else if (this.keys.right.isDown) {
    this.mario.anims.play("mario-walk", true);
    this.mario.x += 2;
    this.mario.flipX = false;
  } else {
    this.mario.anims.play("mario-idle", true);
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300);
    this.mario.anims.play("mario-jump", true);
  }

  if (this.keys.up.isDown && this.mario.body.touching.down) {
    this.mario.setVelocityY(-300);
    this.mario.anims.play("mario-jump", true);
  }

  if (this.mario.y >= config.height) {
    this.mario.isDead = true;
    this.mario.anims.play("mario-dead");
    this.mario.setCollideWorldBounds(false);
    this.sound.add("gameover", { volume: 0.2 }).play();

    setTimeout(() => {
      // jump before dying
      this.mario.setVelocityY(-350);
    }, 100);

    setTimeout(() => {
      this.scene.restart();
    }, 4000);
  }
}

new Phaser.Game(config);
