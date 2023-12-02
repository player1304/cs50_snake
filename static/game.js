/* 
- phaser 3 official tutorial
- swipe, audio: HTML5 Cross Platform Game Development Using Phaser 3 (Emanuele Feronato)
- message box: https://phaser.io/news/2017/10/message-box-tutorial
- sounds: 
  - https://opengameart.org/content/ui-sounds
  - https://opengameart.org/content/10-8bit-coin-sounds
*/

const TILE_DIMENSION = 20;
const CANVAS_COLOR = "#bfcc00";
//  Direction consts
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;
const GAMEOVER_DEBUG = false; // go straight to lose if set to true

// game related parameters
var widthInBlocks = 15; // 15*16 = 240
var heightInBlocks = 20; // 20*16 = 320
var gameSpeed = TILE_DIMENSION * 10; // the bigger the SLOWER

// initiate the global variables
var food;
var snake;
var cursors;

class gamestart extends Phaser.Scene {
  constructor() {
    super("GameStart");
  }
  preload() {
    this.load.image("startButton", "assets/startButton.png");
  }

  create() {
    console.log("game start scene reached");

    var startGroup = this.add.group();

    // display a start button 
    var startButton = this.add.sprite(     gameConfig.width / 2,
    gameConfig.height / 2,
    "startButton");
    startButton.x = gameConfig.width / 2;
    startButton.y = gameConfig.height / 2;

    // add the button to the group
    startGroup.add(startButton);

    // click button to start
    startButton.setInteractive();
    startButton.on(
        "pointerdown",
        function () {
          startGame();
        },
        this
      );
    function startGame() {
      startGroup.clear(true, true);
      game.scene.start('PlayGame');
    }
  }

}

