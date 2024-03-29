/*
    Name: Suyang Wang
    PID: 730095608
    Add your code for Game here
 */
export default class Game {
    constructor(width) {
        this.width = width;
        this.winListeners = [];
        this.moveListeners = [];
        this.loseListeners = [];
        this.setupNewGame();

        this.winEvent = () => {
            this.winListeners.forEach((callback) => {callback(this.gameState);})
        }
        this.loseEvent = () => {
            this.loseListeners.forEach((callback) => {callback(this.gameState);})
        }
        this.moveEvent = () => {
            this.moveListeners.forEach((callback) => {callback(this.gameState);})
        }

    }

    setupNewGame() {
        this.gameState = {
            board: [],
            score: 0,
            won: false,
            over: false
        }

        for (let i = 0; i < this.width * this.width; i++) {
            this.gameState.board.push(0)
        }

        this.addTile();
        this.addTile();
    }

    loadGame(gameState) {
        this.gameState = gameState;
        this.width = Math.round(Math.sqrt(gameState.board.length));
    }

    addTile() {
        let posIndex = 0;
        let indexFound = false;
        while(!indexFound) {
            posIndex = this.getRandomIndex();
            if (this.gameState.board[posIndex] == 0) {
                this.gameState.board[posIndex] = this.twoOrFour();
                indexFound = true;
            }
        }
    }

    getRandomIndex() {
        return (Math.floor(Math.random() * (this.width * this.width)));
    }

    /*
            The Math.random() function returns a floating-point, pseudo-random number 
        in the range 0–1 (inclusive of 0, but not 1) with approximately uniform 
        distribution over that range.
    */
    twoOrFour() {
        return (Math.round(Math.random() * 10)) > 9 ? 4 : 2;
    }

    move(direction) {
        if (this.moveHelper(direction)) {
            this.addTile();
            this.moveEvent();
            this.gameState.over = this.checkWinLose();
            if (this.gameState.over) {
                this.loseEvent();
            }
            if (this.gameState.won) {
                this.winEvent();
            }
        }
    }

    moveHelper(direction) {
        let moved = false;

        switch (direction) {
            case 'right':
                moved = moved || this.horizontallyMove('right');
                break;
            case 'left':
                moved = moved || this.horizontallyMove('left');
                break;
            case 'up':
                moved = moved || this.verticallyMove('up');
                break;
            case 'down':
                moved = moved || this.verticallyMove('down');
                break;
        }

        return moved;
    }

    horizontallyMove(direction) {
        let board = this.gameState.board;
        let moved = false;
        if (direction == 'left') {
            for (let i = 0; i < this.width; i++) {

                let mergable = 0;
                for (let j = 0; j < this.width; j++) {
                    let currentIndex = i * this.width + j;

                    if (board[currentIndex] == 0) {
                        continue;
                    }

                    for (let k = j - 1; k >= mergable; k--) {
                        if (board[i * this.width + k] == 0) {

                            board[i * this.width + k] = board[currentIndex];
                            board[currentIndex] = 0;
                            currentIndex -= 1;
                            moved = true;
                            continue;
                        } else if (board[i * this.width + k] == board[currentIndex]) {

                            board[i * this.width + k] = board[i * this.width + k] * 2;
                            board[currentIndex] = 0;
                            this.gameState.score += board[i * this.width + k];

                            if (board[i * this.width + k] == 2048) {
                                this.gameState.won = true;
                            }
                            mergable += 1;
                            moved = true;
                            break;
                        } else {

                            mergable += 1;
                            break;
                        }
                    }
                }
            }
        } else {
            for (let i = 0; i < this.width; i++) {
                let mergable = this.width - 1;

                for (let j = this.width - 1; j >= 0; j--) {
                    let currentIndex = i * this.width + j;

                    if (board[currentIndex] == 0) {
                        continue;
                    }
                    
                    for (let k = j + 1; k <= mergable; k++) {
                        if (board[i * this.width + k] == 0) {
                            board[i * this.width + k] = board[currentIndex];
                            board[currentIndex] = 0;
                            currentIndex += 1;
                            moved = true;
                            continue;
                        } else if (board[i * this.width + k]
                                    == board[currentIndex]) {
                            board[i * this.width + k] = board[i * this.width + k] * 2;
                            board[currentIndex] = 0;
                            this.gameState.score += board[i * this.width + k];

                            if (board[i * this.width + k] == 2048) {
                                this.gameState.won = true;
                            }
                            mergable -= 1;
                            moved = true;
                            break;
                        } else {
                            mergable -= 1;
                            break;
                        }
                    }
                }
            }
        }

        return moved;
    }

