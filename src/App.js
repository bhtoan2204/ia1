import { useState } from 'react';
import './App.css';

function Square({ value, onSquareClick, isWinningSquare }) {
  const squareClassName = isWinningSquare ? 'square winning-square' : 'square';
  return (
    <button className={squareClassName} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = 'Winner: ' + winner.winner;
  } else if (squares.every((square) => square)) {
    status = 'It\'s a draw!';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  const boardRows = [];
  const winningSquares = winner ? winner.squares : [];
  
  for (let row = 0; row < 3; row++) {
    const rowSquares = [];
    for (let col = 0; col < 3; col++) {
      const squareIndex = row * 3 + col;
      const isWinningSquare = winningSquares.includes(squareIndex);
      rowSquares.push(
        <Square
          key={squareIndex}
          value={squares[squareIndex]}
          onSquareClick={() => handleClick(squareIndex)}
          isWinningSquare={isWinningSquare}
        />
      );
    }
    boardRows.push(
      <div key={row} className="board-row">
        {rowSquares}
      </div>
    );
  }

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        squares: [a, b, c],
        winner: squares[a],
      };
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [sortAsc, setSortAsc] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function toggleSort() {
    setSortAsc(!sortAsc);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const row = Math.floor(move / 3);
      const col = move % 3;
      description = `Go to move #${move} (${row}, ${col})`;
    } else {
      description = 'Go to game start';
    }

    if (move === currentMove) {
      description = 'You are at move #' + move;
    }

    return (
      <li key={move}>
        {move === currentMove ? (
          <span>{description}</span>
        ) : (
          <button onClick={() => jumpTo(move)}>{description}</button>
        )}
      </li>
    );
  });

  if (!sortAsc) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button onClick={toggleSort}>
          Sort {sortAsc ? 'Descending' : 'Ascending'}
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}