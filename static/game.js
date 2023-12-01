var gameOptions = {
  boardSize: {
    rows: 10,
    cols: 10,
  },
  gameAspectRatio: 16 / 9,
  tileSize: 50,
  tileSpacing: 0,
  tileSpriteIndex: {
    SNAKEBODY: 0,
    SNAKEBODY_UP: 1,
    SNAKEBODY_DOWN: 2,
    SNAKEBODY_LEFT: 3,
    SNAKEBODY_RIGHT: 4,
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
      parent: "thegame",
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
      frameWidth: gameOptions.tileSize,
      frameHeight: gameOptions.tileSize,
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
          tileValue: 0,
          tileSprite: tile,
        };
      }
    }
  }

  getTilePosition(row, col) {
    // given a row/col index, get a Geom.Point object representing the position of the tile
    let posX =
      interfaceOptions.borderSpacing +
      gameOptions.tileSpacing * (col + 1) +
      gameOptions.tileSize * (col + 0.5);
    let posY =
      // TODO 顶部留空300，这个回头改
      300 +
      interfaceOptions.borderSpacing +
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
