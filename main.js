
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const p1 = document.getElementById('p1');
const p2 = document.getElementById('p2');
let countP1 = 0;
let countP2 = 0;


const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

//função construtora
function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX =  velX;
    this.velY = velY;
    this.exists = exists;
}


//bolas coloridas
function Ball(x, y, velX, velY, exists, color, size){
    Shape.call(this, x, y, velX, velY, exists);

    this.color = color;
    this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;


//players
function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);

    this.color = 'white';
    this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;



Ball.prototype.draw = function () {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fill();
};

Ball.prototype.update = function () {
    if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
    }

    if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
    }

    if ((this.y - this.size) >= height) {
        this.velY = -(this.velY);
    }

    if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
    }

    this.x += this.velX;
    this.y += this.velY;
};

//checa colisão das bolas coloridas e muda as cores
Ball.prototype.collisionDetect = function() {
    for (let j = 0; j < balls.length; j++) {

        if (!(this === balls[j])) {
            let dx = this.x - balls[j].x;
            let dy = this.y - balls[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size && balls[j].exists) {
                balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
            }
        }
    }
};



EvilCircle.prototype.draw = function() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
};

EvilCircle.prototype.checkBounds = function() {
    if ((this.x + this.size) >= width) {
        this.x = -(this.x + this.size);
    }

    if ((this.x - this.size) <= 0) {
        this.x = -(this.x + this.size);
    }

    if ((this.y - this.size) >= height) {
        this.y = -(this.y + this.size);
    }

    if ((this.y - this.size) <= 0) {
        this.y = -(this.y + this.size);
    }

};

//controls p1
EvilCircle.prototype.setControls = function() {
    window.addEventListener('keydown', e => {

        switch (e.key) {
            case 'a':
                this.x -= this.velX;
                break;
            case 'd':
                this.x += this.velX;
                break;
            case 'w':
                this.y -= this.velY;
                break;
            case 's':
                this.y += this.velY;
                break;
        }
    });

};
//controls p2
EvilCircle.prototype.setControls2 = function() {
    window.addEventListener('keydown', e => {

        switch (e.key) {
            case '4':
                this.x -= this.velX;
                break;
            case '6':
                this.x += this.velX;
                break;
            case '8':
                this.y -= this.velY;
                break;
            case '5':
                this.y += this.velY;
                break;
        }
    });

};


let balls = [];

while(balls.length < 25) {
    const size = random(10,20);
    let ball = new Ball(
        // ball position always drawn at least one ball width
        // away from the adge of the canvas, to avoid drawing errors
        random(0 + size,width - size),
        random(0 + size,height - size),
        random(-7,7),
        random(-7,7),
        true,
        'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
        size
    );
    balls.push(ball);
}


//checa colisão dos players com as bolas coloridas e adiciona ao contador
EvilCircle.prototype.collisionDetect = function() {
    for(let j = 0; j < balls.length; j++) {
        if( balls[j].exists ) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                countP1--;
                p1.textContent = 'Player 1: ' + (-countP1);
            }
        }
    }
};

EvilCircle.prototype.collisionDetect2 = function() {
    for(let j = 0; j < balls.length; j++) {
        if( balls[j].exists ) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                countP2--;
                p2.textContent = 'Player 2: ' + (-countP2);
            }
        }
    }
};

//p1
let evil = new EvilCircle(random(0,width), random(0,height), true);
evil.setControls();
//p2
let evil2 = new EvilCircle(random(0,width), random(0,height), true);
evil2.setControls2();
evil2.color = 'blue';




function loop() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if(balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }

    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();

    evil2.draw();
    evil2.checkBounds();
    evil2.collisionDetect2();

    requestAnimationFrame(loop);
}


loop();
