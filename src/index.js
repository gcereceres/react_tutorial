import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
  const winnerClass=(props.isWinner) ? "winner" : "";
  return(
    <button className={"square " + winnerClass} 
            onClick = {props.onClick}>
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {

  renderSquare(i, isWinner) {
  return (
    <Square 
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      isWinner={isWinner}/>);
  }

  render() {

    const squares = ()=>{   
      const winnerMove = this.props ? this.props.winnerMove : null; 
      return (
        [0,1,2].map((i)=>{
          return <div className="board-row">
            {[0,3,6].map((j) => {
              const isWinner = winnerMove ? winnerMove.indexOf(i+j)>=0:false;
              return this.renderSquare(i+j,isWinner);
            })} 
          </div>
        })
      )
    };
    return (
      <div>
        {squares()}
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastPosition: null,
        move: 0,
      }],
      stepNumber: 0,
      xIsNext: true,
      selectedMove: 0,
      reverse: false,
      winnerMove: null,
    }
    this.reverseHistory = this.reverseHistory.bind(this);
  }
  render() {
    const history = this.state.reverse ? 
        this.state.history.reverse(): this.state.history;

    const current = history[this.state.selectedMove];
    const winnerMove = calculateWinner(current.squares);
    const selectedMove = this.state.selectedMove;
    const winner = current.squares[winnerMove?winnerMove[0]:null];

    const moves = history.map((step, i) => {
      const move = history[i].move;
      const lastPosition = history.find((h)=>{
        return h.move===move;
        }).lastPosition;

      const desc = move ?
        'Go to move #' + move + `, Position: ${lastPosition}`:
        'Go to game start';

      return(
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} className={(selectedMove===move) ? 'selected-move':''}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerMove={this.state.winnerMove}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={this.reverseHistory}>reverse</button>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  reverseHistory(){
    const reverse = this.state.reverse;
    this.setState({
      reverse: !reverse,
    });
  }

  handleClick(i){
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]){
      return;
    }
    squares[i] = this.state.xIsNext ? 'X':'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastPosition: calculatePosition(i),
        move: history.length,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      selectedMove: history.length,
      winnerMove: calculateWinner(squares),
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      selectedMove: step
    });
  }
}
  
  // ========================================
  
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares){
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
      return lines[i];
    }
  }
  return null;
}

function calculatePosition(index){
  const idx = index + 1;
  const a = Math.ceil(idx / 3);
  const b = idx % 3 === 0 ? 3 : Math.floor(idx % 3);

  return `${a}, ${b}`;
}
  