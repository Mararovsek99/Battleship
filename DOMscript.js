import { player } from "./scripts.js";

let myPlayer;
let CompPlayer;

export function drawShip(shipcordinates) {
  shipcordinates.forEach((cordinate) => {
    let drawX = cordinate[0];
    let drawY = cordinate[1];

    let colorCell = document.querySelector(
      '.cell[data-row="' + drawX + '"][data-col="' + drawY + '"]'
    );
    colorCell.style.backgroundColor = "rgb(174 174 174)";

    startGame();
  });
}

function startGame() {
  //if player adds all ships, then we can start a game
  if (myPlayer.gameboard.numOfShips === 5) {
    console.log("we can start a game");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  //making of grid
  const myBoard = document.querySelector(".myBoard");
  const computerBoard = document.querySelector(".computerBoard");

  const gridSize = 10;

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      let myCell = document.createElement("div");
      let CompCell = document.createElement("div");

      myCell.classList.add("cell");
      myCell.classList.add("myCell");
      myCell.dataset.row = col;
      myCell.dataset.col = row;
      myCell.dataset.user = "Me";

      CompCell.classList.add("cell");
      CompCell.classList.add("CompCell");
      CompCell.dataset.row = col;
      CompCell.dataset.col = row;
      CompCell.dataset.user = "Comp";

      myBoard.appendChild(myCell);
      computerBoard.appendChild(CompCell);
    }
  }

  //making of start of the game

  document.querySelector("body").innerHTML += `
       <div class="overlay"></div>


    <div class="startGame">
        <h2>Enter Your Name</h2>
        <input type="text" id="playerName" placeholder="Your Name" maxlength="15" autofocus>
        <button class="submit">Start Game</button>
    </div>
    `;

  //start game button
  const inputName = document.getElementById("playerName");
  const submitBtn = document.querySelector(".submit");
  const overlay = document.querySelector(".overlay");
  const startGameWindow = document.querySelector(".startGame");

  submitBtn.addEventListener("click", () => {
    if (inputName.value) {
      overlay.style.display = "none";
      startGameWindow.style.display = "none";
      myPlayer = new player(inputName.value);
      CompPlayer = new player("computer");
    } else {
      inputName.classList.add("shake");
      setTimeout(() => inputName.classList.remove("shake"), 300);
    }
  });
  const RandomShipsBtn = document.querySelector(".RandomBtn");

  RandomShipsBtn.addEventListener("click", () => {
    myPlayer.gameboard.placeRandomShips();
    RandomShipsBtn.style.visibility = "hidden";
  });

  // orient button for placement
  const orientBtn = document.querySelector(".directionBtn");
  const direction = 0;
  orientBtn.addEventListener("click", () => {
    // Toggle dataset.dir
    orientBtn.dataset.dir = orientBtn.dataset.dir === "H" ? "V" : "H";
    //Toggle direction number
    direction = direction === 0 ? 1 : 0;
    // Toggle button text
    orientBtn.textContent =
      orientBtn.dataset.dir === "H"
        ? "Direction: Horizontal"
        : "Direction: Vertical";
  });

  //ships for manual placement
  const ships = [6, 5, 3, 3, 2];
  //click event for cells
  const cells = document.querySelectorAll(".myCell");
  cells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
      myPlayer.gameboard.placeShip(
        Number(event.target.dataset.row),
        Number(event.target.dataset.col),
        ships[myPlayer.gameboard.numOfShips],
        direction
      );
      console.log(
        event.target.dataset.row,
        event.target.dataset.col,
        ships[myPlayer.gameboard.numOfShips],
        direction
      );
    });
  });
});
