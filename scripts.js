 class ship{

        constructor(length){
            this.length = length;
            this.hitsTaken = 0;
            this.sunk = false;

        }
        hit(){
            if (this.sunk) {
                return "this ship is allready sunk"
            }

            this.hitsTaken = this.hitsTaken + 1;
            this.isSunk();
        }
        isSunk(){
            if (this.hitsTaken >= this.length) {
                this.sunk = true;
                return this.sunk;
            }
            return this.sunk
        }
 }



 class gameboard{

    constructor(){
        this.size = 10;
        this.board = this.createBoard();
        

    }
    createBoard(){
        //2d array for board
        return Array(this.size).fill(null).map(() => Array(this.size).fill(null));
    }

    placeShip(x, y, length, direction){
        //checks if cordinate its inside the map
        if(!(-1 < x && x <= (this.size -1) && -1 < y && y <= (this.size -1)) ){
            return false
        }
        //checks if end point of ship is inside
        if(!( (x + length)<= (this.size -1) && (y + length)<= (this.size -1) )){
            return false
        }
        //make array of cordinates of ship, with length and direction
        let shipCordinates = [];
        //start position
        shipCordinates.push([x,y]);
        //add others
        for (let i = 1; i < length; i++) {
            if (direction) {
                //vertical = 1
                y = y + 1;
                let newCordinate = [x,y];
                shipCordinates.push(newCordinate);
            }else{
                //horizontal = 0
                x = x + 1;
                let newCordinate = [x,y];
                shipCordinates.push(newCordinate);
            }            
        }
        debugger;
        //create shadow space around ship
        let bufferZone = [];
        shipCordinates.forEach(cordinate => {
            for (let dx = -1; dx <= 1; dx++){
                for (let dy = -1; dy <= 1; dy++){
                    let bx = cordinate[0] + dx;
                    let by = cordinate[1] + dy;

                    //if its inside table
                    if (bx >= 0 && by >= 0 && bx <= (this.size-1) && by <= (this.size-1)) {
                        //if its not teaken by another ship
                
                        let buffer = [bx,by];
                        bufferZone.push(buffer);
                        
                        
                        
                    }
                }
            }
        });
        //there we check if all cordinates in buffer zone is free space.
        if(!(bufferZone.every(([x, y]) => this.board[x][y] === null ))){
            return ;
        }
        shipCordinates.forEach(([setx,sety]) => this.board[setx][sety] = 1);
        
    }
    
}

 module.exports = {ship, gameboard};
