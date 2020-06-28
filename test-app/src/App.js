import React from 'react';
import PropTypes from 'react'

import './App.scss';


class Leaderboard extends React.Component{
    
    render(){
       return( <div className="leaderboard">
           <div className="leaderboard-container">
            <div className="leaderboard-title">
                <span>Leaderboard</span>
            </div>
            <div className="leaderboard-content">
                <div className="leaderboard-player">
                   <span>Cristi : 60</span>
                  
                </div>
                <div className="leaderboard-player">
                   <span>Iulia : 90</span>
                   
                </div>
                <div className="leaderboard-player">
                   <span>Ioana: 102</span>
                   
                </div>
            </div>
            </div>
        </div>
       )}
}

// Cell Class
class Cell extends React.Component {
  getValue() {
    const {value} = this.props;
    
    if (!value.isRevealed) {
      return this.props.value.isFlagged ? "🏳️" : null;
    }
    if (value.isMine) {
      return "💣";
    }
    if (value.neighbour === 0) {
      return null;
    }
    return value.neighbour;
  }

  render() {
    const {value, onClick, cMenu} = this.props;
    let className =
      "cell" +
      (value.isRevealed ? "" : " hidden") +
      (value.isMine ? " is-mine" : "") +
      (value.isFlagged ? " is-flag" : "");

    return (
      <div
        onClick={onClick}
        className={className}
        onContextMenu={cMenu}
      >
        {this.getValue()}
      </div>
    );
  }
}

// Board Class
class Board extends React.Component {
  state = {
        boardData: this.initBoardData(this.props.height, this.props.width, this.props.mines),
        gameStatus: "Game in progress",
        mineCount: this.props.mines,
        time: 0,
        hasStarted:false,
        myInterval:0,
    };

    tick=()=>{
      if (this.state.gameStatus==="Game in progress"){
      

      this.setState({myInterval:setInterval(()=>{
        this.setState({
          time:this.state.time+1
        })
      },1000)})
     



    }
    }



    

    /* Helper Functions */

