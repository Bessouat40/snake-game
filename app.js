width = 600; // Multiple of 100
height = 600; // Multiple of 100
size = 20;
time = 125;

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

  checkEndGame(newHead) {
    if (newHead.x >= width || newHead.x < 0) {
      return this.endGame();
    } else if (newHead.y >= height || newHead.y < 0) {
      return this.endGame();
    }
    let bodyCollision = false;
    this.body.map(
      (part) =>
        (bodyCollision = this.detectCollision(part, newHead) || bodyCollision)
    );
    if (bodyCollision) return this.endGame();
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

  getNewHead() {
    const { x, y } = this.body[0];
    switch (this.direction) {
      case 0:
        return { x, y: y - size };
      case 1:
        return { x: x + size, y };
      case 2:
        return { x, y: y + size };
      case 3:
        return { x: x - size, y };
      default:
        return this.body[0];
    }
  }

  moveSnake() {
    if (!this.move) return;
    this.cleanRect();
    const newHead = this.getNewHead();
    this.checkApple(newHead);
    const endGame = this.checkEndGame(newHead);
    if (endGame) return;
    this.body.unshift(newHead);
    this.draw();
    if (this.body[0].x === this.apple.x && this.body[0].y === this.apple.y) {
      this.eat();
    }
  }

  generateApple() {
    if (this.apple) {
      ctx.clearRect(this.apple.x, this.apple.y, size, size);
    }
    let newCoord = {
      x: Math.floor((Math.random() / size) * width) * size,
      y: Math.floor((Math.random() / size) * height) * size,
    };
    let found = false;
    this.body.forEach(
      (part) => (found = this.detectCollision(part, newCoord)) || found
    );
    if (found) {
      this.generateApple();
    } else {
      ctx.fillStyle = 'red';
      ctx.fillRect(newCoord.x, newCoord.y, size, size);
      this.apple = newCoord;
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
setInterval(() => snake.moveSnake(), time);
