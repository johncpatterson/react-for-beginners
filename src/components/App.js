import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
//import StorePicker from './StorePicker';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';
import base from '../base';

class App extends React.Component {
	constructor() {
		super();

		// bind addFish and loadSample functions to the app
		this.addFish = this.addFish.bind(this);
		this.updateFish = this.updateFish.bind(this);
		//this.removeFish = this.removeFish.bind(this);
		this.loadSamples = this.loadSamples.bind(this);
		this.addToOrder = this.addToOrder.bind(this);
		this.removeFromOrder = this.removeFromOrder.bind(this);

		// initial state
		this.state = {
			fishes: {},
			order: {}
		};
	}

	componentWillMount() {
		// runs before this app is rendered
		this.ref = base.syncState(`${this.props.params.storeId}/fishes`, {
			context: this,
			state: 'fishes'
		});

		const localStorageRef = localStorage.getItem(
			`order-${this.props.params.storeId}`
		);

		if (localStorageRef) {
			// update the App component's order state
			this.setState({
				order: JSON.parse(localStorageRef)
			});
		}
	}

	componentWillUnmount() {
		base.removeBinding(this.ref);
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem(
			`order-${this.props.params.storeId}`,
			JSON.stringify(nextState.order)
		);
	}

	addFish(fish) {
		// copy state object with spread operator
		const fishes = {
			...this.state.fishes
		};
		// create timestamp
		const timeStamp = Date.now();
		// add in new fish
		fishes[`fish-${timeStamp}`] = fish;
		// update state
		this.setState({
			fishes: fishes
		});
	}

	updateFish(key, updatedFish) {
		const fishes = {
			...this.state.fishes
		};
		fishes[key] = updatedFish;
		this.setState({
			fishes
		});
	}

	removeFish = key => {
		const fishes = {
			...this.state.fishes
		};
		fishes[key] = null;
		this.setState({
			fishes
		});
	};

	loadSamples() {
		// update state
		this.setState({
			fishes: sampleFishes
		});
	}

	addToOrder(key) {
		// copy state object
		const order = {
			...this.state.order
		};
		// add new number of fish ordered
		order[key] = order[key] + 1 || 1;
		this.setState({
			order: order
		});
	}

	removeFromOrder(key) {
		const order = {
			...this.state.order
		};
		delete order[key];
		this.setState({
			order
		});
	}

	render() {
		return (
			<div className="catch-of-the-day">
				<div className="menu">
					<Header tagline="Fresh Seafood Market" />
					<ul className="list-of-fishes">
						{Object.keys(this.state.fishes).map(key => (
							<Fish
								key={key}
								index={key}
								details={this.state.fishes[key]}
								addToOrder={this.addToOrder}
							/>
						))}
					</ul>
				</div>
				<Order
					fishes={this.state.fishes}
					order={this.state.order}
					params={this.props.params}
					removeFromOrder={this.removeFromOrder}
				/>
				<Inventory
					addFish={this.addFish}
					loadSamples={this.loadSamples}
					fishes={this.state.fishes}
					updateFish={this.updateFish}
					removeFish={this.removeFish}
					storeId={this.props.params.storeId}
				/>
			</div>
		);
	}
}

App.propTypes = {
	params: React.PropTypes.object.isRequired
};

export default App;
