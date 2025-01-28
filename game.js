import { database, ref, set, get } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";
    import { database } from "./firebase-config.js";

    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 320;
    canvas.height = 480;

    const bird = {
      x: 50,
      y: 150,
      width: 34,
      height: 24,
      gravity: 0.25,
      lift: -10,
      velocity: 0
    };

    const pipes = [];
    const gap = 85;
    const pipeWidth = 52;
    const pipeVelocity = 2;

    let score = 0;
    let highScore = 0;
    let gameOver = false;

    function drawBird() {
      ctx.fillStyle = 'yellow';
      ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    }

    function updateBird() {
      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      if (bird.y + bird.height > canvas.height) {
        bird.y = canvas.height - bird.height;
        bird.velocity = 0;
        gameOver = true;
      }

      if (bird.y < 0) {
        bird.y = 0;
        bird.velocity = 0;
      }
    }

    function drawPipes() {
      pipes.forEach(pipe => {
        ctx.fillStyle = 'green';
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.height);
        ctx.fillRect(pipe.x, pipe.height + gap, pipeWidth, canvas.height - pipe.height - gap);
      });
    }

    function updatePipes() {
      if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        const height = Math.floor(Math.random() * (canvas.height - gap - 100)) + 50;
        pipes.push({
          x: canvas.width,
          height: height,
          passed: false
        });
      }

      for (let i = 0; i < pipes.length; i++) {
        pipes[i].x -= pipeVelocity;

        if (pipes[i].x + pipeWidth < 0) {
          pipes.splice(i, 1);
        }

        if (bird.x + bird.width > pipes[i].x && bird.x < pipes[i].x + pipeWidth) {
          if (bird.y < pipes[i].height || bird.y + bird.height > pipes[i].height + gap) {
            gameOver = true;
          }

          if (!pipes[i].passed && bird.x > pipes[i].x + pipeWidth / 2) {
            score++;
            pipes[i].passed = true;
          }
        }
      }
    }

    function drawScore() {
      ctx.fillStyle = 'white';
      ctx.font = '20px Arial';
      ctx.fillText('Score: ' + score, 10, 30);
      ctx.fillText('High Score: ' + highScore, 10, 60);
    }

    function checkHighScore() {
      get(ref(database, 'highScore')).then((snapshot) => {
        const data = snapshot.val();
        if (data === null || score > data) {
          set(ref(database, 'highScore'), score);
          highScore = score;
        } else {
          highScore = data;
        }
      });
    }

    function gameLoop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBird();
      updateBird();
      drawPipes();
      updatePipes();
      drawScore();

      if (!gameOver) {
        requestAnimationFrame(gameLoop);
      } else {
        checkHighScore();
        ctx.fillStyle = 'red';
        ctx.font = '40px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 80, canvas.height / 2);
      }
    }

    function resetGame() {
      bird.y = 150;
      bird.velocity = 0;
      pipes.length = 0;
      score = 0;
      gameOver = false;
      gameLoop();
    }

    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && !gameOver) {
        bird.velocity = bird.lift;
      } else if (e.code === 'Space' && gameOver) {
        resetGame();
      }
    });

    gameLoop();
