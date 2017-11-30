import React from 'react';
import AddFishForm from './AddFishForm';
import base from '../base';

class Inventory extends React.Component {
    constructor() {
        super();
        this.renderInventory = this.renderInventory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.renderLogin = this.renderLogin.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.authHandler = this.authHandler.bind(this);
        this.logOut = this.logOut.bind(this);
        this.state = {
            uid: null,
            ownder: null
        }
    }

    componentDidMount() {
        base.onAuth((user) => {
            if (user) {
                this.authHandler(null, {user});
            }
        });
    }

    handleChange(e, key) {
        const fish = this.props.fishes[key];
        console.log(fish);
        const updatedFish = {
            ...fish, 
            [e.target.name]: e.target.value
        }
        this.props.updateFish(key, updatedFish);
    }

    renderInventory(key) {
        const fish = this.props.fishes[key];
        return (
            <div className='fish-edit' key={key}>
                <input type='text' name='name' value={fish.name} placeholder='Fish Name' onChange={(e) => this.handleChange(e, key)} />
                <input type='text' name='price' value={fish.price} placeholder='Fish Price' onChange={(e) => this.handleChange(e, key)}/>
                <select type='text' name='status' value={fish.status} placeholder='Fish Status' onChange={(e) => this.handleChange(e, key)}>
                    <option value='available'>Fresh!</option>
                    <option value='unavailable'>Sold Out!</option>
                </select>
                <textarea type='text' name='desc' value={fish.desc} placeholder='Fish Desc' onChange={(e) => this.handleChange(e, key)}>
                </textarea>
                <input type='text' name='image' value={fish.image} placeholder='Fish Image' onChange={(e) => this.handleChange(e, key)}/>
                <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
            </div>
        )
    }

    renderLogin() {
        return (
            <nav className='logn'>
                <h2>Inventory</h2>
                <p>Sign in to manage your inventory</p>
                {/* <button className='github' onClick={() => this.authenticate('github')}>Log in with Github</button> */}
                <button className='facebook' onClick={() => this.authenticate('facebook')}>Log in with Facebook</button>
                {/* <button className='twitter' onClick={() => this.authenticate('twitter')}>Log in with Twitter</button> */}
            </nav>    
        )
    }

    authenticate(provider) {
        console.log(`Trying to login with ${provider}`);
        base.authWithOAuthPopup(provider, this.authHandler);
    }

    logOut() {
        base.unauth();
        this.setState({uid:null});
    }

    authHandler(err, authData) {
        console.log(authData);
        if (err) {
            console.log(err);
            return;
        }

        // get store info
        const storeRef = base.database().ref(this.props.storeId);

        //get store data
        storeRef.once('value', (snapshot) => {
            const data = snapshot.val() || {};

            //claim as our own if there is no owner already
            if (!data.owner) {
                storeRef.set({
                    owner: authData.user.uid
                })
            }
            this.setState({
                uid: authData.user.uid,
                owner: data.owner || authData.user.uid
            })
        })
    }

    render() {
        const logOut = <button onClick={this.logOut}>Log Out</button>
        // check if not logged in
        if (!this.state.uid) {
            return <div>{this.renderLogin()}</div>
        }

        // check if the person is the owner of the current store
        if (this.state.uid !== this.state.owner) {
            return (
                <div>
                    <p>Sorry you don't own this store... Try again!!</p>
                    {logOut}
                </div>    
            )
        }
        return (
            <div>
                <h2>Inventory</h2>
                {logOut}
                {Object.keys(this.props.fishes).map(this.renderInventory)}
                <AddFishForm addFish={this.props.addFish}/>
                <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
            </div>
        )
    }
}

Inventory.propTypes = {
    fishes: React.PropTypes.object.isRequired,
    updateFish: React.PropTypes.func.isRequired,
    removeFish: React.PropTypes.func.isRequired,
    addFish: React.PropTypes.func.isRequired,
    loadSamples: React.PropTypes.func.isRequired,
    storeId: React.PropTypes.string.isRequired,
};

export default Inventory;