import { drawShip, DrawShoot, playerWins } from "./DOMscript.js";
class ship {
  constructor(length) {
    this.length = length;
    this.hitsTaken = 0;
    this.sunk = false;
  }
  hit() {
    if (this.sunk) {
      return "this ship is allready sunk";
    }

    this.hitsTaken = this.hitsTaken + 1;
    this.isSunk();
  }
  isSunk() {
    if (this.hitsTaken >= this.length) {
      this.sunk = true;
      return;
    }
    return;
  }
}

class gameboard {
  constructor(name) {
    this.name = name;
    this.size = 10;
    this.board = this.createBoard();
    this.shots = [];
    this.numOfShips = 0;
    this.sunkShips = 0;
    this.isGameOver = false;
    this.ships = [];
  }
  createBoard() {
    //2d array for board
    return Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(null));
  }
  placeRandomShips() {
    //you cant place if player starts manualy.
    if (this.numOfShips > 0) {
      return;
    }
    //array for lenght of ships
    const ships = [6, 5, 4, 3, 2];

    ships.forEach((ship) => {
      // loop to place every ship
      let placed = false;
      //if cordinates are not possible, the loop trys again.

      while (!placed) {
        let randomX = Math.floor(Math.random() * 10);
        let randomY = Math.floor(Math.random() * 10);
        let randomDir = Math.floor(Math.random() * 2);

        placed = this.placeShip(randomX, randomY, ship, randomDir);
      }
    });
  }
  placeShip(x, y, length, direction) {
    //if its already 5 ships, then you cant place any more
    if (this.numOfShips > 4) {
      return;
    }
    //create new ship
    const newShip = new ship(length);
    //checks if cordinate its inside the map
    if (!(x >= 0 && x < this.size && y >= 0 && y < this.size)) {
      return false;
    }
    //checks if end point of ship is inside
    if (direction === 1 && y + length > this.size) return false; // Vertical check
    if (direction === 0 && x + length > this.size) return false;
    //make array of cordinates of ship,with start position
    let shipCordinates = [[x, y]];

    //add others
    for (let i = 1; i < length; i++) {
      if (direction) {
        //vertical = 1
        y = y + 1;
        let newCordinate = [x, y];
        shipCordinates.push(newCordinate);
      } else {
        //horizontal = 0
        x = x + 1;
        let newCordinate = [x, y];
        shipCordinates.push(newCordinate);
      }
    }
    //create shadow space around ship
    let bufferZone = [];
    shipCordinates.forEach((cordinate) => {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          let bx = cordinate[0] + dx;
          let by = cordinate[1] + dy;

          //if its inside table
          if (
            bx >= 0 &&
            by >= 0 &&
            bx <= this.size - 1 &&
            by <= this.size - 1
          ) {
            //if its not teaken by another ship

            let buffer = [bx, by];
            bufferZone.push(buffer);
          }
        }
      }
    });
    //there we check if all cordinates in buffer zone is free space.
    if (!bufferZone.every(([x, y]) => this.board[x][y] === null)) {
      return false;
    }
    shipCordinates.forEach(([setx, sety]) => {
      this.board[setx][sety] = newShip;
    });
    //update counter of ships
    this.numOfShips++;
    //add ship to array
    this.ships.push(newShip);

    if (this.name !== "computer") {
      drawShip(shipCordinates);
    }

    return true;
  }
  receiveRandomAttack() {
    let randomX = Math.floor(Math.random() * 10);
    let randomY = Math.floor(Math.random() * 10);

    //if there is already shoot fired
    while (
      this.shots.some((shot) => shot[0] === randomY && shot[1] === randomX)
    ) {
      randomX = Math.floor(Math.random() * 10);
      randomY = Math.floor(Math.random() * 10);
    }
    //add to shots
    this.shots.push([randomY, randomX]);
    this.receiveAttack(randomY, randomX);
  }
  receiveAttack(x, y) {
    //if its missed
    if (this.board[x][y] === null) {
      this.board[x][y] = "Miss";
      DrawShoot(this.name, "miss", x, y);
      this.shots.push([x, y]);
    } else if (typeof this.board[x][y] === "object") {
      //hits ship
      this.board[x][y].hit();
      DrawShoot(this.name, "hit", x, y);
      this.shots.push([x, y]);
      if (this.board[x][y].sunk) {
        this.sunkShips++;
        this.gameOver();
      }
    }
  }
  gameOver() {
    if (this.numOfShips === this.sunkShips) {
      this.isGameOver = true;
      playerWins(this.name);
    }
  }
}
class player {
  constructor(name) {
    this.name = name;
    this.gameboard = new gameboard(name);
  }
}

//  module.exports = {ship, gameboard};

export { ship, gameboard, player };
