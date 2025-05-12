import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [size,setSize] = useState("40px")
  const [mineCount, setMineCount] = useState(10);
  const [sizeX, setSizeX] = useState(10);
  const [sizeY, setSizeY] = useState(10);
  const [started, setStarted] = useState(false);
  const [gameState, setGameState] = useState("");
  const [time, setTime] = useState(0.0);

  const [mineField, setMineField] = useState(
    Array(sizeX).fill().map(() => Array(sizeY).fill(0))
  );

  const [displayField, setDisplayField] = useState(
    Array(sizeX).fill().map(() => 
      Array(sizeY).fill().map(() => ({ num: 1, seen: false, flag: false }))
    )
  );  
  const create = (newX, newY, newMines) => {
    setSizeX(newX);
    setSizeY(newY);
    setMineCount(newMines);
  
    const newMineField = Array(newX).fill().map(() => Array(newY).fill(0));
    const newDisplayField = Array(newX).fill().map(() =>
      Array(newY).fill().map(() => ({ num: 1, seen: false, flag: false }))
    );
  
    setMineField(newMineField);
    setDisplayField(newDisplayField);
    setStarted(false);
    setGameState("");
    setTime(0);
  };
  
  

  useEffect(() => {
    let interval = null;
    if (started && gameState === "") {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 100);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [started, gameState]);
  
  const reveal = (x, y) => {
    if (gameState == "") {
    let revealedCount = 0;
    let placedMines = 0;
    let mineLayout = [...mineField];
    let displayCopy = displayField.map(row => row.map(cell => ({ ...cell })));

    if (!displayCopy[x][y].flag) {
      if (started) {
        if (mineLayout[x][y] === 1) {
          setGameState("YOU LOST");
        } else {
          if (displayCopy[x][y].num === 0) {
            revealEmpty(x, y, displayCopy);
          } else {
            displayCopy[x][y].seen = true;
          }
          for (let i = 0; i < sizeX; i++) {
            for (let j = 0; j < sizeY; j++) {
              if (displayCopy[i][j].seen) {
                revealedCount++;
                if (revealedCount >= (sizeY * sizeX) - mineCount) {
                  setGameState("YOU WON");
                }
              }
            }
          }
        }
      } else {
        while (placedMines < mineCount) {
          let xx = Math.floor(Math.random() * sizeX);
          let yy = Math.floor(Math.random() * sizeY);
          if (
            mineLayout[xx][yy] !== 1 &&
            Math.abs(xx - x) > 1 || Math.abs(yy - y) > 1
          ) {
            mineLayout[xx][yy] = 1;
            placedMines++;
          }
        }

        for (let i = 0; i < sizeX; i++) {
          for (let j = 0; j < sizeY; j++) {
            if (mineLayout[i][j] !== 1) {
              let surroundingMines = 0;
              for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                  if (dx === 0 && dy === 0) continue;
                  const ni = i + dx;
                  const nj = j + dy;
                  if (ni >= 0 && ni < sizeX && nj >= 0 && nj < sizeY && mineLayout[ni][nj] === 1) {
                    surroundingMines++;
                  }
                }
              }
              displayCopy[i][j].num = surroundingMines;
            }
          }
        }

        if (displayCopy[x][y].num === 0) {
          revealEmpty(x, y, displayCopy);
        } else {
          displayCopy[x][y].seen = true;
        }

        setDisplayField([...displayCopy]);
      }

      setMineField([...mineLayout]);
      setDisplayField([...displayCopy]);
      setStarted(true);
    }
  }
  };

  const toggleFlag = (e, x, y) => {
    if (gameState == "") {
    e.preventDefault();
    const copy = [...displayField];
    if (!copy[x][y].seen) {
      copy[x][y].flag = !copy[x][y].flag;
      setDisplayField(copy);
    }
  }
  };

  const revealEmpty = (x, y, displayCopy) => {
    if (x < 0 || x >= sizeX || y < 0 || y >= sizeY) return;
    if (displayCopy[x][y].seen || displayCopy[x][y].flag) return;

    displayCopy[x][y].seen = true;

    if (displayCopy[x][y].num === 0) {
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx !== 0 || dy !== 0) {
            revealEmpty(x + dx, y + dy, displayCopy);
          }
        }
      }
    }
  };

  return (
    <div className="App">
      <button className='type' onClick={() => {
        setSizeX(9);
        setSizeY(9);
        setMineCount(10);
        create(9,9,10);
        setSize("50px")
      }}>
      
        9x9 / 10 mines
      </button>
      <button className='type' onClick={() => {
        setSizeX(16);
        setSizeY(16);
        setMineCount(40);
        create(16,16,40);
        setSize("35px")
      }}>
      
        16x16 / 40 mines
      </button>
      <button className='type' onClick={() => {
        setSizeX(30);
        setSizeY(16);
        setMineCount(99);
        create(16,30,99);
        setSize("35px")
      }}>
      
        30x16 / 99 mines
      </button>

      <table>
        {displayField.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => (
              <td key={colIndex}>
                <button
                  onClick={() => {
                    if (!displayField[rowIndex][colIndex].flag) {
                      reveal(rowIndex, colIndex);
                    }
                  }}
                  onContextMenu={(e) => toggleFlag(e, rowIndex, colIndex)}
                  className="sapbtn"
                  style={{
                    height: size,
                    width:size,
                    backgroundColor: displayField[rowIndex][colIndex].seen
                      ? "rgb(182, 170, 0)"
                      : "rgb(67, 182, 0)"
                      
                    
                  }}
                >
                  {displayField[rowIndex][colIndex].seen
                    ? displayField[rowIndex][colIndex].num === 0
                      ? "\u00a0"
                      : displayField[rowIndex][colIndex].num
                    : displayField[rowIndex][colIndex].flag
                    ? "🚩"
                    : ""}
                </button>
              </td>
            ))}
          </tr>
        ))}
      </table>

      <h1>{time / 10}</h1>
      <h1>{gameState}</h1>
    </div>
  );
}

export default App;