const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20; // 每个方块的大小
let snake = [{x: 9, y: 9}];
let food = randomFood();
let direction = 'RIGHT';
let score = 0;
let game;
let changingDirection = false;

document.addEventListener('keydown', changeDirection);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // 绘制蛇
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? '#339933' : '#66bb66';
        ctx.fillRect(snake[i].x * box, snake[i].y * box, box, box);
        ctx.strokeStyle = '#fff';
        ctx.strokeRect(snake[i].x * box, snake[i].y * box, box, box);
    }
    // 绘制食物
    ctx.fillStyle = '#ff3333';
    ctx.fillRect(food.x * box, food.y * box, box, box);

    // 移动蛇
    let head = {x: snake[0].x, y: snake[0].y};
    if (direction === 'LEFT') head.x--;
    if (direction === 'RIGHT') head.x++;
    if (direction === 'UP') head.y--;
    if (direction === 'DOWN') head.y++;

    // 撞墙或撞到自己则游戏结束
    if (head.x < 0 || head.x >= canvas.width / box || head.y < 0 || head.y >= canvas.height / box || collision(head, snake)) {
        clearInterval(game);
        alert('游戏结束！你的得分是：' + score);
        return;
    }

    // 吃到食物
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('score').innerText = '得分：' + score;
        food = randomFood();
    } else {
        snake.pop();
    }
    snake.unshift(head);
    changingDirection = false;
}

// 随机生成食物
function randomFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * (canvas.width / box));
        y = Math.floor(Math.random() * (canvas.height / box));
    } while (snake.some(segment => segment.x === x && segment.y === y));
    return {x, y};
}

// 判断是否撞到自己
function collision(head, snakeArr) {
    for (let i = 1; i < snakeArr.length; i++) {
        if (head.x === snakeArr[i].x && head.y === snakeArr[i].y) {
            return true;
        }
    }
    return false;
}

// 控制方向，防止反向
function changeDirection(event) {
    if (changingDirection) return;
    changingDirection = true;
    const key = event.keyCode;
    if (key === 37 && direction !== 'RIGHT') direction = 'LEFT';
    else if (key === 38 && direction !== 'DOWN') direction = 'UP';
    else if (key === 39 && direction !== 'LEFT') direction = 'RIGHT';
    else if (key === 40 && direction !== 'UP') direction = 'DOWN';
}

// 重新开始游戏
function restartGame() {
    snake = [{x: 9, y: 9}];
    direction = 'RIGHT';
    score = 0;
    document.getElementById('score').innerText = '得分：0';
    food = randomFood();
    clearInterval(game);
    game = setInterval(draw, 150);
}

restartGame();