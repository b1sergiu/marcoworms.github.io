function Player(x, y) {

    var player = this;

    this.x = x;
	this.y = y;
	this.sprite = game.add.sprite(x, y, "megamen");
    this.state = "none";
    this.facing = "none";
    this.isJumping = false;
    this.jumpingTimer = 0
    this.isShooting = false;
    this.shootingTimer = 0

    game.camera.follow(this.sprite);

    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.collideWorldBounds = true;
    this.sprite.anchor.x = 0.5;
    this.sprite.anchor.y = 1;
    this.sprite.body.setSize(28, 35, 0, 0);

    this.sprite.scale.x = 2;
    this.sprite.scale.y = 2;


    this.sprite.animations.add("spawn", [0,1,2,3,4,5,6], 12);
    this.sprite.animations.add("walk", [11,12,13,14,15,16,17,18,19,20], 18, true);
    this.sprite.animations.add("jump", [21,22,23,24], 12);

    var spawn = this.sprite.animations.play("spawn");
    this.state = "spawning";
    spawn.onComplete.add(function(){
        this.state = "idle";
        this.sprite.frame = 7;
    }, this);

    this.update = function(cursors) {

        if (this.isJumping && game.time.now > this.jumpingTimer && (this.sprite.body.onFloor() || this.sprite.body.blocked.left || this.sprite.body.blocked.right)) {
           this.isJumping = false;
           this.state = "finished jumping"
        }

        if (cursors.right.isDown && game.time.now > this.jumpingTimer) {
            this.moveX(220);
        } else if (cursors.left.isDown && game.time.now > this.jumpingTimer) {
            this.moveX(-220);
        } else if (game.time.now > this.jumpingTimer) {
            this.moveX(0);
        }

        if (cursors.up.isDown) {
            this.jump();
        }

        if (this.shootKey.isDown && !this.isShooting) {
            this.shoot();
        } else if (!this.shootKey.isDown && this.isShooting && game.time.now > this.shootingTimer) {
            this.isShooting = false;
            this.state = "finished shooting"
            if (this.isJumping) {
                this.sprite.frame = 24;
            }
        }

        function die() {
            game.state.start("menu")
        }

        function win() {
            game.state.start("menu")
        }
    }

    this.moveX = function(velocityX) {

        if (this.state == "spawning") {
            return;
        }

        this.sprite.body.velocity.x = velocityX;

        if (velocityX > 0 && this.facing != "right") {
            this.sprite.scale.x = 2;
            this.facing = "right"
        } else if (velocityX < 0 && this.facing != "left") {
            this.sprite.scale.x = -2;
            this.facing = "left"
        }

        if (velocityX != 0 && this.state != "walking" && !this.isJumping && !this.isShooting) {
            this.state = "walking";
            this.sprite.animations.play("walk");
            return;
        } else if (velocityX == 0) {
            if (!this.isJumping && this.state != "idle" && !this.isShooting) {
                this.sprite.animations.stop();
                this.state = "idle";
                this.sprite.frame = 7;
            }
        }
    }

    this.jump = function() {
        if (!this.isJumping) {
            this.jumpingTimer = game.time.now + 300;
            this.sprite.body.velocity.y = -400;
            this.sprite.animations.play("jump");
            this.isJumping = true;
            if (this.sprite.body.blocked.left) {
                this.moveX(220);
            } else if (this.sprite.body.blocked.right) {
                this.moveX(-220);
            }
        }
    }

    this.shoot = function() {
        this.shootingTimer = game.time.now + 125;
        this.sprite.animations.stop();
        if (this.isJumping) {
            this.sprite.frame = 42;
        } else {
            this.sprite.frame = 38;
        }

        console.log("pew");
        this.state = "shooting";
        this.isShooting = true;
    }

}