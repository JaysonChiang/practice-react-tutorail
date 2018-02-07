import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';

const Square = ({ onClick, value, isWinner }) => {
    let redStyle = { color: "red" };

    if (isWinner) {
        value = <span style={redStyle}>{value}</span>
    }

    return (
        <button className="square" onClick={onClick}>
            {value}
        </button>
    )
};
Square.propTypes = {
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string,
    isWinner: PropTypes.bool
}


class Board extends React.Component {

    renderSquare(i) {
        return <Square
            key={i}
            isWinner={!!this.props.winnerSquares && this.props.winnerSquares.indexOf(i) >= 0}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {

        //3.Rewrite Board to use two loops to make the squares instead of hardcoding them.

        const cols = [];
        let count = 0;
      
        for (let j = 0; j < 3; j++) {
            let rows = [];
            for (let i = 0; i < 3; i++) {
                rows.push(
                    this.renderSquare(count)
                );
                count = count + 1;
            }
            cols.push(
                <div className="board-row" key={count}>
                    {rows}
                </div>
            );
        }

        return (
            <div>
                {cols}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                location: 0
            }],
            stepNumber: 0,
            xIsNext: true,
            isAscending: true,
            winnerSquares: null
        }
    }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinnerSquares(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                location: i
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
            winnerSquares: null
        });
    }

    //4. Add a toggle button that lets you sort the moves in either ascending or descending order.
    handleOrder() {
        this.setState({
            isAscending: !this.state.isAscending,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winnerSquares = calculateWinnerSquares(current.squares); //4. When someone wins, highlight the three squares that caused the win.
        const winner = !!winnerSquares ? current.squares[winnerSquares[0]] : null;
        //1. Display the location for each move in the format (col, row) in the move history list.
        let moves = history.map((step, move) => {
            let desc = move ?
                'Go to move #' + calculateLocation(step.location) :
                'Go to game start';

            //2. Bold the currently selected item in the move list.
            if ((history.length) === (move + 1)) {
                desc = <b>{desc}</b>;
            }

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        });

        if (!this.state.isAscending) {
            moves.reverse();
        }

        let status;
        if (winner) {
            status = "Winner:" + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winnerSquares={winnerSquares}
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.handleOrder()}>order</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateLocation(count) {
    var row = (count % 3) + 1;
    var col = Math.floor(+(count / 3)) + 1;
    return '(' + row + ',' + col + ')'
}

function calculateWinnerSquares(squares) {
    console.log(squares);
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
            console.log(lines[i]);
            return lines[i];
        }
    }
    return null;
}
