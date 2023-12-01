// direction
const UP = 0;
const DOWN = 1;
const LEFT = 2;
const RIGHT = 3;

var gameOptions = {
  boardSize: {
    rows: 30,
    cols: 20,
  },
  gameAspectRatio: 16 / 9,
  gameSpeed: 500, // "step" duration, in ms
  tileSize: 10,
  tileSpacing: 0,
  tileSpriteIndex: {
    SNAKEBODY: 0,
    SNAKEHEAD_UP: 1,
    SNAKEHEAD_DOWN: 2,
    SNAKEHEAD_LEFT: 3,
    SNAKEHEAD_RIGHT: 4,
    FOOD: 5,
    WALL: 6,
    EMPTY: 7,
  }
};

var interfaceOptions = {
  // containing options outside of the game grid
  backgroundColor: 0xfff0f0,
  borderSpacing: 20,
  bottomBanner: {
    height: 160,
    width: 200,
  },
  topHighScore: {
    height: 100,
    width: 200,
  },
  topRestartButton: {
    height: 100,
    width: 200,
  },
};

window.onload = function () {
  var gameWidth =
    interfaceOptions.borderSpacing * 2 +
    gameOptions.boardSize.cols * gameOptions.tileSize +
    (gameOptions.boardSize.cols - 1) * gameOptions.tileSpacing;
  var gameConfig = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      parent: "thegame", // div tag in index.html
      width: gameWidth,
      height: gameWidth * gameOptions.gameAspectRatio,
    },
    backgroundColor: interfaceOptions.backgroundColor,
    scene: [bootGame, playGame, gameOver],
  };

  game = new Phaser.Game(gameConfig);
  window.focus();
};

class bootGame extends Phaser.Scene {
  constructor() {
    super("BootGame");
  }

  preload() {
    this.load.image("emptytile", "assets/sprites/emptyTile.png");
    this.load.spritesheet("tiles", "assets/sprites/tilesSprite.png", {
      frameWidth: 50,
      frameHeight: 50,
    });
  }

  create() {
    this.scene.start("PlayGame");
  }
}

class playGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  create() {
    // boardArray[] is the array storing the actual board (reference frame), and can be accessed for deciding location of a tile
    this.boardArray = [];
    for (let i = 0; i < gameOptions.boardSize.rows; i++) {
      this.boardArray[i] = [];
      for (let j = 0; j < gameOptions.boardSize.cols; j++) {
        var tilePosition = this.getTilePosition(i, j);
        this.add.image(tilePosition.x, tilePosition.y, "emptytile");

        // add empty tiles to the board
        var tile = this.add.sprite(tilePosition.x, tilePosition.y, "tiles", gameOptions.tileSpriteIndex.EMPTY);
        this.boardArray[i][j] = {
          tileValue: 0, // meaning it's empty
          tileSprite: tile,
        };
      }
    }

    var Food = new Phaser.Class({
      // the food class
    })

    var Snake = new Phaser.Class({
      // the snake class
      initialize: function Snake(scene, x, y) {
        var body = this.add.sprite(tilePosition.x, tilePosition.y, "body", gameOptions.tileSpriteIndex.SNAKEBODY);
        this.headPosition = new Phaser.Geom.Point(x, y);
  
        this.body = scene.add.group();
  
        let sPos = getTilePosition(3,3); // starting position 
        this.head = this.body.create(getTilePosition(sPos.x,sPos.y, body));
        console.log(this.head)

        this.alive = true;
  
        this.speed = 100;
  
        this.moveTime = 0;
  
        this.tail = new Phaser.Geom.Point(x, y);
  
        this.heading = RIGHT;
        this.direction = RIGHT;
      },

      update: function (time) {
        if (time >= this.moveTime) {
          return this.move(time);
        }
      },

    })

    var food = new Food(this, 3,4);
    var snake = new Snake(this, 4,5);
  }

  update() {
  }

  getTilePosition(row, col) {
    // given a row/col index, get a Geom.Point object representing the position of the tile
    let posX =
      interfaceOptions.borderSpacing +
      gameOptions.tileSpacing * (col + 1) +
      gameOptions.tileSize * (col + 0.5);
    let posY =
      // TODO 顶部留空，这个回头改
      gameOptions.tileSize * 2 +
      gameOptions.tileSpacing * (row + 1) +
      gameOptions.tileSize * (row + 0.5);
    return new Phaser.Geom.Point(posX, posY);
  }
}

class gameOver extends Phaser.Scene {
  // under construction
  constructor() {
    super("GameOver");
  }

  create() {
    this.add.text(game.config.width / 2, game.config.height / 2, "Game Over", {
      fontSize: "64px",
      fill: "#000",
    });
  }
}
