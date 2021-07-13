/** @type {HTMLCanvasElement} */

const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let adjustX = 3;
let adjustY = 1;

let particlesArray = [];

const mouse = {
    x: null,
    y: null,
    radius: 150
}


window.addEventListener('mousemove', event => {
    mouse.x = event.x;
    mouse.y = event.y;
});


ctx.font = '30px Verdana';
ctx.fillText(document.querySelector('p').innerHTML, 0, 30);

const textCoordinates = ctx.getImageData(0, 0, 100, 100);

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 3;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = Math.random() * 30 + 1;
    }

    draw() {
        ctx.fillStyle = 'WHITE';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }


    update() {

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / distance; // Example: * (100 - 20 = 80).  ** (80 / 100) = 0.8

        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;


        // particles in mouse area will move away
        if (distance < maxDistance) {

            this.x -= directionX;
            this.y -= directionY;

        } else { // particle in out of mouse area will come back to orginal position

            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 10;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 10;
            }

        }
    }
}


function init() {
    particlesArray = [];

    for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {

            // for each pexil we check if that pexil is more than 128.
            // number 128 means = 50% opacity because possible range for alpha balue in clamped array is between 0 and 255, within this range number is roughly 50%.
            // textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] means check every 4 pixles
            if (textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128) {
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particlesArray.push(new Particle(positionX * 25, positionY * 25));
            }
        }
    }
}
init();


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].draw();
        particlesArray[i].update();

    }
    connectLines();
    requestAnimationFrame(animate)
}
animate();



function connectLines() {

    let opacityValue = 1;

    for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {

            let dx = particlesArray[a].x - particlesArray[b].x;
            let dy = particlesArray[a].y - particlesArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            opacityValue = 1 - (distance / 50);

            if (distance < 50) {
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                ctx.stroke();
            }
        }
    }
}


window.addEventListener('resize', e => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
})