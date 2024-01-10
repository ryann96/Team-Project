---
layout: base
title: Dynamic Game Levels
description: Early steps in adding levels to an OOP Game.  This includes basic animations left-right-jump, multiple background, and simple callback to terminate each level.
type: ccc
courses: { csse: {week: 14}, csp: {week: 14}, csa: {week: 14} }
image: /images/platformer/backgrounds/hills.png
permalink: /mariogame
---

<style>

  .sidenav {
      position: fixed;
      height: 100%; /* 100% Full-height */
      width: 0px; /* 0 width - change this with JavaScript */
      z-index: 3; /* Stay on top */
      top: 0; /* Stay at the top */
      left: 0;
      overflow-x: hidden; /* Disable horizontal scroll */
      padding-top: 60px; /* Place content 60px from the top */
      transition: 0.5s; /* 0.5 second transition effect to slide in the sidenav */
      background-color: black; 
    }
    
 
  #gameBegin, #controls, #gameOver, #settings {
    position: relative;
    z-index: 2; /*Ensure the controls are on top*/
  }
  
  #toggleCanvasEffect, #toggleSettingsBar, #background, #platform {
    animation: fadein 5s;
  }

  #startGame {
    animation: flash 0.5s infinite;
  }
  

  @keyframes flash {
    50% {
      opacity: 0;
    }
  }

  @keyframes fadeout {
    from {opacity: 1}
    to {opacity: 0}
  }

  @keyframes fadein {
    from {opacity: 0}
    to {opacity: 1}
  }
</style>

<!-- Sidebar -->
  <div id="mySidebar" class="sidenav">
    <a href="javascript:void(0)" id="toggleSettingsBar1" class="closebtn">&times;</a>
    <!-- Sidebar content -->
     <div class="sidebar-content">
        <h2>Game Speed</h2>
        <div>
            <label for="speedInput">Adjust Speed:</label>
            <input type="range" min="1" max="10" value="5" class="slider" id="speedInput">
        </div>
    </div>
  </div>
<!-- Prepare DOM elements -->
<!-- Wrap both the canvas and controls in a container div -->
<div id="canvasContainer">
<div id="mySidebar" class="sidenav">
  <a href="javascript:void(0)" id="toggleSettingsBar1" class="closebtn">&times;</a>
</div>
<!-- Splinter -->
    <div id="gameBegin" hidden>
        <button id="startGame">Start Game</button>
    </div>
    <div id="controls"> <!-- Controls -->
        <!-- Background controls -->
        <button id="toggleCanvasEffect">Invert</button>
        <button id="leaderboardButton">Leaderboard</button>
    </div>
      <div id="settings"> <!-- Controls -->
        <!-- Background controls -->
        <button id="toggleSettingsBar">Settings</button>
      </div>
    <div id="gameOver" hidden>
        <button id="restartGame">Restart</button>
    </div>
</div>
<div id="score" style= "position: absolute; top: 75px; left: 10px; color: black; font-size: 20px; background-color: #dddddd; padding-left: 5px; padding-right: 5px;">
    Time: <span id="timeScore">0</span>
</div>

