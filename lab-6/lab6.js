const leaderboard = document.querySelector('.leaderBoard');

var ball;
var targetBall;
var startTime;
let rectangles = [];

function startGame() {
    ball = new component("circle", Math.floor(Math.random() * 560) + 20, 20, null, null, "red", 20, 0, 2 * Math.PI, true);
    targetBall = new component("targetCircle", Math.floor(Math.random() * 560) + 20, 480, null, null, "black", 20, 0, 2 * Math.PI, false);
    rectangles = [
        new component("rectangle", 50, 50, 100, 100, "green"),
        new component("rectangle", 200, 150, 80, 120, "green"),
        new component("rectangle", 400, 250, 120, 80, "green"),
        new component("rectangle", 100, 350, 150, 100, "green"),
        new component("rectangle", 450, 50, 100, 150, "green"),
        new component("rectangle", 250, 50, 120, 80, "green"),
        new component("rectangle", 50, 250, 100, 120, "green"),
        new component("rectangle", 350, 350, 80, 100, "green")
    ];

    myGameArea.start();
    startTime = Date.now();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 600;
        this.canvas.height = 500;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 7);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function(){
        clearInterval(this.interval);
    }
}

function component(type, x, y, width, height, color, radius, startAngle, endAngle, canMove) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.canMove = canMove;
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.speedX = 0;
    this.speedY = 0;
    this.color = color;

    this.update = function () {
        ctx = myGameArea.context;
        ctx.fillStyle = this.color;

        if (this.type === "circle" || this.type === "targetCircle") {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle);
            ctx.fill();
        }
        else if (this.type === "rectangle") {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    this.newPos = function () {
        if(this.canMove){
            this.x += this.speedX;
            this.y += this.speedY;
        }
        for (let i = 0; i < rectangles.length; i++) {
            if (this.crashWith(rectangles[i])) {
                this.x -= this.speedX;
                this.y -= this.speedY;
                this.speedX = 0;
                this.speedY = 0;
            }
        }

        if (this.x - this.radius < 0) {
            this.x = this.radius;
        }
        if (this.x + this.radius > myGameArea.canvas.width) {
            this.x = myGameArea.canvas.width - this.radius;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
        }
        if (this.y + this.radius > myGameArea.canvas.height) {
            this.y = myGameArea.canvas.height - this.radius;
        }
    }

    this.crashWith = function (otherobj) {
        if (otherobj.type === "circle" || otherobj.type === "targetCircle") {
            var dx = this.x - otherobj.x;
            var dy = this.y - otherobj.y;
            var distance = Math.sqrt(dx * dx + dy * dy);

            return distance < this.radius + otherobj.radius;
        }
        else if (otherobj.type === "rectangle") {
            
            var ballLeft = this.x - this.radius;
            var ballRight = this.x + this.radius;
            var ballTop = this.y - this.radius;
            var ballBottom = this.y + this.radius;

            var rectLeft = otherobj.x;
            var rectRight = otherobj.x + otherobj.width;
            var rectTop = otherobj.y;
            var rectBottom = otherobj.y + otherobj.height;

            if (ballRight > rectLeft && ballLeft < rectRight && ballBottom > rectTop && ballTop < rectBottom) {
                return true;
            }
            return false;
        }
        
    }
}

function updateGameArea() {

    if(ball.crashWith(targetBall)){
        addNewScore();
        resetGame();
    } 
    else{
        myGameArea.clear();
        ball.newPos();
        ball.update();
        targetBall.update();
        rectangles.forEach(rect => rect.update());
    }
}

function resetGame() {
    myGameArea.stop();
    alert("You win!");
    startGame();
}

document.onkeyup = function(event){
    ball.speedX = 0;
    ball.speedY = 0;
};

document.onkeydown = function (event) {
    var keyCode = event.keyCode;

    switch (keyCode) {
        // 'A' / left
        case 65:
            ball.speedX = -1; 
            break;

        // 'W' / up
        case 87:
            ball.speedY = -1;
            break;

        // 'D' / right
        case 68:
            ball.speedX = 1;
            break;

        // 'S' / down
        case 83:
            ball.speedY = 1;
            break;

        default:
            break;
    }
};

function addNewScore(){
    var newScore = document.createElement('p');
    var time = Date.now() - startTime;
    newScore.innerText = `${(time / 1000)} sec`;
    leaderboard.appendChild(newScore);
}