class playgame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  initialize() {
    console.log("play game scene reached");
  }

  preload() {
      this.load.image("food", "assets/food.png");
      this.load.image("body", "assets/body.png");
      this.load.image("closeButton", "assets/closeButton.png");
      this.load.image("boxBack", "assets/boxBack.png");
      this.load.audio("eat", "assets/eat.wav");
      this.load.audio("lose", "assets/lose.ogg");
  }

  create() {
    var Food = new Phaser.Class({
      Extends: Phaser.GameObjects.Image,
  
      initialize: function Food(scene, x, y) {
        Phaser.GameObjects.Image.call(this, scene);
  
        this.setTexture("food");
        this.setPosition(x * TILE_DIMENSION, y * TILE_DIMENSION);
        this.setOrigin(0);
  
        this.total = 0;
  
        scene.children.add(this);
      },
  
      eat: function () {
        this.total++;
      },
    });
  
    var Snake = new Phaser.Class({
      initialize: function Snake(scene, x, y) {
        this.headPosition = new Phaser.Geom.Point(x, y);
  
        this.body = scene.add.group();
  
        this.head = this.body.create(
          x * TILE_DIMENSION,
          y * TILE_DIMENSION,
          "body"
        );
        this.head.setOrigin(0);
  
        this.alive = true;
  
        this.speed = gameSpeed;
  
        this.length = 1; // for scoring purpose
  
        this.moveTime = 0;
  
        this.tail = new Phaser.Geom.Point(x, y);
  
        this.heading = RIGHT;
        this.direction = RIGHT;

        // add the sound effects
        this.eatSound = game.sound.add("eat");
        this.loseSound = game.sound.add("lose");
      },
  
      update: function (time) {
        if (time >= this.moveTime) {
          return this.move(time);
        }
      },
  
      faceLeft: function () {
        if (this.direction === UP || this.direction === DOWN) {
          this.heading = LEFT;
        }
      },
  
      faceRight: function () {
        if (this.direction === UP || this.direction === DOWN) {
          this.heading = RIGHT;
        }
      },
  
      faceUp: function () {
        if (this.direction === LEFT || this.direction === RIGHT) {
          this.heading = UP;
        }
      },
  
      faceDown: function () {
        if (this.direction === LEFT || this.direction === RIGHT) {
          this.heading = DOWN;
        }
      },
  
      move: function (time) {
        /**
         * Based on the heading property (which is the direction the pgroup pressed)
         * we update the headPosition value accordingly.
         *
         * The Math.wrap call allow the snake to wrap around the screen, so when
         * it goes off any of the sides it re-appears on the other.
         */
        switch (this.heading) {
          case LEFT:
            this.headPosition.x = Phaser.Math.Wrap(
              this.headPosition.x - 1,
              0,
              widthInBlocks
            );
            break;
  
          case RIGHT:
            this.headPosition.x = Phaser.Math.Wrap(
              this.headPosition.x + 1,
              0,
              widthInBlocks
            );
            break;
  
          case UP:
            this.headPosition.y = Phaser.Math.Wrap(
              this.headPosition.y - 1,
              0,
              heightInBlocks
            );
            break;
  
          case DOWN:
            this.headPosition.y = Phaser.Math.Wrap(
              this.headPosition.y + 1,
              0,
              heightInBlocks
            );
            break;
        }
  
        this.direction = this.heading;
  
        //  Update the body segments and place the last coordinate into this.tail
        Phaser.Actions.ShiftPosition(
          this.body.getChildren(),
          this.headPosition.x * TILE_DIMENSION,
          this.headPosition.y * TILE_DIMENSION,
          1,
          this.tail
        );
  
        //  Check to see if any of the body pieces have the same x/y as the head
        //  If they do, the head ran into the body
  
        var hitBody = Phaser.Actions.GetFirst(
          this.body.getChildren(),
          { x: this.head.x, y: this.head.y },
          1
        );
  
        if (hitBody) {
          console.log("dead");
          this.alive = false;
          this.loseSound.play();
          game.scene.start("GameOver");
  
          return false;
        } else {
          //  Update the timer ready for the next movement
          this.moveTime = time + this.speed;
  
          return true;
        }
      },
  
      grow: function () {
        var newPart = this.body.create(this.tail.x, this.tail.y, "body");
  
        newPart.setOrigin(0);
      },
  
      collideWithFood: function (food) {
        if (this.head.x === food.x && this.head.y === food.y) {
          console.log("What is 'this' at collideWithFood");
          console.log(this);

          this.grow();
  
          food.eat();

          this.eatSound.play();

          this.length++;
  
          //  For every 5 items of food eaten we'll increase the snake speed a little
          if (this.speed > 20 && food.total % 5 === 0) {
            this.speed -= 5;
          }
  
          return true;
        } else {
          return false;
        }
      },
  
      updateGrid: function (grid) {
        //  Remove all body pieces from valid positions list
        this.body.children.each(function (segment) {
          var bx = segment.x / TILE_DIMENSION;
          var by = segment.y / TILE_DIMENSION;
  
          grid[by][bx] = false;
        });
  
        return grid;
      },
    });
  
    // get random start locations
  
    let foodStartPos = {
      x: Phaser.Math.RND.integerInRange(0, Math.floor(widthInBlocks / 2)),
      y: Phaser.Math.RND.integerInRange(0, heightInBlocks - 1),
    };
  
    let snakeStartPos = {
      x: Phaser.Math.RND.integerInRange(
        Math.floor(widthInBlocks / 2 + 1),
        widthInBlocks - 1
      ),
      y: Phaser.Math.RND.integerInRange(0, heightInBlocks - 1),
    };
  
    // initiate the first food and snake
    food = new Food(this, foodStartPos.x, foodStartPos.y);
    snake = new Snake(this, snakeStartPos.x, snakeStartPos.y);
  
    // keyboard controls
    cursors = this.input.keyboard.createCursorKeys();
    // swipe controls
    this.input.on("pointerup", this.handleSwipe, this);
  }

  update(time, delta) {
    // FOR DEBUG OF GAME OVER SCREEN!!
    if (GAMEOVER_DEBUG == true) {
      console.log("game over debug enabled!")
      this.scene.start("GameOver");
    }

    if (!snake.alive) {
      return;
    }
  
    /**
     * Check which key is pressed, and then change the direction the snake
     * is heading based on that. The checks ensure you don't double-back
     * on yourself, for example if you're moving to the right and you press
     * the LEFT cursor, it ignores it, because the only valid directions you
     * can move in at that time is up and down.
     */
    if (cursors.left.isDown) {
      snake.faceLeft();
    } else if (cursors.right.isDown) {
      snake.faceRight();
    } else if (cursors.up.isDown) {
      snake.faceUp();
    } else if (cursors.down.isDown) {
      snake.faceDown();
    }
  
    if (snake.update(time)) {
      //  If the snake updated, we need to check for collision against food
  
      if (snake.collideWithFood(food)) {
        console.log("repositionFood() needs to trigger now");
        this.repositionFood();
      }
    }
  }
  
  /**
   * We can place the food anywhere in our grid
   * *except* on-top of the snake, so we need
   * to filter those out of the possible food locations.
   * If there aren't any locations left, they've won!
   *
   * @method repositionFood
   * @return {boolean} true if the food was placed, otherwise false
   */
  repositionFood() {
    //  First create an array that assumes all positions
    //  are valid for the new piece of food
  
    //  A Grid we'll use to reposition the food each time it's eaten
    var testGrid = [];
  
    for (var y = 0; y < heightInBlocks; y++) {
      testGrid[y] = [];
  
      for (var x = 0; x < widthInBlocks; x++) {
        testGrid[y][x] = true;
      }
    }
  
    snake.updateGrid(testGrid);
  
    //  Purge out false positions
    var validLocations = [];
  
    for (var y = 0; y < heightInBlocks; y++) {
      for (var x = 0; x < widthInBlocks; x++) {
        if (testGrid[y][x] === true) {
          //  Is this position valid for food? If so, add it here ...
          validLocations.push({ x: x, y: y });
        }
      }
    }
  
    if (validLocations.length > 0) {
      //  Use the RNG to pick a random food position
      var pos = Phaser.Math.RND.pick(validLocations);
  
      //  And place it
      food.setPosition(pos.x * TILE_DIMENSION, pos.y * TILE_DIMENSION);
  
      return true;
    } else {
      return false;
    }
  }

  handleSwipe(e) {
    // move the snake by swipes
    var swipeTime = e.upTime - e.downTime; // calc swipe time
    var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
    var fastEnough = swipeTime < gameConfig.swipeSettings.swipeMaxTime;
    var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe); // length of the Geom.Point object swipe
    var longEnough = swipeMagnitude > gameConfig.swipeSettings.swipeMinDistance;
  
    if (fastEnough && longEnough) {
      // now, need to check direction
      Phaser.Geom.Point.SetMagnitude(swipe, 1); // normalize the swipe vector
      if (swipe.x > gameConfig.swipeSettings.swipeMinNormal) {
        snake.faceRight();
      }
      if (swipe.x < -gameConfig.swipeSettings.swipeMinNormal) {
        snake.faceLeft();
      }
      if (swipe.y > gameConfig.swipeSettings.swipeMinNormal) {
        snake.faceDown();
      }
      if (swipe.y < -gameConfig.swipeSettings.swipeMinNormal) {
        snake.faceUp();
      }
    }
  }
}