<script type="module">
    // Imports
    import GameEnv from '{{site.baseurl}}/assets/js/platformer/GameEnv.js';
    import GameLevel from '{{site.baseurl}}/assets/js/platformer/GameLevel.js';
    import GameControl from '{{site.baseurl}}/assets/js/platformer/GameControl.js';
    import Controller from '{{site.baseurl}}/assets/js/platformer/Controller.js';

    /*  ==========================================
     *  ======= Data Definitions =================
     *  ==========================================
    */

    // Define assets for the game
  var assets = {
  obstacles: {
    tube: { src: "/images/platformer/obstacles/tube.png" },
  },
  platforms: {
    grass: { src: "/images/platformer/platforms/grass.png" },
    alien: { src: "/images/platformer/platforms/alien.png" }
  },
  thing: {
    coin: { src: "/images/Coin.png" }
  },  
  platformO: {
    grass: { src: "/images/brick_wall.png" },
  },
  backgrounds: {
    start: { src: "/images/platformer/backgrounds/home.png" },
    hills: { src: "/images/platformer/backgrounds/hills.png" },
    mountains: { src: "/images/platformer/backgrounds/mountains.jpg"},
    planet: { src: "/images/platformer/backgrounds/planet.jpg" },
    castles: { src: "/images/platformer/backgrounds/castles.png" },
    end: { src: "/images/platformer/backgrounds/game_over.png" }
  },
  players: {
    mario: {
      type: 0,
      src: "/images/platformer/sprites/mario.png",
      width: 256,
      height: 256,
      w: { row: 10, frames: 15 },
      wa: { row: 11, frames: 15 },
      wd: { row: 10, frames: 15 },
      a: { row: 3, frames: 7, idleFrame: { column: 7, frames: 0 } },
      s: {  },
      d: { row: 2, frames: 7, idleFrame: { column: 7, frames: 0 } }
    },
    monkey: {
      type: 0,
      src: "/images/platformer/sprites/monkey.png",
      width: 40,
      height: 40,
      w: { row: 9, frames: 15 },
      wa: { row: 9, frames: 15 },
      wd: { row: 9, frames: 15 },
      a: { row: 1, frames: 15, idleFrame: { column: 7, frames: 0 } },
      s: { row: 12, frames: 15 },
      d: { row: 0, frames: 15, idleFrame: { column: 7, frames: 0 } }
    },
    lopez: {
          type: 1,
          src: "/images/platformer/sprites/lopezanimation.png", // Modify this to match your file path
          width: 46,
          height: 52.5,
          idle: { row: 6, frames: 1, idleFrame: {column: 1, frames: 0} },
          a: { row: 1, frames: 4, idleFrame: { column: 1, frames: 0 } }, // Right Movement
          d: { row: 2, frames: 4, idleFrame: { column: 1, frames: 0 } }, // Left Movement 
          runningLeft: { row: 5, frames: 4, idleFrame: {column: 1, frames: 0} },
          runningRight: { row: 4, frames: 4, idleFrame: {column: 1, frames: 0} },
          s: {}, // Stop the movement 
    }
  },
  enemies: {
    goomba: {
      src: "/images/platformer/sprites/goomba.png",
      width: 448,
      height: 452,
    }
  }
};
// Sort scores from lowest to highest
function sortScoresLowToHigh() {
  const leaderboardSection = document.getElementById('leaderboardSection');
  const scores = Array.from(leaderboardSection.children);

  scores.sort((a, b) => {
    const scoreA = parseInt(a.innerText.split(',')[1]);
    const scoreB = parseInt(b.innerText.split(',')[1]);
    return scoreA - scoreB;
  });

  leaderboardSection.innerHTML = '';
  scores.forEach(score => leaderboardSection.appendChild(score));
}

// Sort scores from highest to lowest
function sortScoresHighToLow() {
  const leaderboardSection = document.getElementById('leaderboardSection');
  const scores = Array.from(leaderboardSection.children);

  scores.sort((a, b) => {
    const scoreA = parseInt(a.innerText.split(',')[1]);
    const scoreB = parseInt(b.innerText.split(',')[1]);
    return scoreB - scoreA;
  });

  leaderboardSection.innerHTML = '';
  scores.forEach(score => leaderboardSection.appendChild(score));
}

// Sort scores alphabetically by names
function sortScoresAlphabetically() {
  const leaderboardSection = document.getElementById('leaderboardSection');
  const scores = Array.from(leaderboardSection.children);

  // Exclude the first row (header row with "Leaderboard" text)
  const scoresToSort = scores.slice(1);

  scoresToSort.sort((a, b) => {
    const nameA = a.innerText.split(',')[0].toLowerCase();
    const nameB = b.innerText.split(',')[0].toLowerCase();
    return nameA.localeCompare(nameB);
  });

  leaderboardSection.innerHTML = '';
  
  // Append the header row first
  leaderboardSection.appendChild(scores[0]);
  
  // Append the sorted scores after the header row
  scoresToSort.forEach(score => leaderboardSection.appendChild(score));
}

function sortScoresNewestToOldest() {
  const leaderboardSection = document.getElementById('leaderboardSection');
  const scores = Array.from(leaderboardSection.children);

  // Sort the scores based on the timestamp when they were added (assuming timestamp is in the format "YYYY-MM-DD HH:mm:ss")
  scores.sort((a, b) => {
    const timestampA = new Date(a.dataset.timestamp).getTime();
    const timestampB = new Date(b.dataset.timestamp).getTime();
    return timestampB - timestampA;
  });

  leaderboardSection.innerHTML = '';
  scores.forEach(score => leaderboardSection.appendChild(score));
}

function clearPlayersAndScores() {
  // Clear player scores from local storage
  localStorage.removeItem('playerScores');
  
  // Optionally, you might want to reset other relevant data if needed
  
  // Provide feedback to the user that data has been cleared
  alert('Players and scores have been cleared.');
}

// Create a button element
const clearButton = document.createElement('button');
clearButton.textContent = 'Clear Players & Scores';

// Add an event listener to the button to trigger the clearing function
clearButton.addEventListener('click', clearPlayersAndScores);

