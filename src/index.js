import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class App extends React.Component {
	constructor() {
		super();
		//the following line makes a 2d array containing 3 arrays of 3 arrays in each. after calling Array(3), an empty fill() will actually add elements of type undefined to it. without this, even though the length is set, there is nothing for the following map call to use.
		// this.testArr = Array(3).fill().map( ()=> Array(3).fill(false) );
		this.logicArr = Array(10).fill().map( (value,index)=> Array(10).fill(false) )
    this.state = {
			logicArr:this.logicArr
    };
		console.log(this.state.logicArr);
	}


	render() {
		//make an array of jsx grid square components
		// let arrOfGridSquares=[<Square key={0} alive={true}/>];
		let arrOfGridSquares = [];
		for(let i = 0; i<10 ; i++){
			for(let j = 0; j<10 ; j++){
				console.log(i+''+j);
				arrOfGridSquares.push(
					<Square key={''+i+j} row={i} col={j} alive={this.state.logicArr[i][j]}/>
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

			</div>
		);
	}
}

//passed in props: row col key alive
const Square = (props)=> {
	return (
		<div 
			className={ props.alive ? 'gridSquare on' : 'gridSquare'}
			onClick={()=>alert(`I am in row ${props.row} column ${props.col}`)}
		></div>
	);
}

//------------------------------------------------------------------------------------------------------------------
//render to react's virtualdom
ReactDOM.render(<App />, document.getElementById('root'));
