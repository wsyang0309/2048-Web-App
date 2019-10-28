import Game from "./engine/game.js";

function gameview() {
    return $(`
    <div id="root">
        <section id="header">
            <div class="header-text has-text-weight-semibold">2048</div>
        </section>

        <section id="game-view">
            <div id="scoreboard">
                <div class="container">
                    <div class="button has-text-weight-semibold" id="score-panel" disabled>
                        <p>Score: </p>
                        <p id="score"></p>
                    </div>
                    <button class="button is-white has-text-weight-semibold" id="newgame-button">New Game</button>
                </div>
                <div class="note-text has-text-weight-semibold">Join the numbers and get to the 2048 tile!</div>

            </div>
            
            <div id="game-section">
                <div id="game-board"></div>
            </div>

            <div class="note-text has-text-weight-semibold">HOW TO PLAY: Use your W,A,S,D or Arrow keys to move the tiles. </div>
            <div class="note-text has-text-weight-semibold"> When two tiles with the same number touch, they merge into one!</div>
        </section>
    </div>
    `);
}

function loadGame(game) {
    let width = game.width;

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            $('#game-board').append(
                $('<div class="game-tile empty-tile"></div>')
                .css({top: ((1 + i * 15)+'vmin'), left: ((1 + j * 15)+'vmin')})
            );
        }
    }

    loadScore(game);
    loadTiles(game);
}

function loadScore(game) {
    $('#score').empty().text(game.gameState.score);
}

function loadTiles(game) {
    let width = game.width;
    let board = game.gameState.board;
    let gameboard = $('#game-board');

    for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
            gameboard.find('#' + (i * width + j)).remove();

            let currentValue = board[i * width + j];
            if (currentValue != 0) {
                gameboard.append(
                    $(`<div class="game-tile centerall tile-${currentValue}">${currentValue}</div>`)
                    .css({top: ((1 + i * 15)+'vmin'), left: ((1 + j * 15)+'vmin')})
                    .attr('id', (i * width + j))
                );
            }
        }
    }
}

function detachAll() {
    $(document).off('keydown');
    let winMessage = $('#win-message');
    if (winMessage.length) {
        winMessage.remove();
    }
    let loseMessage = $('#lose-message');
    if (loseMessage.length) {
        loseMessage.remove();
    }
}

function attachEventHandlers(game) {
    $(document).keydown((keyEvent) => {
        switch(keyEvent.which) {
            case 37: // left
            case 65: // a
            game.move('left');
            break;
            case 38: // up
            case 87: // w
            game.move('up');
            break;
            case 39: // right
            case 68: // d
            game.move('right');
            break;
            case 40: // down
            case 83: // s
            game.move('down');
            break;
        };
        loadTiles(game);
        loadScore(game);
    });

    game.onLose(() => {
        $('<div id="lose-message"></div>')
        .appendTo('#root')
        .append(
            $(`
            <div>
                <p>Sorry, you have lost the game. Press <b>New Game</b> to try again</p>
            </div>
            `)
            .css({  "font-size": "6vmin", "color": "#8f7a66", 
                    "text-align": "center", "opacity": "1",
                    "background-color": "#faf8ef"})
        )
    });
    game.onWin(() => {
        if(!($('#root').find('#win-message').length)) {
            $('<div id="win-message"></div>').appendTo('#root').append(
                $(`<div>
                    <p>You won! Your score was: ${game.gameState.score}</p>
                </div>`)
                .css({  "font-size": "6vmin", "color": "#8f7a66", 
                        "text-align": "center", "opacity": "0.9", 
                        "background-color": "#faf8ef"}))
        }
    });
}

function reloadGame(game) {
    detachAll();
    loadScore(game);
    loadTiles(game);
    attachEventHandlers(game);
}

function initializePage() {
    let body = $('body');
    
    body.empty()
    body.append(gameview());

    let game = new Game(4);
    loadGame(game);
    attachEventHandlers(game);

    $('#newgame-button').on('click', () => {
        reloadGame(new Game(4));
    });
}

$(document).ready(initializePage());