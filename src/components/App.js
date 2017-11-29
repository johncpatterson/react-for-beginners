import React from 'react';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';
import StorePicker from './StorePicker';
import sampleFishes from '../sample-fishes';
import Fish from './Fish';

class App extends React.Component {
    constructor() {
        super();
        // bind addFish and loadSample functions to the app
        this.addFish = this.addFish.bind(this);
        this.loadSamples = this.loadSamples.bind(this);
        this.addToOrder = this.addToOrder.bind(this);

        // initial state
        this.state = {
            fishes: {},
            order: {}
        }
    }

    addFish(fish) {
        // copy state object with spread operator
        const fishes = {...this.state.fishes};
        // create timestamp
        const timeStamp = Date.now();
        // add in new fish
        fishes[`fish-${timeStamp}`] = fish;
        // update state
        this.setState({fishes: fishes});
    }

    loadSamples() {
        // update state
        this.setState({
            fishes: sampleFishes
        })
    }

    addToOrder(key) {
        // copy state object
        const order = {...this.state.order};
        // add new number of fish ordered
        order[key] = order[key] + 1 || 1;
        this.setState({order: order})
    }
    render() {
        return (
            <div className='catch-of-the-day'>
                <div className='menu'>
                    <Header tagline='Fresh Seafood Market'/>
                    <ul className='list-of-fishes'>
                        {Object
                            .keys(this.state.fishes)
                            .map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addToOrder={this.addToOrder}/>)
                        }    
                    </ul>
                </div>
                <Order />
                <Inventory addFish={this.addFish} loadSamples={this.loadSamples} />    
            </div>
        )
    }
}

export default App;