import Character from './Character.js';
import GameEnv from './GameEnv.js';

export class Enemy extends Character {
    // constructors sets up Character object 
    constructor(canvas, image, speedRatio, enemyData){
        super(canvas, 
            image, 
            speedRatio,
            enemyData.width, 
            enemyData.height, 
        );

        // Player Data is required for Animations
        this.enemyData = enemyData;
        this.x = 0.6 * GameEnv.innerWidth;
        this.speedChangeInterval = 3000; // Time interval to change speed (in milliseconds)
        this.lastSpeedChange = Date.now(); // Track the time of the last speed change
    }

    update() {
        const currentTime = Date.now();
        
        // Check if it's time to change the speed
        if (currentTime - this.lastSpeedChange >= this.speedChangeInterval) {
            // Generate a random value to adjust the speed
            const randomSpeedChange = Math.random() * 2 - 1; // Random value between -1 and 1
            this.speed += randomSpeedChange; // Modify the current speed by a random value
            
            // Ensure speed stays within a certain range
            const maxSpeed = 10;
            const minSpeed = 5;
            this.speed = Math.max(Math.min(this.speed, maxSpeed), minSpeed);
            
            this.lastSpeedChange = currentTime; // Update last speed change time
        }

        // Check if the enemy is at the left or right boundary
        if (this.x <= 0 || this.x + this.width >= GameEnv.innerWidth) {
            // Change direction by reversing the speed
            this.speed = -this.speed;
        }

        // Move the enemy
        this.x += this.speed;
    }
}

export default Enemy;
