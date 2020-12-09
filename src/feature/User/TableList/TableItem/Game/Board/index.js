import React from 'react';
import Square from './Square/index.js';

let numRow = 15;
let numCol = 15;

function Board({squares, onClick, winLine}) {
    const rows = [];
    for (let row = 0; row < numRow; row++)
      rows.push(renderRow(row));
    return (
      <div>
        {rows}
      </div>
    );
    function renderSquare(i) {
    //let isWin = false;
    let color;
      if (squares[i] == 'X')
        color = 'red';
      else
        color = 'green';
    //   for (var idx = 0; idx < winLine.length; idx++) {
    //     if (i == winLine[idx]) {
    //       isWin = true;
    //       break;
    //     }
    //   }
    //   if (isWin)
    //     color = 'blue';
      return (
        <Square
          value={squares[i]}
          onClick={() => onClick(i)}
          color={color}
        />
      );
    }
    function renderRow(row) {
      const cols = []
      for (let col = 0; col < numCol; col++)
        cols.push(renderSquare(row * numCol + col));
      return (
        <div className="board-row">
          {cols}
        </div>
      );
    }
}
  
  
  export default Board;