    // get mines
    getMines(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isMine) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get Flags
    getFlags(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (dataitem.isFlagged) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get Hidden cells
    getHidden(data) {
        let mineArray = [];

        data.map(datarow => {
            datarow.map((dataitem) => {
                if (!dataitem.isRevealed) {
                    mineArray.push(dataitem);
                }
            });
        });

        return mineArray;
    }

    // get random number given a dimension
    getRandomNumber(dimension) {
        // return Math.floor(Math.random() * dimension);
        return Math.floor((Math.random() * 1000) + 1) % dimension;
    }

    // Gets initial board data
    initBoardData(height, width, mines) {
        let data = this.createEmptyArray(height, width);
        data = this.plantMines(data, height, width, mines);
        data = this.getNeighbours(data, height, width);
        return data;
    }
    createEmptyArray(height, width) {
        let data = [];

        for (let i = 0; i < height; i++) {
            data.push([]);
            for (let j = 0; j < width; j++) {
                data[i][j] = {
                    x: i,
                    y: j,
                    isMine: false,
                    neighbour: 0,
                    isRevealed: false,
                    isEmpty: false,
                    isFlagged: false,
                };
            }
        }
        return data;
    }

    // plant mines on the board
    plantMines(data, height, width, mines) {
        let randomx, randomy, minesPlanted = 0;

        while (minesPlanted < mines) {
            randomx = this.getRandomNumber(width);
            randomy = this.getRandomNumber(height);
            if (!(data[randomx][randomy].isMine)) {
                data[randomx][randomy].isMine = true;
                minesPlanted++;
            }
        }

        return (data);
    }

    // get number of neighbouring mines for each board cell
    getNeighbours(data, height, width) {
        let updatedData = data, index = 0;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j].isMine !== true) {
                    let mine = 0;
                    const area = this.traverseBoard(data[i][j].x, data[i][j].y, data);
                    area.map(value => {
                        if (value.isMine) {
                            mine++;
                        }
                    });
                    if (mine === 0) {
                        updatedData[i][j].isEmpty = true;
                    }
                    updatedData[i][j].neighbour = mine;
                }
            }
        }

        return (updatedData);
    };

    // looks for neighbouring cells and returns them
    traverseBoard(x, y, data) {
        const el = [];

        //up
        if (x > 0) {
            el.push(data[x - 1][y]);
        }

        //down
        if (x < this.props.height - 1) {
            el.push(data[x + 1][y]);
        }

        //left
        if (y > 0) {
            el.push(data[x][y - 1]);
        }

        //right
        if (y < this.props.width - 1) {
            el.push(data[x][y + 1]);
        }

        // top left
        if (x > 0 && y > 0) {
            el.push(data[x - 1][y - 1]);
        }

        // top right
        if (x > 0 && y < this.props.width - 1) {
            el.push(data[x - 1][y + 1]);
        }

        // bottom right
        if (x < this.props.height - 1 && y < this.props.width - 1) {
            el.push(data[x + 1][y + 1]);
        }

        // bottom left
        if (x < this.props.height - 1 && y > 0) {
            el.push(data[x + 1][y - 1]);
        }

        return el;
    }

    // reveals the whole board
    revealBoard() {
        let updatedData = this.state.boardData;
        updatedData.map((datarow) => {
            datarow.map((dataitem) => {
                dataitem.isRevealed = true;
            });
        });
        this.setState({
            boardData: updatedData
        })
    }

    /* reveal logic for empty cell */
    revealEmpty(x, y, data) {
        let area = this.traverseBoard(x, y, data);
        area.map(value => {
            if (!value.isFlagged && !value.isRevealed && (value.isEmpty || !value.isMine)) {
                data[value.x][value.y].isRevealed = true;
                if (value.isEmpty) {
                    this.revealEmpty(value.x, value.y, data);
                }
            }
        });
        return data;

    }

    // Handle User Events

    _handleCellClick(x, y) {

        if(this.state.hasStarted===false)
        {
            this.setState({hasStarted:true})
            this.tick()
        }
        // check if revealed. return if true.
        if (this.state.boardData[x][y].isRevealed || this.state.boardData[x][y].isFlagged)
        
        return null;
            
        // check if mine. game over if true
        if (this.state.boardData[x][y].isMine) {
            this.setState({gameStatus: "You Lost."});
            this.revealBoard();
            //oprim timerul 
            clearInterval(this.state.myInterval)
            
            //sendScoreToAPI(this.state.time);
            
            //alert("game over");
        }

        let updatedData = this.state.boardData;
        updatedData[x][y].isFlagged = false;
        updatedData[x][y].isRevealed = true;

        if (updatedData[x][y].isEmpty) {
         
            
            updatedData = this.revealEmpty(x, y, updatedData);
        }

        if (this.getHidden(updatedData).length === this.props.mines) {
            this.setState({mineCount: 0, gameStatus: "You Win."});
            this.revealBoard();
            
                
                
            clearInterval(this.state.myInterval)
            
          
            //sendScoreToAPI();
        }

        this.setState({
            boardData: updatedData,
            mineCount: this.props.mines - this.getFlags(updatedData).length,
        });
    }

    _handleContextMenu(e, x, y) {
        e.preventDefault();
        let updatedData = this.state.boardData;
        let mines = this.state.mineCount;

        // check if already revealed
        if (updatedData[x][y].isRevealed) return;

        if (updatedData[x][y].isFlagged) {
            updatedData[x][y].isFlagged = false;
            mines++;
        } else {
            updatedData[x][y].isFlagged = true;
            mines--;
        }

        if (mines === 0) {
            const mineArray = this.getMines(updatedData);
            const FlagArray = this.getFlags(updatedData);
            if (JSON.stringify(mineArray) === JSON.stringify(FlagArray)) {
                this.setState({mineCount: 0, gameStatus: "You Win."});
                this.revealBoard();
                //alert("You Win");
                clearInterval(this.state.interval);
                sendScoreToAPI();
            }
        }

        this.setState({
            boardData: updatedData,
            mineCount: mines,
        });
    }

    renderBoard(data) {
        return data.map((datarow) => {
            return datarow.map((dataitem) => {
                return (
                    <div key={dataitem.x * datarow.length + dataitem.y}>
                        <Cell
                            onClick={() => this._handleCellClick(dataitem.x, dataitem.y) } 
                            cMenu={(e) => this._handleContextMenu(e, dataitem.x, dataitem.y)}
                            value={dataitem}
                        />
                        {(datarow[datarow.length - 1] === dataitem) ? <div className="clear" /> : ""}
                    </div>);
            })
        });

    }

   



  render() {
        return (
            <div className="board">
                <div className="game-info">
                    <h1 className="info">{this.state.gameStatus}</h1>
                    <span className="info">Mines remaining: {this.state.mineCount}</span>
        <span className="info">TIMER: {this.state.time}</span>
                </div>
                {
                    this.renderBoard(this.state.boardData)
                }
                  
                    <Leaderboard/>
                
               
               
                
            </div>

            
        );
    }
}

// Game Class
class Game extends React.Component {
  state = {
    height: 6,
    width: 6,
    mines: 6,
    
  };

  render() {
    const { height, width, mines } = this.state;
    
    return (
      <div className="game">
        <Board height={height} width={width} mines={mines} />
      </div>
    );
  }
}

Cell.propTypes = {
  value: PropTypes.func
}


var sendScoreToAPI = (time) => {
    //get player name from browser prompt
    var playerName = prompt("Congrats for winning the game! Please enter your name: ", "yourUsername");
    if (playerName != null) {
      var dataToSave = {
        time: time, //replace 10 with your actual variable (probably this.state.gameScore or this.state.time)
        name: playerName,
       // currentTime: new Date()
      };
      // Actual API call
      fetch(
        "http://localhost:1601/api/ms", // replace with the url to your API
        {
          method: 'POST', 
          headers: {
             'Content-Type': 'application/json'
          },
          body: JSON.stringify(dataToSave)
        }
        )
        .then(res => res.json())
        .then(
          (result) => {
            alert('You saved your score');
          },
          // Note: it's important to handle errors here
          (error) => {
            alert('Bad API call');
            console.log(error);
          }
        )
    }
  }
        
       /*async function postData(url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          mode: 'no-cors', // no-cors, *cors, same-origin
          //cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          //credentials: 'same-origin', // include, *same-origin, omit
          headers: {
            'Accept': 'application/json, text/plain',
            'Content-Type': 'application/json;charset=UTF-8'
            },

         // redirect: 'follow', // manual, *follow, error
         // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        });
        return response.json(); // parses JSON response into native JavaScript objects
      }
      
      postData('https://localhost:44368/api/ms', { name:"test",time:1000 })
        .then(data => {
          console.log(data); // JSON data parsed by `response.json()` call
        });*/




    

  




  export default Game
