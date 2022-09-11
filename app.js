const game = {
  intervalId: "",
  intervalLen: 400,
  state: {
    paused: false,
    score: 0,
  },
};

const snake = {
  dir: "",
  prevLast: { x: 0, y: 0 },
  segments: [],
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
  },
  getHead() {
    return this.segments[0];
  },
  refresh() {
    for (const elem of this.segments) {
      elem.domRef.style.left = elem.x + "px";
      elem.domRef.style.bottom = elem.y + "px";
    }
  },
  reset() {
    this.dir = "";
    for (const seg of this.segments) {
      seg.domRef.remove();
    }
    this.segments = [];
  },
};

const fruit = {
  x: 0,
  y: 0,
  domRef: document.querySelector(".fruit"),
  hide() {
    this.domRef.classList.add("hidden");
  },
  placeRandom() {
    const { x, y } = getRandomCoord();

    // set coordinates
    this.x = x;
    this.y = y;

    // update on grid
    this.domRef.style.left = fruit.x + "px";
    this.domRef.style.bottom = fruit.y + "px";

    // randomize image
    const randNum = Math.ceil(Math.random() * 9);
    this.domRef.style["background-image"] = `url("img/fruit-${randNum}.png")`;
  },
  show() {
    this.domRef.classList.remove("hidden");
  },
};

function getRandomCoord() {
  const x = Math.ceil(Math.random() * 19) * 20;
  const y = Math.ceil(Math.random() * 19) * 20;
  return { x, y };
}

document.addEventListener("keydown", (e) => {
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
      togglePause();
      break;
  }
});

const startBtn = document.querySelector(".start-btn");
startBtn.addEventListener("click", () => {
  toggleGridOverlay();
  startGame();
});

function togglePause() {
  if (game.state.paused) {
    game.state.paused = false;
    game.intervalId = setInterval(updateGame, game.intervalLen);
  } else {
    game.state.paused = true;
    clearInterval(game.intervalId);
  }
}

function toggleGridOverlay() {
  document.querySelector(".grid-overlay").classList.toggle("hidden");
}

function startGame() {
  snake.addNewSegment();
  snake.refresh();
  fruit.placeRandom();
  fruit.show();
  game.intervalId = setInterval(updateGame, game.intervalLen);
}

function updateGame() {
  // save coordinates of last seg BEFORE updating
  const currLast = snake.segments.length - 1;
  snake.prevLast.x = snake.segments[currLast].x;
  snake.prevLast.y = snake.segments[currLast].y;

  // update snake segments back-to-front
  for (let i = currLast; i >= 0; i--) {
    if (i > 0) {
      snake.segments[i].x = snake.segments[i - 1].x;
      snake.segments[i].y = snake.segments[i - 1].y;
    } else {
      // manually update head
      switch (snake.dir) {
        case "u":
          snake.segments[i].y += 20;
          break;
        case "l":
          snake.segments[i].x -= 20;
          break;
        case "d":
          snake.segments[i].y -= 20;
          break;
        case "r":
          snake.segments[i].x += 20;
          break;
      }
    }
  }

  if (hasEatenFruit()) {
    fruit.placeRandom();

    snake.addNewSegment();
    snake.refresh();

    game.state.score += 1;
    updateScore(game.state.score);
  } else if (isOutOfBounds() || hasSelfCollided()) {
    clearInterval(game.intervalId); // end game

    game.state.score = 0;
    updateScore(game.state.score);

    snake.reset();
    fruit.hide();

    prepGameOverPrompt();
    toggleGridOverlay(); // display game over prompt
  } else {
    snake.refresh();
  }
}

function hasEatenFruit() {
  const head = snake.getHead();
  return head.x === fruit.x && head.y === fruit.y;
}

function updateScore(score) {
  document.querySelector(".score").textContent = `Score: ${score}`;
}

function isOutOfBounds() {
  const head = snake.getHead();
  return head.x < 0 || head.x > 480 || head.y < 0 || head.y > 480;
}

function hasSelfCollided() {
  const head = snake.getHead();
  // compare every tail segment to head & check that none match
  return snake.segments
    .slice(1)
    .some((seg) => seg.x === head.x && seg.y === head.y);
}

function prepGameOverPrompt() {
  document.querySelector(".grid-overlay .text").textContent = "Game Over";
  document.querySelector(".start-btn").value = "Play Again?";
}
