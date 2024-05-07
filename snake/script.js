// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

// Modal functionality
let modal = document.getElementById("helpModal");
let btn = document.getElementById("helpBtn");
let span = document.getElementsByClassName("closeBtn")[0];

// the sound for game over
const gameOverSound = new Audio('../sound/lost.wav');

// the sound for eating
const eatSound = new Audio('../sound/eat.wav');

// Define game variables
const gridSize = 20; // Size of the game grid
let snake = [{ x: 10, y: 10 }]; // Initial position of the snake
let food = generateFood(); // Position of the food
let highScore = 0; // High score initialization
let direction = 'right'; // Initial movement direction
let gameInterval; // Variable for the game loop interval
let gameSpeedDelay = 200; // Initial game speed
let gameStarted = false; // Flag to track if the game has started

// Function to draw the game map, snake, and food
function draw() {
    board.innerHTML = ''; // Clear the board
    drawSnake(); // Draw the snake on the board
    drawFood(); // Draw the food on the board
    updateScore(); // Update the score display
}

// Function to draw the snake
function drawSnake() {
    // Loop through each segment of the snake array
    snake.forEach((segment) => {
        // Create a new div element for each segment of the snake
        const snakeElement = createGameElement('div', 'snake');

        // Set the position of this div on the game board
        setPosition(snakeElement, segment);

        // Add the newly created and positioned div to the game board
        board.appendChild(snakeElement);
    });
}


// Function to create a game element (snake or food)
function createGameElement(tag, className) {
    // Create a new HTML element of the specified type
    const element = document.createElement(tag);

    // Assign the specified class name to the new element
    element.className = className;

    // Return the newly created element
    return element;
}


// Function to set the position of a game element
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Function to draw food
function drawFood() {
    // Check if the game has started
    if (gameStarted) {
        // Create a new div element for the food using the createGameElement function
        const foodElement = createGameElement('div', 'food');

        // Set the position of the food element on the game board
        setPosition(foodElement, food);

        // Add the food element to the game board
        board.appendChild(foodElement);
    }
}


// Function to generate a new food position
function generateFood() {
    // Generate a random x-coordinate within the grid
    const x = Math.floor(Math.random() * gridSize) + 1;

    // Generate a random y-coordinate within the grid
    const y = Math.floor(Math.random() * gridSize) + 1;

    // Return the coordinates as an object
    return { x, y };
}


// Function to move the snake
function move() {
    // Copy the head (first segment) of the snake
    const head = { ...snake[0] };

    // Update the head position based on the current direction
    switch (direction) {
        case 'up': head.y--; break;    // Move the head up
        case 'down': head.y++; break;  // Move the head down
        case 'left': head.x--; break;  // Move the head left
        case 'right': head.x++; break; // Move the head right
    }

    // Add the new head position to the front of the snake
    snake.unshift(head);

    // Check if the snake has eaten the food
    if (head.x === food.x && head.y === food.y) {
        playEatSound(); // Play the sound effect for eating food
        food = generateFood(); // Generate a new food position
        increaseSpeed(); // Increase the speed of the game

        // Reset and restart the game interval with the new speed
        clearInterval(gameInterval);
        gameInterval = setInterval(() => {
            move();            // Continue moving the snake
            checkCollision();  // Check for collisions
            draw();            // Redraw the game elements
        }, gameSpeedDelay);
    } else {
        // If the food is not eaten, remove the last segment of the snake
        snake.pop();
    }
}


// Function to start the game
function startGame() {
    gameStarted = true; // Set game as started
    // Hide the instruction text and logo
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    // Start the game interval for movement and drawing
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Event listener for keypresses
function handleKeyPress(event) {
    // Start the game on spacebar press
    if ((!gameStarted && event.code === 'Space') || (!gameStarted && event.key === ' ')) {
        startGame();
    } else {
        // Change direction based on arrow key input
        switch (event.key) {
            case 'ArrowUp': direction = 'up'; break;
            case 'ArrowDown': direction = 'down'; break;
            case 'ArrowLeft': direction = 'left'; break;
            case 'ArrowRight': direction = 'right'; break;
        }
    }
}

// Attach the event listener to the document
document.addEventListener('keydown', handleKeyPress);

// Function to increase the game speed
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

// Function to check for collisions
function checkCollision() {
    // Get the current position of the snake's head
    const head = snake[0];

    // Check if the snake hits the wall
    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) {
        resetGame(); // Call resetGame function if the snake hits the wall
    }

    // Check if the snake hits itself
    for (let i = 1; i < snake.length; i++) {
        // Check if the head's coordinates match any other segment's coordinates
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame(); // Call resetGame function if the snake collides with itself
        }
    }
}


// Function to reset the game
function resetGame() {
    gameOverSound.play().catch(error => console.error("Error playing the sound: ", error)); // Play game over sound
    updateHighScore(); // Update the high score
    stopGame(); // Stop the game
    // Reset game variables
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore(); // Update the score display
}

// Function to update the score display
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

// Function to stop the game
function stopGame() {
    clearInterval(gameInterval); // Clear the game interval
    gameStarted = false; // Set game as not started
    // Show the instruction text and logo
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

// Function to update the high score
function updateHighScore() {
    // Calculate the current score based on the length of the snake
    const currentScore = snake.length - 1;

    // Check if the current score is greater than the recorded high score
    if (currentScore > highScore) {
        // Update the high score with the current score
        highScore = currentScore;

        // Update the high score display on the webpage
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }

    // Make the high score text visible on the webpage
    highScoreText.style.display = 'block';
}


// Function to play the eating sound
function playEatSound() {
    if (!eatSound.paused) {
        eatSound.pause(); // Pause the current sound
        eatSound.currentTime = 0; // Reset the time
    }
    eatSound.play().catch(error => console.error("Error playing the sound: ", error));
}



// Open the modal on button click
btn.onclick = function() {
    modal.style.display = "block";
}

// Close the modal on clicking the 'x'
span.onclick = function() {
    modal.style.display = "none";
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}
