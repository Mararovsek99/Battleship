const {ship, gameboard} = require("./scripts");




test("battleship hit 2/3", () => {
    const ship1 = new ship(3);
    ship1.hit();
    ship1.hit();
    
    expect(ship1.sunk).toBe(false);
}) 
test("battleship hit 3/3", () => {
    const ship2 = new ship(3);
    ship2.hit();
    ship2.hit();
    ship2.hit();
    
    expect(ship2.sunk).toBe(true);
}) 



test.skip("inside cordinates", () => {
    const game = new gameboard;

    expect(game.placeShip(0,0,3,0)).toBe(true);
})
test("outside cordinates", () => {
    const game = new gameboard;

    expect(game.placeShip(21,0,3,0)).toBe(false);
})
test.skip("border cordinates", () => {
    const game = new gameboard;

    expect(game.placeShip(9,9,3,0)).toBe(true);
})
test("out border cordinates", () => {
    const game = new gameboard;

    expect(game.placeShip(10,10,3,0)).toBe(false);
})
test("minus border cordinates", () => {
    const game = new gameboard;

    expect(game.placeShip(-1,-1,3,0)).toBe(false);
})



test.skip("ship cordinates", () => {
    const game = new gameboard;

    expect(game.placeShip(1,1,2,0)).toStrictEqual([[1, 1], [2, 1]]
    );
})
test.skip("ship cordinates", () => {
    const game = new gameboard;

    expect(game.placeShip(1,1,2,1)).toStrictEqual([[1, 1], [1, 2]]
    );
})



test.skip("buffer zone ", () => {
    const game = new gameboard;

    expect(game.placeShip(1,1,1,0)).toStrictEqual([[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]]
    );
})
test("Ship placement1", () => {
    const game = new gameboard;
    game.placeShip(0,0,1,0);

    expect(game.board[0][0]).toStrictEqual(1);
})
test("Ship placement2", () => {
    const game = new gameboard;
    game.placeShip(0,0,1,0);

    expect(game.board[0][1]).toStrictEqual(null);
})
test("Ship to close", () => {
    const game = new gameboard;
    game.placeShip(0,0,3,0);
    game.placeShip(0,1,3,0);

    expect(game.board[1][1]).toStrictEqual(null);
})