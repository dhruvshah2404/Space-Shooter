//Got Engine from https://github.com/rishimadhok/Space-Shooter-Game
let score = document.getElementById("score");

function loadImages() {
  enemyImage = new Image();
  playerImage = new Image();
  bulletImage = new Image();

  enemyImage.src = "images/enemyShip.png";
  playerImage.src = "images/player.png";
  bulletImage.src = "images/laserRed.png";
}

function init() {
  canvas = document.getElementById("canvas");
  var enemiesKilled = 0;

  console.log(canvas);
  gameover = false;

  ctx = canvas.getContext("2d");

  W = canvas.width;
  H = canvas.height;
  prev_counter = 0;
  counter = 0;

  loadImages();

  player = {
    x: 290,
    y: H - 85,
    w: 75,
    h: 75,
    speed: 20,
    bullets: [],

    update: function () {
      //this.x = this.x + this.speed;
      // To test the boundary conditions
      //if(this.x >= W-this.w || this.x<=0){
      //	this.speed *= -1;
      //}
    },

    draw: function () {
      // ctx.drawImage() is used to load a custom image
      ctx.drawImage(playerImage, player.x, player.y, player.w, player.h);
      // ctx.fillRect(player.x,player.y,player.w,player.h) // (10,10) is the co-ordinate of the upper left vertex of rectange. (20,20) = (width,height)
    },

    shoot: function () {
      if (counter - prev_counter >= 1) {
        console.log("Shooting a bullet");

        var b = new bullet(this.x + this.w / 2, this.y, 10);
        this.bullets.push(b);
        prev_counter = counter;

        enemies.forEach(function (enemy) {
          if (isCollidingWithBullet(b, enemy)) {
            this.state = "inactive";
            console.log("enemy died");
            enemiesKilled++;
            score.innerHTML = enemiesKilled;
            var index = enemies.indexOf(enemy);
            enemies.splice(index, 1);
          }
        });
      }
    },
  };

  // Listener for events
  function buttonGotPressed(e) {
    if (e.key == " ") {
      player.shoot();
    }
    if (e.key == "ArrowLeft") {
      player.x = player.x - player.speed;
      if (player.x <= 0) {
        player.x = 0;
      }
    }
    if (e.key == "ArrowRight") {
      player.x = player.x + player.speed;
      if (player.x >= W - player.w) {
        player.x = W - player.w;
      }
    }
  }

  document.addEventListener("keydown", buttonGotPressed); // When spacebar is pressed, then the player shoots the bullet

  enemies = [];
  var e = new enemy(10, 20, 5);

  enemies.push(e);
}

// Class defined for a bullet
function bullet(x, y, speed) {
  this.x = x - 4;
  this.y = y;
  this.w = 10;
  this.h = 25;
  this.state = "active";
  this.speed = speed;

  this.draw = function () {
    ctx.drawImage(bulletImage, this.x, this.y, this.w, this.h);
    // ctx.fillRect(this.x,this.y,this.w,this.h);
  };

  this.update = function () {
    this.y -= this.speed;

    if (this.y <= 0) {
      this.state = "inactive";
    }
  };
}

// Class defined for an enemy
function enemy(x, y, speed) {
  this.x = x;
  this.y = y;
  this.w = 45;
  this.h = 45;
  this.state = "active";
  this.speed = speed;

  this.draw = function () {
    ctx.drawImage(enemyImage, this.x, this.y, this.w, this.h);
    // ctx.fillRect(this.x,this.y,this.w,this.h)
  };

  this.update = function () {
    this.x = this.x + this.speed;

    // To test the boundary conditions
    if (this.x >= W - this.w || this.x <= 0) {
      this.speed *= -1;
    }

    this.y++;

    if (this.y <= 0) {
      this.state = "inactive";
    }
  };
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  //Drawing the player
  player.draw();

  //Drawing the bullets
  player.bullets.forEach(function (bullet) {
    bullet.draw();
  });

  //Drawing the enemy
  enemies.forEach(function (enemy) {
    enemy.draw();
  });
}

function update() {
  player.update();

  player.bullets.forEach(function (bullet) {
    bullet.update();
  });

  enemies.forEach(function (enemy) {
    enemy.update();
  });

  var no = Math.random();
  if (no < 0.01) {
    var x = Math.floor(Math.random() * (W - 50));
    var y = Math.floor(Math.random() * 100);

    var speed = Math.random() * 5;
    var negative = Math.random();
    if (negative < 0.5) {
      speed = -speed;
    }

    if (score.innerHTML > 30) {
      var speed = Math.random() * 10;
      var negative = Math.random();
      if (negative < 0.5) {
        speed = -speed;
      }
    }
    var e = new enemy(x, y, speed);
    enemies.push(e);
  }

  enemies.forEach(function (enemy) {
    if (isColliding(player, enemy)) {
      alert("Game over. Press OK to restart!");
      gameover = true;
    }
  });
}

function isColliding(r1, r2) {
  var x_axis = Math.abs(r1.x + r1.w / 2 - r2.x) <= Math.max(r1.w, r2.w);
  var y_axis = Math.abs(r1.y + r1.h / 2 - r2.y) <= Math.max(r1.h, r2.h);

  return x_axis && y_axis;
}

function isCollidingWithBullet(r1, r2) {
  var x_axis = Math.abs(r1.x - r2.x - r2.h) <= Math.max(r1.w - 20, r2.w - 20);
  var y_axis = Math.abs(r1.y - r2.y) <= Math.max(r1.h, r2.h);

  return x_axis || y_axis;
}

function render() {
  draw();
  update();
  console.log("in render");
  counter++;

  if (gameover == false) {
    window.requestAnimationFrame(render);
  } else {
    startGame();
  }
}

function startGame() {
  init();
  render();
}

startGame();