// game over scene
class gameover extends Phaser.Scene {
  constructor() {
    super("GameOver");
  }

  create() {
    console.log("game over scene reached");

    // console.log("test if gameConfig is accessed: ");
    // var test = gameConfig.width;
    // console.log(test);

    this.showMessageBox(
      "Game Over! \nYour final score is: \n" + snake.length,
      gameConfig.width,
      gameConfig.height
    );
  }

  showMessageBox(text, w, h) {
   
    // remove in case already exists
    // https://newdocs.phaser.io/docs/3.70.0/Phaser.GameObjects.Group#clear
    // if (this.msgBox) {
    //   this.msgBox.clear(true, true);
    // }

    //make a group to hold all the elements
    var msgBox = this.add.group();

    //make the back of the message box
    var back = this.add.sprite(
      gameConfig.width / 2,
      gameConfig.height / 2,
      "boxBack"
    );
    //make the close button
    var closeButton = this.add.sprite(
      gameConfig.width / 2,
      gameConfig.height / 2,
      "closeButton"
    );
    //make a text field
    var text1 = this.add.text(
      gameConfig.width / 2,
      gameConfig.height / 2 + 10,
      text
    );

    //set the textfeild to align to middle, and wrap if the text is too long
    var gameOverTextStyle = {
      // https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.GameObjects.Text.TextStyle
      align: "center",
      color: "#656B00",
      wordWrapWidth: w * 0.9,
    };

    text1.setStyle(gameOverTextStyle);

    //set the width and height passed
    //in the parameters
    back.width = w;
    back.height = h;

    closeButton.width = w / 2;
    closeButton.height = h / 10;
    //
    //
    //
    //add the elements to the group
    msgBox.add(back);
    msgBox.add(closeButton);
    msgBox.add(text1);
    //
    //set the close button
    //in the center horizontally
    //and near the bottom of the box vertically
    closeButton.x = w / 2;
    closeButton.y = h / 2 + closeButton.height * 2;
    //enable the button for input
    closeButton.setInteractive();
    //add a listener to destroy the box when the button is pressed
    closeButton.on(
      "pointerdown",
      function () {
        this.hideBox();
      },
      this
    );
    //
    //
    //set the message box in the center of the screen
    msgBox.x = gameConfig.width / 2 - msgBox.width / 2;
    msgBox.y = gameConfig.height / 2 - msgBox.height / 2;
    //
    //set the text in the middle of the message box
    text1.x = back.width / 2 - text1.width / 2;
    text1.y = back.height / 2 - text1.height / 2;
    //make a state reference to the messsage box
    this.msgBox = msgBox;
  }

  hideBox() {
    this.msgBox.clear(true, true);

    // try to restart the scene
    console.log(this);
    this.scene.start('PlayGame');
  }
}

var gameConfig = {
  type: Phaser.AUTO,
  // the game grid, translated to pixels
  width: widthInBlocks * TILE_DIMENSION,
  height: heightInBlocks * TILE_DIMENSION,
  backgroundColor: CANVAS_COLOR,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "thegame", // div tag in index.html
  },
  scene: [
    gamestart,
    playgame,
    gameover,
  ],
  swipeSettings: {
    swipeMaxTime: 1000, // otherwise it's a drag
    swipeMinDistance: 20, // otherwise it's a click
    swipeMinNormal: 0.85, // normalized vector length at least 0.85, i.e. not too diagonal
  },
};

window.onload = function() {
  console.log("this");
  game = new Phaser.Game(gameConfig);
  window.focus();
}

