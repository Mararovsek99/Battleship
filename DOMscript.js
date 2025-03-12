import { player } from "./scripts.js";

let myPlayer;
let CompPlayer;
let direction = 0;
// 0 = me 1 = comp
export let currPlayer = 0;
export function playerWins(name) {
  if (name === "computer") {
    name = myPlayer.gameboard.name;
  } else {
    name = CompPlayer.gameboard.name;
  }
  document.querySelector("body").innerHTML += `
       <div class="overlay"></div>


    <div class="startGame">
        <h2>${name + " is Winner!"}</h2>
        <button onclick="location.reload();" class="submit">Play again</button>
    </div>
    `;
}
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
//change turn in DOM-border..
function changeTurnDOM() {
  const myBoard = document.querySelector(".myBoard");
  const CompBoard = document.querySelector(".computerBoard");
  const myTitle = document.getElementById("yourTitle");
  const CompTitle = document.getElementById("OpponentTitle");

  if (currPlayer === 0) {
    //i must shoot to opponent, so put border on oponent
    myBoard.classList.remove("boardTurn");
    myTitle.style.display = "block";
    //add border to opponent
    CompBoard.classList.add("boardTurn");
    CompTitle.style.display = "none";
  } else {
    //opponent is shooting so put border on my board and change title to comp shooting
    CompBoard.classList.remove("boardTurn");
    CompTitle.style.display = "block";

    //add border to opponent board to shot
    myBoard.classList.add("boardTurn");
    myTitle.style.display = "none";
  }
}
//for display shooting on boards
export function DrawShoot(playerBoard, action, drawX, drawY) {
  //it is miss or hit
  let icone = "";
  if (action === "miss") {
    icone = "url('icons/o.png')";
  } else {
    icone = "url('icons/x.png')";
  }
  //select on which board we must draw miss or hit
  if (playerBoard === "computer") {
    const board = document.querySelector(".computerBoard");
    let colorCell = board.querySelector(
      '.cell[data-row="' + drawX + '"][data-col="' + drawY + '"]'
    );
    colorCell.style.backgroundImage = icone;
  } else {
    const board = document.querySelector(".myBoard");
    let colorCell = board.querySelector(
      '.cell[data-row="' + drawX + '"][data-col="' + drawY + '"]'
    );
    colorCell.style.backgroundImage = icone;
  }
}
function computerShoot() {
  myPlayer.gameboard.receiveRandomAttack();
  //set player back to USER
  currPlayer = 0;
  //this change layout of page for each player
  changeTurnDOM();
  myShipsLifeDOM();
}
//my ships has life block bellow them, so this will
//color them white if ship is hit
function myShipsLifeDOM() {
  const ships = myPlayer.gameboard.ships;
  ships.forEach((ship) => {
    //first change color of sunk ship icone to gray:
    let sunk = ship.sunk;
    const shipIcone = document.querySelector(`.shipIconeMy${ship.length}`);
    if (sunk) {
      shipIcone.style.opacity = "0.2";
    }
    //then handle lives of my ships;
    let hits = ship.hitsTaken;
    const shipsLives = document.querySelectorAll(`.lifeBlock${ship.length}`);
    shipsLives.forEach((lifeBlock, index) => {
      if (index < ship.hitsTaken) {
        lifeBlock.style.backgroundColor = "#d80b0b"; // Change to hit color
      } else {
        lifeBlock.style.backgroundColor = "d0d0d0"; // Default color
      }
    });
  });
}
//For opponentships i just want to change opacity when ship is sunk
function CompShipsSunkDOM() {
  const ships = CompPlayer.gameboard.ships;
  ships.forEach((ship) => {
    let sunk = ship.sunk;
    const shipIcone = document.querySelector(`.shipIconeComp${ship.length}`);
    if (sunk) {
      shipIcone.style.opacity = "0.2";
    }
  });
}
function startGame() {
  //if player adds all ships, then we can start a game
  if (myPlayer.gameboard.numOfShips === 5) {
    //hide direction orientBtn
    const dirBtn = document.querySelector(".directionBtn");
    dirBtn.style.visibility = "hidden";

    //remove border to my board to show where to place ships
    const myBoard = document.querySelector(".myBoard");
    myBoard.classList.remove("boardTurn");
    //add border to opponent board to shot
    const CompBoard = document.querySelector(".computerBoard");
    CompBoard.classList.add("boardTurn");

    //remove event listener on my board and change cursor.
    const cells = document.querySelectorAll(".myCell");
    cells.forEach((cell) => {
      cell.removeEventListener("click", () => {});
      cell.style.cursor = "not-allowed";
    });

    //now change the title to SHOT AT OPPONENT!
    let placeShipsTitle = document.getElementById("placeShipTitle");
    let yourTurnTitle = document.getElementById("yourTitle");
    placeShipsTitle.style.display = "none";
    yourTurnTitle.style.display = "block";

    //remove chosen ship animation
    const myShips = document.querySelectorAll(".shipIcone");
    myShips.forEach((ship) => {
      ship.classList.remove("chossenShip");
    });

    //remove event listener on cells for displaying preview of placement
    const cell = document.querySelectorAll(".myCell");
    cell.forEach((cell) => {
      cell.removeEventListener("mouseover", addPreviewBorder);
      cell.removeEventListener("mouseout", removePreviewBorder);
      cell.style.border = "";
    });

    //add ships to Comp
    CompPlayer.gameboard.placeRandomShips();
    //add event listener for shooting opponent
    const compCell = document.querySelectorAll(".CompCell");
    compCell.forEach((cell) => {
      cell.addEventListener("click", () => {
        if (currPlayer === 0) {
          //get cordinate and check if its already shoot?
          if (
            CompPlayer.gameboard.shots.some(
              (shot) =>
                shot[0] == cell.dataset.row && shot[1] == cell.dataset.col
            )
          ) {
            return;
          }
          CompPlayer.gameboard.receiveAttack(
            cell.dataset.row,
            cell.dataset.col
          );
          CompShipsSunkDOM();
          currPlayer = 1;
          changeTurnDOM();
          setTimeout(function () {
            computerShoot();
          }, 2000);
        }
      });
    });
  }
}
//ships for preview placement
const ships = [6, 5, 4, 3, 2];
//save cordinates for easy deleting..
let shipCordinates = [];
function addPreviewBorder(event) {
  const length = ships[myPlayer.gameboard.numOfShips];
  let x = parseInt(event.target.dataset.row, 10);
  let y = parseInt(event.target.dataset.col, 10);

  //make array of cordinates of ship,with start position
  shipCordinates = [[x, y]];

  //add others
  for (let i = 1; i < length; i++) {
    if (direction) {
      //vertical = 1
      y = y + 1;
      if (y < 10) {
        let newCordinate = [x, y];
        shipCordinates.push(newCordinate);
      }
    } else {
      //horizontal = 0
      x = x + 1;
      if (x < 10) {
        let newCordinate = [x, y];
        shipCordinates.push(newCordinate);
      }
    }
  }

  shipCordinates.forEach((cordinate) => {
    let colorCell = document.querySelector(
      '.cell[data-row="' + cordinate[0] + '"][data-col="' + cordinate[1] + '"]'
    );
    colorCell.style.border = "solid 2px black";
  });
}
function removePreviewBorder(event) {
  shipCordinates.forEach((cordinate) => {
    let colorCell = document.querySelector(
      '.cell[data-row="' + cordinate[0] + '"][data-col="' + cordinate[1] + '"]'
    );
    colorCell.style.border = "";
  });
  shipCordinates = [];
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
    //place random ships
    myPlayer.gameboard.placeRandomShips();
    //hide random button
    RandomShipsBtn.style.visibility = "hidden";
  });

  // orient button for placement
  const orientBtn = document.querySelector(".directionBtn");
  direction = 0;
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
  const ships = [6, 5, 4, 3, 2];
  //click event for cells
  const cells = document.querySelectorAll(".myCell");
  cells.forEach((cell) => {
    cell.addEventListener("click", (event) => {
      //remove random button
      RandomShipsBtn.style.visibility = "hidden";
      //place ship
      myPlayer.gameboard.placeShip(
        Number(event.target.dataset.row),
        Number(event.target.dataset.col),
        ships[myPlayer.gameboard.numOfShips],
        direction
      );
      //change animation to next ship
      //remove last one
      let lastship = document
        .getElementById(`myShip${ships[myPlayer.gameboard.numOfShips - 1]}`)
        .classList.remove("chossenShip");
      //add to next ship
      if (ships[myPlayer.gameboard.numOfShips]) {
        let nextship = document
          .getElementById(`myShip${ships[myPlayer.gameboard.numOfShips]}`)
          .classList.add("chossenShip");
      }
    });

    //draw preview of placement for ship
    cell.addEventListener("mouseover", addPreviewBorder);

    //delete preview of placement for ship
    cell.addEventListener("mouseout", removePreviewBorder);
  });
});