// Append the button to an existing DOM element, for instance, the sidebar
document.querySelector('.sidebar-content').appendChild(clearButton);

  function showLeaderboard() {
    const id = document.getElementById("gameOver");
    id.hidden = false;
    // Hide game canvas and controls
    document.getElementById('canvasContainer').style.display = 'none';
    document.getElementById('controls').style.display = 'none';

    const timeScore = document.getElementById("score");
    timeScore.style.display = "none";

    // Check if leaderboard section already exists
    let leaderboardSection = document.getElementById('leaderboardSection');
    if (!leaderboardSection) {
        // Create leaderboard section if it doesn't exist
        leaderboardSection = document.createElement('div');
        leaderboardSection.id = 'leaderboardSection';
        leaderboardSection.innerHTML = '<h1 style="text-align: center; font-size: 18px;">Leaderboard </h1>';
        document.querySelector(".page-content").appendChild(leaderboardSection);
    } else {
        // Clear existing leaderboard contents
        leaderboardSection.innerHTML = '<h1 style="text-align: center; font-size: 18px;">Leaderboard </h1>';
    }

  // Retrieve player scores and update the leaderboard
  const playerScores = localStorage.getItem("playerScores");
  const playerScoresArray = playerScores.split(";");
  const scoresObj = {};
  const scoresArr = [];
  for (let i = 0; i < playerScoresArray.length - 1; i++) {
      const temp = playerScoresArray[i].split(",");
      scoresObj[temp[0]] = parseInt(temp[1]);
      scoresArr.push(parseInt(temp[1]));
  }

  scoresArr.sort();

  const finalScoresArr = [];
  for (let i = 0; i < scoresArr.length; i++) {
      for (const [key, value] of Object.entries(scoresObj)) {
          if (scoresArr[i] == value) {
              finalScoresArr.push(key + "," + value);
              break;
          }
      }
  }

  // Append updated scores to the leaderboard section
  for (let i = 0; i < finalScoresArr.length; i++) {
      const rank = document.createElement('div');
      rank.id = `rankScore${i + 1}`;
      rank.innerHTML = `<h2 style="text-align: center; font-size: 18px;">${finalScoresArr[i]} </h2>`;
      leaderboardSection.appendChild(rank);
  }

  // Check if the back button already exists
  let backButton = document.getElementById('leaderboardBackButton');
  if (!backButton) {
    // Create and append back button if it doesn't exist
    backButton = document.createElement('button');
    backButton.id = 'leaderboardBackButton';
    backButton.innerText = 'Back';
    backButton.addEventListener('click', () => {
        // Show canvas and controls
        document.getElementById('canvasContainer').style.display = 'block';
        document.getElementById('controls').style.display = 'block';

        // Hide leaderboard
        id.hidden = true;

        timeScore.style.display = "block";
    });
    document.querySelector(".page-content").appendChild(backButton);
  }
  let filtersButton = document.getElementById('showFilters');
  if (!filtersButton) {
    filtersButton = document.createElement('button');
    filtersButton.id = 'showFilters';
    filtersButton.innerText = 'Filters';
    document.querySelector(".page-content").appendChild(filtersButton);

    const filterButtonsContainer = document.createElement('div');
    filterButtonsContainer.id = 'filterButtonsContainer';
    filterButtonsContainer.style.display = 'none';

    filterButtonsContainer.innerHTML = `
      <button id="sortLowToHigh">Sort Low to High</button>
      <button id="sortHighToLow">Sort High to Low</button>
      <button id="sortAlphabetical">Sort Alphabetical</button>
      <button id="sortNewestToOldest">Sort Newest to Oldest</button>
    `;
    document.querySelector(".page-content").appendChild(filterButtonsContainer);

    filtersButton.addEventListener('click', function () {
      const filtersContainer = document.getElementById('filterButtonsContainer');
      filtersContainer.style.display = (filtersContainer.style.display === 'none') ? 'block' : 'none';
    });

    document.getElementById('sortLowToHigh').addEventListener('click', sortScoresLowToHigh);
    document.getElementById('sortHighToLow').addEventListener('click', sortScoresHighToLow);
    document.getElementById('sortAlphabetical').addEventListener('click', sortScoresAlphabetically);
    document.getElementById('sortNewestToOldest').addEventListener('click', sortScoresNewestToOldest);
  }
}

