import init, { World } from "snake-game";

// wasm.greet("Rudra") can't work because wasm functions don't take a string as an argument they can
// only work with numbers and pointers to memory

// (async () => {
// const wasm = await init();
// wasm.greet("Rudra");
// })();

init().then(() => {
  const world = World.new();
  const canvas = document.getElementById("snake-canvas");
  const ctx = canvas.getContext("2d");
  debugger;
});
