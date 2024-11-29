width = 200; // Multiple of 100
height = 200; // Multiple of 100
size = 10;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = width;
canvas.height = height;

class Snake {
  constructor() {
    this.body = [{ x: width / 2, y: height / 2 }];
    this.direction;
    this.move = false;
    this.apple;
  }

  draw() {
    this.body.forEach((part) => {
      ctx.fillStyle = 'green';
      ctx.fillRect(part.x, part.y, size, size);
    });
  }

  cleanRect() {
    this.body.forEach((part) => {
      ctx.clearRect(part.x, part.y, size, size);
    });
  }

  detectCollision(coord1, coord2) {
    if (coord1.x === coord2.x && coord1.y === coord2.y) return true;
    return false;
  }

  changeDirection(newDirection) {
    this.direction = newDirection;
    this.body[0].dir = newDirection;
    if (!this.move) {
      this.move = true;
      this.generateApple();
    }
  }

  checkApple(newHead) {
    const appleCollision = !this.apple
      ? false
      : this.detectCollision(newHead, this.apple);
    if (appleCollision) this.generateApple();
    if (!appleCollision) this.body.pop();
  }

  checkWalls(newHead) {
    if (newHead.x >= width || newHead.x < 0) {
      return this.endGame();
    } else if (newHead.y >= height || newHead.y < 0) {
      return this.endGame();
    }
    return false;
  }

  endGame() {
    this.direction = undefined;
    this.move = false;
    alert(`Game Over... Your score: ${this.body.length}`);
    this.body = [{ x: 100, y: 100 }];
    this.cleanRect();
    ctx.clearRect(this.apple.x, this.apple.y, size, size);
    this.draw();
    return true;
  }

  moveSnake() {
    if (this.move) {
      this.cleanRect();
      const newHead = {
        x:
          this.body[0].x +
          size * (this.direction === 1) +
          -size * (this.direction === 3),
        y:
          this.body[0].y +
          size * (this.direction === 2) +
          -size * (this.direction === 0),
      };
      this.checkApple(newHead);
      const endGame = this.checkWalls(newHead);
      if (!endGame) {
        this.body.unshift(newHead);
        this.draw();
        if (
          this.body[0].x === this.apple.x &&
          this.body[0].y === this.apple.y
        ) {
          this.eat();
        }
      }
    }
  }

  generateApple() {
    if (this.apple) {
      ctx.clearRect(this.apple.x, this.apple.y, size, size);
    }
    let newCoord = {
      x: Math.floor((Math.random() / 10) * width) * 10,
      y: Math.floor((Math.random() / 10) * height) * 10,
    };
    let found = false;
    this.body.forEach((part) => (found = this.detectCollision(part, newCoord)));
    if (!found) {
      ctx.fillStyle = 'red';
      ctx.fillRect(newCoord.x, newCoord.y, size, size);
      this.apple = newCoord;
    } else {
      this.generateApple();
    }
  }
}

const snake = new Snake();
snake.draw();

document.addEventListener('keydown', function (event) {
  if ((event.keyCode == 37) & (snake.direction !== 1)) {
    snake.changeDirection(3); // left
  } else if ((event.keyCode == 39) & (snake.direction !== 3)) {
    snake.changeDirection(1); // right
  } else if ((event.keyCode == 40) & (snake.direction !== 0)) {
    snake.changeDirection(2); // down
  } else if ((event.keyCode == 38) & (snake.direction !== 2)) {
    snake.changeDirection(0); // up
  }
});
setInterval(() => snake.moveSnake(), 125);
