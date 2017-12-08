/*
This app uses the neighbour finding algorithm from Richard Hayes tutorial: https://www.youtube.com/watch?v=GB7Oh226mjM&t=100s 
*/
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
	constructor() {
		super();
		//the following line makes a 2d array containing 3 arrays of 3 arrays in each. after calling Array(3), an empty fill() will actually add elements of type undefined to it. without this, even though the length is set, there is nothing for the following map call to use.
		// this.testArr = Array(3).fill().map( ()=> Array(3).fill(false) );
		this.rows=25;
		this.cols=25;
		this.generation=0;
		this.intervalId=undefined;
    this.state = {
			logicArr: Array(this.rows).fill().map( (value,index)=> Array(this.cols).fill(false) )
    };
	}

	play = ()=>{
		clearInterval(this.intervalId); //necessary to stop running timer, or multiple will be fired
		this.intervalId = setInterval(this.nextGen, 80);
	}
	pause = ()=>{
		clearInterval(this.intervalId)
	}

	clear = ()=>{
		clearInterval(this.intervalId);
		this.generation = -1;
		this.setState({logicArr: Array(this.rows).fill().map( (value,index)=> Array(this.cols).fill(false) )});
	}

	//seed board
	seed = ()=>{
		this.generation = 0;
		//AGAIN! CLONE!!!! cant just copy over or variable references/fucks with same object
		let copy = arrayClone(this.state.logicArr);
		for(let i = 0; i<this.rows ; i++){
			for(let j = 0; j<this.cols ; j++){
				if( (Math.floor(Math.random()*5)) === 0 )
					copy[i][j]=true;
			}
		}
		this.setState({logicArr:copy});
	}

	//set a new modded arr in this.state.logicArr that will advance the board to the next generation.
	nextGen = ()=>{
		// console.time('checker');
		//CLONE ARRAY for a new copy or else new variable refrences old!!!!
		let nextArr = arrayClone(this.state.logicArr); 
		//define neighbour counter
		let neighbours = 0;
		//iterate over each cell and check its neighbours. save the status for the next gen to nextArr
		for(let i = 0; i<this.rows ; i++){
			for(let j = 0; j<this.cols ; j++){
				//reset counter instead of making it
				neighbours = 0;
				if( this.checkCell(i-1,j-1) ) neighbours++;
				if( this.checkCell(i-1,j) ) neighbours++;
				if( this.checkCell(i-1,j+1) ) neighbours++;
				if( this.checkCell(i,j-1) ) neighbours++;
				if( this.checkCell(i,j+1) ) neighbours++;
				if( this.checkCell(i+1,j-1) ) neighbours++;
				if( this.checkCell(i+1,j) ) neighbours++;
				if( this.checkCell(i+1,j+1) ) neighbours++;
				// console.log(neighbours);//don't leave this in, it slows the shit down out of the code

				//check live cells
				if( this.state.logicArr[i][j] ){
					if( neighbours < 2) nextArr[i][j] = false; //die of isolation
					if( neighbours > 3) nextArr[i][j] = false; //die of overcrowding
					//if( neighbours === 3 || neighbours === 2) nextArr[i][j] = true //live on to next gen
				}//check dead cells
				else{
					if( neighbours === 3 ) nextArr[i][j] = true;
				}
				
			}
		}
		this.setState({logicArr:nextArr});
		// console.timeEnd('checker');
	}

	//given coords of cell, return its status: true or false. also handle mirroring of edges before check 
	checkCell = (row,col)=>{
		//mirroring
		if(row === -1) row = this.rows - 1;
    if(row === this.rows) row = 0;
    if(col === -1) col = this.cols - 1;
    if(col === this.cols) col = 0;
    //retrieve and return status           
    return this.state.logicArr[row][col];
	}

	//clickhandler to manually toggle grid squares
	toggleSquare = (row,col)=>{
		let genCopy = this.generation;
		//AGAIN! CLONE!!!! cant just copy over or variable references/fucks with same object
		let copy = arrayClone(this.state.logicArr);
		copy[row][col] = !copy[row][col];
		this.setState({logicArr:copy});
		this.generation = genCopy-1;
	}

	render() {
		this.generation++;
		// console.log(this.state.logicArr);
		//make an array of jsx grid square components
		let arrOfGridSquares = [];
		for(let i = 0; i<this.rows ; i++){
			for(let j = 0; j<this.cols ; j++){
				// console.log(i+''+j);
				arrOfGridSquares.push(
					<Square 
									key={i+'_'+j}
									row={i}
									col={j}
									alive={this.state.logicArr[i][j]}
									toggleSquare={this.toggleSquare}
					/>
				);
			}
		}
		return (
			<div className="App">

				<div className="grid">
					<div className="borderWrap">
						{arrOfGridSquares}
					</div>
				</div>	
				
				<div className='gen'>generation:<span>{this.generation}</span></div>
				<br/>

				<button onClick={ this.play }>play</button>
				<button onClick={ this.pause }>pause</button>
				<button onClick={ this.clear }>clear</button>
				<button onClick={ this.seed }>seed</button>

				<br/>
				<p>
					This app uses the neighbour finding algorithm from Richard Hayes tutorial: <br/>
					https://www.youtube.com/watch?v=GB7Oh226mjM&t=100s 
				</p>

			</div>
		);
	}

	componentDidMount = ()=>{
		this.seed();
		this.play();
	}

}

//passed in props: row col key alive toggleSquare()
const Square = (props)=> {
		return (
			<div 
					className={ props.alive ? 'gridSquare on' : 'gridSquare'}
					onClick={ ()=> {props.toggleSquare(props.row,props.col)} }
			></div>
		);
}

//array deep cloner, if you just assign an array to a new variable, both variables reference the same array, so you need to make a new clean copy.
const arrayClone = (arr)=> JSON.parse(JSON.stringify(arr));

//------------------------------------------------------------------------------------------------------------------
//render to react's virtualdom
ReactDOM.render(<App />, document.getElementById('root'));
