import init, { World, Direction, GameStatus } from "snake-game";
import { rnd } from "../utils/rnd";
// wasm.greet("Rudra") can't work because wasm functions don't take a string as an argument they can
// only work with numbers and pointers to memory

// (async () => {
// const wasm = await init();
// wasm.greet("Rudra");
// })();

enum KEYS {
  ARROW_UP = "ArrowUp",
  ARROW_DOWN = "ArrowDown",
  ARROW_LEFT = "ArrowLeft",
  ARROW_RIGHT = "ArrowRight",
  KEY_W = "KeyW",
  KEY_S = "KeyS",
  KEY_A = "KeyA",
  KEY_D = "KeyD",
}

init().then((wasm) => {
  const CELL_SIZE = 30;
  const WORLD_WIDTH = 4;

  const snakeSpawnDirection = Direction.Right;
  const snakeSpawnIdx = rnd(WORLD_WIDTH * WORLD_WIDTH);

  const world = World.new(WORLD_WIDTH, snakeSpawnIdx, snakeSpawnDirection);
  const worldWidth = world.width();

  const points = <HTMLDivElement>document.getElementById("game-points");
  const gameStatus = <HTMLDivElement>document.getElementById("game-status");
  const gameControlBtn = <HTMLButtonElement>(
    document.getElementById("game-control-btn")
  );
  const canvas = <HTMLCanvasElement>document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = worldWidth * CELL_SIZE;
  canvas.height = worldWidth * CELL_SIZE;

  gameControlBtn.addEventListener("click", () => {
    const status = world.game_status();
    switch (status) {
      case GameStatus.Played:
      case GameStatus.Lost:
      case GameStatus.Won:
        location.reload();
        break;
      default:
        gameControlBtn.textContent = "Pause";
        gameControlBtn.classList.add("playing");
        world.start_game();
        play();
    }
  });

  document.addEventListener("keydown", (e) => {
    switch (e.code) {
      case KEYS.ARROW_UP:
      case KEYS.KEY_W:
        world.update_snake_direction(Direction.Up);
        break;
      case KEYS.ARROW_DOWN:
      case KEYS.KEY_S:
        world.update_snake_direction(Direction.Down);
        break;
      case KEYS.ARROW_LEFT:
      case KEYS.KEY_A:
        world.update_snake_direction(Direction.Left);
        break;
      case KEYS.ARROW_RIGHT:
      case KEYS.KEY_D:
        world.update_snake_direction(Direction.Right);
        break;
      default:
        break;
    }
  });

  function drawWorld() {
    ctx.beginPath();
    for (let x = 0; x < worldWidth + 1; x++) {
      ctx.moveTo(CELL_SIZE * x, 0);
      ctx.lineTo(CELL_SIZE * x, worldWidth * CELL_SIZE);
    }

    // move to the yth rosw increasing Mat(i,j) where i=y and then move from j=0 to j= worldWidth*CELL_SIZE
    //The move to and line to takes the (x,y) as arguement so x is denoted here to be worldWidth*CELL_SIZE
    // The same happends for columns above where x is used to draw the grid's columns and x moves in the x directions and lines to the bottom of the grid

    for (let y = 0; y < worldWidth + 1; y++) {
      ctx.moveTo(0, CELL_SIZE * y);
      ctx.lineTo(worldWidth * CELL_SIZE, CELL_SIZE * y);
    }

    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawReward() {
    const rewardIdx = world.reward_cell();
    const col = rewardIdx % worldWidth;
    const row = Math.floor(rewardIdx / worldWidth);

    ctx.beginPath();
    ctx.fillStyle = "#f00";

    // provide four positions a,b,c,d for the rectangle
    ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);

    ctx.stroke();
  }

  function drawSnake() {
    const snakeCellPtr = world.snake_cells();
    const snakeLen = world.snake_length();

    const snakeCells = new Uint32Array(
      wasm.memory.buffer,
      snakeCellPtr,
      snakeLen
    );

    ctx.beginPath();

    snakeCells
      .filter((cellIdx, i) => !(i > 0 && cellIdx == snakeCells[0]))
      .forEach((cellIdx, i) => {
        const col = cellIdx % worldWidth;
        const row = Math.floor(cellIdx / worldWidth);

        ctx.fillStyle = i === 0 ? "#7878DB" : "#000";
        // provide four positions a,b,c,d for the rectangle
        ctx.fillRect(col * CELL_SIZE, row * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      });

    ctx.stroke();
  }

  function drawGameStatus() {
    gameStatus.textContent = world.game_status_text();
    points.textContent = world.points().toString();
  }

  function paint() {
    drawWorld();
    drawSnake();
    drawReward();
    drawGameStatus();
  }

  function play() {
    const status = world.game_status();
    if (status === GameStatus.Won || status === GameStatus.Lost) {
      gameControlBtn.classList.remove("playing");
      gameControlBtn.textContent = "Restart";
      return;
    }

    const fps = 2;
    setTimeout(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      world.step();
      paint();
      // requesting the update function before next animation frame and the repaint to be smooth
      requestAnimationFrame(play);
    }, 1000 / fps);
  }

  paint();
});
