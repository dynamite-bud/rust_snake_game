import init, { World } from "snake-game";

// wasm.greet("Rudra") can't work because wasm functions don't take a string as an argument they can
// only work with numbers and pointers to memory

// (async () => {
// const wasm = await init();
// wasm.greet("Rudra");
// })();

init().then(() => {
  const CELL_SIZE = 30;

  const world = World.new();
  const worldWidth = world.width();

  const canvas = document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");

  canvas.width = worldWidth * CELL_SIZE;
  canvas.height = worldWidth * CELL_SIZE;

  function drawWorld() {
    ctx.beginPath();

    for (let x = 0; x < worldWidth + 1; x++) {
      ctx.moveTo(CELL_SIZE * x, 0);
      ctx.lineTo(CELL_SIZE * x, worldWidth * CELL_SIZE);
    }

    // move to the yth row increasing Mat(i,j) where i=y and then move from j=0 to j= worldWidth*CELL_SIZE
    //The move to and line to takes the (x,y) as arguement so x is denoted here to be worldWidth*CELL_SIZE
    // The same happends for columns above where x is used to draw the grid's columns and x moves in the x directions and lines to the bottom of the grid

    for (let y = 0; y < worldWidth + 1; y++) {
      ctx.moveTo(0, CELL_SIZE * y);
      ctx.lineTo(worldWidth * CELL_SIZE, CELL_SIZE * y);
    }

    ctx.lineWidth = 2;

    ctx.stroke();
  }

  function drawSnake() {
    const snakeIdx = world.snake_head_idx();
  }

  drawWorld();
});