    verticallyMove(direction) {
        let board = this.gameState.board;
        let moved = false;
        if (direction == 'up') {
            for (let j = 0; j < this.width; j++) {



                let mergable = 0;
                for (let i = 0; i < this.width; i++) {
                    let currentIndex = i * this.width + j;

                    if (board[currentIndex] == 0) {
                        continue;
                    }

                    for (let k = i - 1; k >= mergable; k--) {
                        if (board[k*this.width + j] == 0) {

                            board[k*this.width + j] = board[currentIndex];
                            board[currentIndex] = 0;
                            currentIndex -= this.width;
                            moved = true;
                            continue;
                        } else if (board[k*this.width + j]
                                    == board[currentIndex]) {

                            board[k*this.width + j] = board[k*this.width + j] * 2;
                            board[currentIndex] = 0;
                            this.gameState.score += board[k*this.width + j];

                            if (board[k*this.width + j] == 2048) {
                                this.gameState.won = true;
                            }
                            mergable += 1;
                            moved = true;
                            break;
                        } else {

                            mergable += 1;
                            break;
                        }
                    }
                }
            }
        } else {
            for (let j = 0; j < this.width; j++) {
                let mergable = this.width - 1;
                for (let i = this.width - 1; i >= 0; i--) {
                    let currentIndex = i * this.width + j;
                    if (board[currentIndex] == 0) {
                        continue;
                    }
                    for (let k = i + 1; k <= mergable; k++) {
                        if (board[k*this.width + j] == 0) {

                            board[k*this.width + j] = board[currentIndex];
                            board[currentIndex] = 0;
                            currentIndex += this.width;
                            moved = true;
                            continue;
                        } else if (board[k*this.width + j]
                                    == board[currentIndex]) {
                            board[k*this.width + j] = board[k*this.width + j] * 2;
                            board[currentIndex] = 0;
                            this.gameState.score += board[k*this.width + j];

                            if (board[k*this.width + j] == 2048) {
                                this.gameState.won = true;
                            }
                            mergable -= 1;
                            moved = true;
                            break;
                        } else {
                            mergable -= 1;
                            break;
                        }
                    }
                }
            }
        }

        return moved;
    }

    checkWinLose() {

        for (let i = 0; i < this.gameState.board.length; i++) {
            if (this.gameState.board[i] == 0) {
                return false;
            }
        }

        for (let i = 0; i < this.width; i++) {

            if (this.gameState.board[i * this.width]
                == this.gameState.board[i * this.width + 1]) {
                    return false;
            }

            for (let j = 1; j < this.width - 1; j++) {
                let center = this.gameState.board[i * this.width + j];
                let right = this.gameState.board[i * this.width + j + 1]; 
                if (center == right) {
                    return false;
                }
            }
        }
        
        for (let j = 0; j < this.width; j++) {
            if (this.gameState.board[j]
                == this.gameState.board[j + this.width]) {
                    return false;
            }

            for (let i = 1; i < this.width - 1; i++) {
                let center = this.gameState.board[i * this.width + j];
                let bottom = this.gameState.board[(i+1)*this.width + j];
                if (center == bottom) {
                    return false;
                }
            }
        }

        return true;
    }
   
    toString() {
        let myString = "";
        let i = 0;
        this.gameState.board.forEach(tile => {
            myString += ("[" + tile + "]");
            i++;
            if (i % this.width == 0) {
                myString += "\n";
            } else {
                myString+= " ";
            }
        });
        return myString;
    }

    onMove(callback) {
        this.moveListeners.push(callback);
    }

    onWin(callback) {
        this.winListeners.push(callback);
    }

    onLose(callback) {
        this.loseListeners.push(callback);
    }

    getGameState() {
        return this.gameState;
    }
}