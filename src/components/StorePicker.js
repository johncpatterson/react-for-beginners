import React from 'react';
import { getFunName } from '../helpers';

class StorePicker extends React.Component {
	// constructor() {
	//     super();
	//     this.goToStore = this.goToStore.bind(this);
	// }

	goToStore(event) {
		event.preventDefault();
		// Get text from box
		console.log('you changed the URL');
		const storeId = this.storeInput.value;

		// Transition to correct URL
		console.log(`you are navigating to ${storeId}`);
		this.context.router.transitionTo(`/store/${storeId}`);
	}
	render() {
		return (
			<form
				className="store-selector"
				onSubmit={this.goToStore.bind(this)}>
				<h2>Please Enter a Store</h2>
				<input
					type="text"
					required
					placeholder="Store Name"
					defaultValue={getFunName()}
					ref={input => {
						this.storeInput = input;
					}}
				/>
				<button type="submit">Visit Store</button>
			</form>
		);
	}
}

StorePicker.contextTypes = {
	router: React.PropTypes.object
};

export default StorePicker;
