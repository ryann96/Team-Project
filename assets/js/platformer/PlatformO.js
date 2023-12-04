import GameEnv from './GameEnv.js';
import GameObject from './GameObject.js';

export class PlatformO extends GameObject {
    constructor(canvas, image) {
        super(canvas, image, 0);
    }

    // Required, but no update action
    update() {
    }

    // Draw position is always 0,0
    draw() {
        this.ctx.drawImage(this.image, 0, 0);
    }

    // Set Tube position
    size() {
        // Formula for Height should be on constant ratio, using a proportion of 832
        const scaledHeight = GameEnv.innerHeight * (100 / 832);
        // Formula for Width is scaled: scaledWidth/scaledHeight == this.width/this.height
        const scaledWidth = scaledHeight * this.aspect_ratio;
        const platformX = .60 * GameEnv.innerWidth;
        const platformY = (GameEnv.bottom - scaledHeight);

        // set variables used in Display and Collision algorithms
        this.bottom = platformY;
        this.collisionHeight = scaledHeight;
        this.collisionWidth = scaledWidth;
    
        //this.canvas.width = this.width; 
        //this.canvas.height = this.height;
        this.canvas.style.width = `${scaledWidth}px`;
        this.canvas.style.height = `${scaledHeight}px`;
        this.canvas.style.position = 'absolute';
        this.canvas.style.left = `${platformX}px`;
        this.canvas.style.top = `${platformY}px`; 

    }
}

export default PlatformO;