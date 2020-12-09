import React, { useState } from 'react';
import Board from './Board/index.js';

import './index.css'

function Game() {
    const [squares, setSquares] = useState(Array(225).fill(null));
    const [lastMove, setLastMove] = useState(-1);

    const [xIsNext, setXIsNext] = useState(true);
    const winLine = [];

    

    function handleClick(i) {
        const currentSquares = squares.slice();
        // if (calculateWinner(currentSquares) || currentSquares[i]) {
        //     return;
        // }
        if (currentSquares[i]) {
            return;
        }

        currentSquares[i] = xIsNext ? 'X' : 'O';
        setSquares(currentSquares);
        setLastMove(i);
        setXIsNext(!xIsNext);
    }

    return (
        <div className="game">
            <div className="game-board" >
                <Board
                    squares={squares}
                    onClick={(i) => handleClick(i)}
                    winLine={winLine}
                />
            </div>

        </div>
    );
}


export default Game;