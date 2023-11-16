---
layout: page
permalink: /game/
---

<style>
    #canvas {
        margin: 0;
        border: 1px solid white;
    }
</style>

<canvas id='canvas'></canvas>

<script>
    
    let canvas = document.getElementById('canvas');
    let c = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 400;
    let gravity = 1.5;

    let playerImage = new Image();
    playerImage.src = '{{site.baseurl}}/images/amazonBOX.png';

    class Player {
        constructor() {
            this.position = {
                x: 100,
                y: 200
            };
            this.velocity = {
                x: -10,
                y: 0
            };
            this.width = 50;
            this.height = 30;
            this.image = playerImage;
        }
        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
        update() {
            this.draw();
            this.position.y += this.velocity.y;
            this.position.x += this.velocity.x;
            if (this.position.y + this.height + this.velocity.y <= canvas.height)
                this.velocity.y += gravity;
            else
                this.velocity.y = 0;
        }
    }

    class Platform {
        constructor(image) {
            this.position = {
                x: 0,
                y: 310
            }
            this.image = image;
            this.width = 1500;
            this.height = 300;
        }
        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    class Tube {
        constructor(image) {
            this.position = {
                x: 1200,
                y: 190
            }
            this.image = image;
            this.width = 100;
            this.height = 120;
        }
        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    class BlockObject {
        constructor(image) {
            this.position = {
                x: 200,
                y: 50
            };
            this.image = image;
            this.width = 300;
            this.height = 160;
        }
        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    class Goomba {
        constructor(image) {
            this.position = {
                x: 250,
                y: 260
            };
            this.image = image;
            this.width = 55;
            this.height = 55;
            this.velocity = {
                x: -2,
                y: 0
            }
        }
        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
        update() {
            this.position.x += this.velocity.x;
            this.draw();
        }
    }

    let image = new Image()
    let imageTube = new Image()
    let imageBlock = new Image()
    image.src = '{{site.baseurl}}/images/other_road.png'
    imageTube.src = '{{site.baseurl}}/images/house.png'
    imageBlock.src = '{{site.baseurl}}/images/Cloud.png';
    let imageGoomba = new Image()
    imageGoomba.src = '{{site.baseurl}}/images/Uno-Stalker.png';
    let platform = new Platform(image)
    let tube = new Tube(imageTube)
    let blockObject = new BlockObject(imageBlock)
    let goomba = new Goomba(imageGoomba)
    player = new Player()
    let keys = {
        right: {
            pressed: false
        },
        left: {
            pressed: false
        }
    }

    class GenericObject {
        constructor({ x, y, image }) {
            this.position = {
                x,
                y
            };
            this.image = image;
            this.width = 1500; // Adjust the width to fit your canvas
            this.height = 400; // Adjust the height to fit your canvas
        }

        draw() {
            c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    let imageBackground = new Image();
    imageBackground.src = '{{site.baseurl}}/images/Background-With-Road-6.1.png';

    let background = new GenericObject({
        x: 0,
        y: 0,
        image: imageBackground
    });

    let genericObjects = [background];

    function animate() {
        requestAnimationFrame(animate);
        c.clearRect(0, 0, canvas.width, canvas.height);

        genericObjects.forEach(genericObject => {
            genericObject.draw()
        });

        platform.draw();
        player.update();
        tube.draw();
        blockObject.draw();

        goomba.update();
        if (
            player.position.y + player.height <= blockObject.position.y + 50 && // Add desired value to lower the player
            player.position.y + player.height + player.velocity.y >= blockObject.position.y &&
            player.position.x + player.width >= blockObject.position.x + 50 && // Add desired value to shorten the collision width
            player.position.x <= blockObject.position.x + blockObject.width - 50 // Subtract desired value to shorten the collision width
        )
        {
            player.velocity.y = 0;
            player.position.y = blockObject.position.y - player.height + 50; // Adjust the player's position
        }

        if (keys.right.pressed && player.position.x + player.width <= canvas.width - 50) {
            player.velocity.x = 15;
        } else if (keys.left.pressed && player.position.x >= 50) {
            player.velocity.x = -15;
        } else {
            player.velocity.x = 0;
        }

        if (
                player.position.y + player.height <= platform.position.y &&
                player.position.y + player.height + player.velocity.y >= platform.position.y &&
                player.position.x + player.width >= platform.position.x &&
                player.position.x <= platform.position.x + platform.width
            )
            {
                player.velocity.y = 0;
            }

        if (
                player.position.y + player.height <= tube.position.y &&
                player.position.y + player.height + player.velocity.y >= tube.position.y &&
                player.position.x + player.width >= tube.position.x &&
                player.position.x <= tube.position.x + tube.width
            ) {
                player.velocity.y = 0;
                player.position.y += 0.1
                player.velocity.y = 0.0001
                gravity = 0.2
            }

            if (player.position.y + player.height == tube.position.y + tube.height ||
                    player.position.y + player.height <= tube.position.y ||
                    player.position.x + player.width <= tube.position.x ||
                    player.position.x >= tube.position.x + tube.width) {
                        gravity = 1.5
                    }

        if (
                player.position.x + player.width<= tube.position.x &&
                player.position.x + player.width + player.velocity.x >= tube.position.x &&
                player.position.y + player.height >= tube.position.y &&
                player.position.y <= tube.position.y + tube.height
            )
            {
                player.velocity.x = 0;
            }

        if (
                player.position.x >= tube.position.x + tube.width &&
                player.position.x + player.velocity.x <= tube.position.x + tube.width &&
                player.position.y + player.height >= tube.position.y &&
                player.position.y <= tube.position.y + tube.height
            )
            {
                player.velocity.x = 0;
            }

        if (
                player.position.x >= tube.position.x &&
                player.position.x + player.velocity.x <= tube.position.x &&
                player.position.y + player.height >= tube.position.y &&
                player.position.y <= tube.position.y + tube.height
            )
            {
                player.velocity.x = 0;
            }

        if (
                player.position.x + player.width <= tube.position.x + tube.width &&
                player.position.x + player.width + player.velocity.x >= tube.position.x + tube.width &&
                player.position.y + player.height >= tube.position.y &&
                player.position.y <= tube.position.y + tube.height
            )
            {
                player.velocity.x = 0;
            }

        if(
            player.position.y + player.height <= goomba.position.y &&
            player.position.y + player.height + player.velocity.y >= goomba.position.y &&
            player.position.x + player.width >= goomba.position.x &&
            player.position.x <= goomba.position.x + goomba.width
        )
        {
            player.velocity.y = -20;
        }

        if (
            player.position.x < goomba.position.x + goomba.width &&
            player.position.x + player.width > goomba.position.x &&
            player.position.y < goomba.position.y + goomba.height &&
            player.position.y + player.height > goomba.position.y
        ) {
            // Player collided with goomba, refresh the page
            location.reload();
        }

        if (
            goomba.position.x >= platform.position.x &&
            goomba.position.x <= platform.position.x
        )
        {
            goomba.velocity.x = 2;
        }

        if (
            goomba.position.x + goomba.width <= tube.position.x &&
            goomba.position.x + goomba.width + goomba.velocity.x >= tube.position.x
        )
        {
            goomba.velocity.x = -2;
        }
    }

    animate();

    addEventListener('keydown', ({ keyCode }) => {
        switch (keyCode) {
            case 65:
                keys.left.pressed = true;
                break;
            case 68:
                keys.right.pressed = true;
                break;
            case 87:
                player.velocity.y -= 20;
                break;
        }
    });

    addEventListener('keyup', ({ keyCode }) => {
        switch (keyCode) {
            case 65:
                keys.left.pressed = false;
                break;
            case 68:
                keys.right.pressed = false;
                break;
            case 87:
                player.velocity.y = -20;
                break;
        }
    })
</script>
