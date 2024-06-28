const startBtn = document.querySelector('#start');
const resetBtn = document.querySelector('#reset');
const submitBtn = document.querySelector('#submit');
const ballsNumberInput = document.querySelector('#ballsNumber');
const distanceInput = document.querySelector('#distance');
const offCheckbox = document.querySelector('#off');
const attractionCheckbox = document.querySelector('#attraction');
const repulsionCheckbox = document.querySelector('#repulsion');

let numberOfBalls = 0;
let ballsContainer = [];
const Y = 20;

let intervalId = null;
let attractionForce = 0.1;
let repulsionForce = 0.1;

const rand = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const animationWindow = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = window.innerWidth - 20;
        this.canvas.height = window.innerHeight - 100;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    }
}

function component() {
    this.x = rand(0, animationWindow.canvas.width - 20);
    this.y = rand(0, animationWindow.canvas.height - 20);
    this.dirX = Math.random() < 0.5 ? -1 : 1;
    this.dirY = Math.random() < 0.5 ? -1 : 1;
    this.radius = 10;
    this.speed = rand(1, 3);

    this.drawElement = function() {
        const ctx = animationWindow.context;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "#28a745";
        ctx.fill();
    }

    this.drawLine = function(otherobj) {
        var dx = this.x - otherobj.x;
        var dy = this.y - otherobj.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if(distance < animationWindow.canvas.height * (Y / 100)) {
            const ctx = animationWindow.context;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(otherobj.x, otherobj.y);
            ctx.strokeStyle = '#ffc107';
            ctx.stroke();
        }
    }

    this.attractionForce = function(mouseX, mouseY) {
        var dx = mouseX - this.x;
        var dy = mouseY - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) { 
            var attractionX =  dx / (2 * distance) * attractionForce;
            var attractionY =  dy / (2 * distance) * attractionForce;
            this.dirX += attractionX;
            this.dirY += attractionY;
        }
    }

    this.repulsionForce = function(mouseX, mouseY) {
        var dx = mouseX - this.x;
        var dy = mouseY - this.y;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 120) { 
            var repulsionX = dx / distance * repulsionForce;
            var repulsionY = dy / distance * repulsionForce;
            this.dirX -= repulsionX; 
            this.dirY -= repulsionY;
        }
    }
}

animationWindow.canvas.addEventListener('mousemove', function(event) {
    const mouseX = event.clientX - animationWindow.canvas.offsetLeft;
    const mouseY = event.clientY - animationWindow.canvas.offsetTop;
    
    if (repulsionCheckbox.checked) {
        ballsContainer.forEach(ball => {
            ball.repulsionForce(mouseX, mouseY);
        });
    }

    if (attractionCheckbox.checked) {
        ballsContainer.forEach(ball => {
            ball.attractionForce(mouseX, mouseY);
        });
    }
});


animationWindow.canvas.addEventListener('click', function(event) {
    const mouseX = event.clientX - animationWindow.canvas.offsetLeft;
    const mouseY = event.clientY - animationWindow.canvas.offsetTop;

    for (let i = ballsContainer.length - 1; i >= 0; i--) {
        const ball = ballsContainer[i];
        var dx = ball.x - mouseX;
        var dy = ball.y - mouseY;
        var distance = Math.sqrt(dx * dx + dy * dy);
        if (distance <= ball.radius) {
            ballsContainer.splice(i, 1);
            const ball1 = new component();
            const ball2 = new component();
            ballsContainer.push(ball1, ball2);
            break;
        }
    }
});

startBtn.addEventListener('click', () => {
    clearInterval(intervalId);
    start();
});

resetBtn.addEventListener('click', () => {
    numberOfBalls = 0;
    ballsContainer = [];
    animationWindow.context.clearRect(0, 0, animationWindow.canvas.width, animationWindow.canvas.height);
    clearInterval(intervalId);
    intervalId = null; 
    alert("Set the data again because it was cleared after reset.");
});

submitBtn.addEventListener('click', () => {
    const number = parseInt(ballsNumberInput.value, 10);
    if (isNaN(number)) {
        alert("Not a number");
    } else {
        numberOfBalls = number;
    }
});

function start() {
    animationWindow.start();
    fillContainer();
    intervalId = setInterval(draw, 1000 / 60); 
}

function fillContainer() {
    ballsContainer = [];
    for (let i = 0; i < numberOfBalls; i++) {
        const ball = new component();
        ballsContainer.push(ball);
    }
}

function linesSetter() {
    for(let i = 0; i < ballsContainer.length - 1; i++) {
        for(let j = i + 1; j < ballsContainer.length; j++) {
            ballsContainer[i].drawLine(ballsContainer[j]);
        }
    }
}

function draw() {
    animationWindow.context.clearRect(0, 0, animationWindow.canvas.width, animationWindow.canvas.height); 
    linesSetter();
    for (const ball of ballsContainer) {
        ball.x += ball.dirX * ball.speed;
        ball.y += ball.dirY * ball.speed;

        if (ball.x - ball.radius < 0) { ball.dirX = 1; }
        if (ball.x + ball.radius > animationWindow.canvas.width) { ball.dirX = -1; }
        if (ball.y - ball.radius < 0) { ball.dirY = 1; }
        if (ball.y + ball.radius > animationWindow.canvas.height) { ball.dirY = -1; }
        ball.drawElement();
    }
}

offCheckbox.addEventListener('change', () => {
    if (offCheckbox.checked) {
        attractionCheckbox.checked = false;
        repulsionCheckbox.checked = false;
    }
});

attractionCheckbox.addEventListener('change', () => {
    if (attractionCheckbox.checked) {
        offCheckbox.checked = false;
        repulsionCheckbox.checked = false;
    }
});

repulsionCheckbox.addEventListener('change', () => {
    if (repulsionCheckbox.checked) {
        offCheckbox.checked = false;
        attractionCheckbox.checked = false;
    }
});
