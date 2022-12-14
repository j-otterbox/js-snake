class Game {
  constructor() {
    this.intervalId = "";
    this.intervalLen = 400;
    this.state = {
      paused: false,
      score: 0,
    };
  }
}

class Snake {
  constructor() {
    this.dir = "";
    this.prevLast = { x: 0, y: 0 };
    this.segments = [];
  }

  addNewSegment() {
    const elem = document.createElement("div");
    elem.classList.add("snake");

    const newSegment = { x: 0, y: 0, domRef: elem };

    if (this.segments.length === 0) {
      // init new snake
      const { x, y } = getRandomCoord();
      newSegment.x = x;
      newSegment.y = y;
      newSegment.domRef.classList.add("head");
    } else {
      // add seg to curr snake
      newSegment.x = this.prevLast.x;
      newSegment.y = this.prevLast.y;
      newSegment.domRef.classList.add("tail");
    }

    this.segments.push(newSegment);
    document.querySelector(".grid").appendChild(elem);
  }
  getHead() {
    return this.segments[0];
  }
  redraw() {
    for (const elem of this.segments) {
      elem.domRef.style.left = elem.x + "px";
      elem.domRef.style.bottom = elem.y + "px";
    }
  }
  reset() {
    this.dir = "";
    for (const seg of this.segments) {
      seg.domRef.remove();
    }
    this.segments = [];
  }
  move() {
    // save coordinates of last seg BEFORE updating
    const currLast = this.segments.length - 1;
    this.prevLast.x = this.segments[currLast].x;
    this.prevLast.y = this.segments[currLast].y;

    // update snake segments back-to-front
    for (let i = currLast; i >= 0; i--) {
      if (i > 0) {
        this.segments[i].x = this.segments[i - 1].x;
        this.segments[i].y = this.segments[i - 1].y;
      } else {
        // manually update head
        switch (this.dir) {
          case "u":
            this.segments[i].y += 20;
            break;
          case "l":
            this.segments[i].x -= 20;
            break;
          case "d":
            this.segments[i].y -= 20;
            break;
          case "r":
            this.segments[i].x += 20;
            break;
        }
      }
    }
  }
}

class Fruit {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.domRef = document.querySelector(".fruit");
  }

  hide() {
    this.domRef.classList.add("hidden");
  }
  placeRandom() {
    const { x, y } = getRandomCoord();

    // set coordinates
    this.x = x;
    this.y = y;

    // update on grid
    this.domRef.style.left = this.x + "px";
    this.domRef.style.bottom = this.y + "px";

    // randomize image
    const randNum = Math.ceil(Math.random() * 9);
    this.domRef.style["background-image"] = `url("img/fruit-${randNum}.png")`;
  }
  show() {
    this.domRef.classList.remove("hidden");
  }
}

const game = new Game();
const snake = new Snake();
const fruit = new Fruit();

function getRandomCoord() {
  const x = Math.ceil(Math.random() * 19) * 20;
  const y = Math.ceil(Math.random() * 19) * 20;
  return { x, y };
}

document.addEventListener("keydown", (e) =>
  keyDownHandler(e, game, fruit, snake)
);

function keyDownHandler(e, game, fruit, snake) {
  switch (e.key.toLowerCase()) {
    case "w":
    case "arrowup":
      snake.dir = "u";
      break;
    case "a":
    case "arrowleft":
      snake.dir = "l";
      break;
    case "s":
    case "arrowdown":
      snake.dir = "d";
      break;
    case "d":
    case "arrowright":
      snake.dir = "r";
      break;
    case "p":
      togglePause(game, fruit, snake);
      break;
  }
}

function togglePause(game, fruit, snake) {
  if (game.state.paused) {
    game.state.paused = false;
    game.intervalId = setInterval(
      () => updateGame(game, fruit, snake),
      game.intervalLen
    );
  } else {
    game.state.paused = true;
    clearInterval(game.intervalId);
  }
}

const startBtn = document.querySelector(".start-btn");
startBtn.addEventListener("click", () =>
  startBtnClickHandler(game, fruit, snake)
);

function startBtnClickHandler(game, fruit, snake) {
  toggleGridOverlay();
  startGame(game, fruit, snake);
}

function toggleGridOverlay() {
  document.querySelector(".grid-overlay").classList.toggle("hidden");
}

function startGame(game, fruit, snake) {
  snake.addNewSegment();
  snake.redraw();
  fruit.placeRandom();
  fruit.show();
  game.intervalId = setInterval(
    () => updateGame(game, fruit, snake),
    game.intervalLen
  );
}

function updateGame(game, fruit, snake) {
  snake.move();

  if (hasEatenFruit(snake)) {
    handleEatenFruit(game, fruit, snake);
  } else if (isOutOfBounds(snake) || hasSelfCollided(snake)) {
    handleCollision(game, fruit, snake);
  } else {
    snake.redraw();
  }
}

function hasEatenFruit(snake) {
  const head = snake.getHead();
  return head.x === fruit.x && head.y === fruit.y;
}

function handleEatenFruit(game, fruit, snake) {
  fruit.placeRandom();

  snake.addNewSegment();
  snake.redraw();

  game.state.score += 1;
  updateScore(game.state.score);
}

function updateScore(score) {
  document.querySelector(".score").textContent = `Score: ${score}`;
}

function isOutOfBounds(snake) {
  const head = snake.getHead();
  return head.x < 0 || head.x > 480 || head.y < 0 || head.y > 480;
}

function hasSelfCollided(snake) {
  const head = snake.getHead();
  // compare every tail segment to head & check that none match
  return snake.segments
    .slice(1)
    .some((seg) => seg.x === head.x && seg.y === head.y);
}

function handleCollision(game, fruit, snake) {
  clearInterval(game.intervalId); // end game

  game.state.score = 0;
  updateScore(game.state.score);

  snake.reset();
  fruit.hide();

  prepGameOverPrompt();
  toggleGridOverlay(); // display game over prompt
}

function prepGameOverPrompt() {
  document.querySelector(".grid-overlay .text").textContent = "Game Over";
  document.querySelector(".start-btn").value = "Play Again?";
}