document.getElementById('leaderboardButton').addEventListener('click', showLeaderboard);

    // add File to assets, ensure valid site.baseurl
    Object.keys(assets).forEach(category => {
      Object.keys(assets[category]).forEach(assetName => {
        assets[category][assetName]['file'] = "{{site.baseurl}}" + assets[category][assetName].src;
      });
    });

    /*  ==========================================
     *  ===== Game Level Call Backs ==============
     *  ==========================================
    */

    // Level completion tester
    function testerCallBack() {
        // console.log(GameEnv.player?.x)
        if (GameEnv.player?.x > GameEnv.innerWidth) {
            return true;
        } else {
            return false;
        }
    }

    // Helper function for button click
    function waitForButton(buttonName) {
      // resolve the button click
      return new Promise((resolve) => {
          const waitButton = document.getElementById(buttonName);
          const waitButtonListener = () => {
              resolve(true);
          };
          waitButton.addEventListener('click', waitButtonListener);
      });
    }

    // Start button callback
    async function startGameCallback() {
      const id = document.getElementById("gameBegin");
      id.hidden = false;
      
      // Use waitForRestart to wait for the restart button click
      await waitForButton('startGame');
      id.hidden = true;
      
      return true;
    }

    // Home screen exits on Game Begin button
    function homeScreenCallback() {
      // gameBegin hidden means game has started
      const id = document.getElementById("gameBegin");
      return id.hidden;
    }

    // Game Over callback
    async function gameOverCallBack() {
    const id = document.getElementById("gameOver");
    id.hidden = false;

    // Store whether the game over screen has been shown before
    const gameOverScreenShown = localStorage.getItem("gameOverScreenShown");

    // Check if the game over screen has been shown before
    if (!gameOverScreenShown) {
      const playerScore = document.getElementById("timeScore").innerHTML;
      const playerName = prompt(`You scored ${playerScore}! What is your name?`);
      let temp = localStorage.getItem("playerScores");
      temp += playerName + "," + playerScore.toString() + ";";
      localStorage.setItem("playerScores", temp);
      // Set a flag in local storage to indicate that the game over screen has been shown
      localStorage.setItem("gameOverScreenShown", "true");
  }

// Use waitForRestart to wait for the restart button click
    await waitForButton('restartGame');
    id.hidden = true;
    // Change currentLevel to start/restart value of null
    GameEnv.currentLevel = null;
    // Reset the flag so that the game over screen can be shown again on the next game over
    localStorage.removeItem("gameOverScreenShown");
    return true;
}

    /*  ==========================================
     *  ========== Game Level setup ==============
     *  ==========================================
     * Start/Homme sequence
     * a.) the start level awaits for button selection
     * b.) the start level automatically cycles to home level
     * c.) the home advances to 1st game level when button selection is made
    */
    // Start/Home screens
    new GameLevel( {tag: "start", 
      callback: startGameCallback 
      });
    new GameLevel( {tag: "home", 
      background: assets.backgrounds.start, 
      callback: homeScreenCallback 
    });
    // Game screens
    new GameLevel( {tag: "hills", 
      background: assets.backgrounds.hills,
      background2: assets.backgrounds.mountains,
      platform: assets.platforms.grass, 
      platformO: assets.platformO.grass, 
      player: assets.players.mario, 
      enemy: assets.enemies.goomba, 
      tube: assets.obstacles.tube, 
      callback: testerCallBack, 
      thing: assets.thing.coin,
    });
    new GameLevel( {tag: "alien", 
      background: assets.backgrounds.planet, 
      platform: assets.platforms.alien, 
      player: assets.players.monkey, 
      callback: testerCallBack 
    });
    new GameLevel( {tag: "lopez", 
      background: assets.backgrounds.hills,
      background2: assets.backgrounds.mountains,
      platform: assets.platforms.grass, 
      platformO: assets.platformO.grass, 
      player: assets.players.lopez, 
      enemy: assets.enemies.goomba, 
      tube: assets.obstacles.tube, 
      callback: testerCallBack, 
      thing: assets.thing.coin, 
    });
    // Game Over screen
    new GameLevel( {tag: "end", 
      background: assets.backgrounds.end, 
      callback: gameOverCallBack 
    });

    /*  ==========================================
     *  ========== Game Control ==================
     *  ==========================================
    */

    // create listeners
    toggleCanvasEffect.addEventListener('click', GameEnv.toggleInvert);
    window.addEventListener('resize', GameEnv.resize);

    // start game
    GameControl.gameLoop();

    // Create an instance of Controller and initialize it
    var myController = new Controller();
    myController.initialize();

    var table = myController.levelTable;
    document.getElementById("mySidebar").append(table);

    // Get the speedDiv element from the Controller instance
    var speedSetting = myController.speedDiv;

    // Append the speed setting to the sidebar
    document.getElementById("mySidebar").querySelector('.sidebar-content').appendChild(speedSetting);

    var toggle = false;
      function toggleWidth(){
        toggle = !toggle;
        document.getElementById("mySidebar").style.width = toggle?"250px":"0px";
      }
      document.getElementById("toggleSettingsBar").addEventListener("click",toggleWidth);
      document.getElementById("toggleSettingsBar1").addEventListener("click",toggleWidth);
</script>