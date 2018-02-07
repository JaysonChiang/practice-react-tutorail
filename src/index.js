import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './index.css';

const Square = ({ onClick, value }) => (
    <button className="square" onClick={onClick}>
        {value}
    </button>
);
Square.propTypes = {
    onClick: PropTypes.func.isRequired,
    value: PropTypes.string
}


class Board extends React.Component {

    renderSquare(i) {
        return <Square
            key={i}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {

        //3.Rewrite Board to use two loops to make the squares instead of hardcoding them.

        const cols = [];
        let count = 1;
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
        }
    }

    handleClick(i) {

        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
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
        const winner = calculateWinner(current.squares);

        //1. Display the location for each move in the format (col, row) in the move history list.
        const moves = history.map((step, move) => {
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
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
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
            return squares[a];
        }
    }
    return null;
}
