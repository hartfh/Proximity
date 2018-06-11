var ComponentGenerator = function(ComponentClass, engine) {
	this.init(ComponentClass, engine);
};

ComponentGenerator.prototype.init = function(ComponentClass, engine) {
	var _self				= this;
	var _ComponentClass		= ComponentClass;	// A class to be instantiated when adding components
	var _components		= {};			// A container for all components tracked as they're generated
	var _componentCounter	= 0;				// Used to create a unique ID for each component. Incremented with each new component
	var _engine			= engine;
	var _order			= [];			// Stores component handles in their desired order

	/**
	 * Instantiates a new object of type _ComponentClass and adds it to _components.
	 *
	 * @method	addComponent
	 * @public
	 * @param		{object}	componentConfig	Configuration object for the component to be instantiated
	 * @return	{object}
	 */
	_self.addComponent = function(componentConfig, position = false) {
		var handle = _componentCounter;

		if( componentConfig.handle ) {
			handle = componentConfig.handle + '-' + handle;
		}

		componentConfig.engine = _engine;

		var component = new _ComponentClass(componentConfig);

		_components[handle] = component;
		_componentCounter++;
		_order.push(handle);

		if( position ) {
			_self.reorderComponent(handle, position);
		}

		return component;
	};

	/**
	 * Removes a component from the _components container.
	 *
	 * @method	removeComponent
	 * @public
	 * @param		{string}	handle	The component's handle
	 */
	_self.removeComponent = function(handle) {
		if( _components.hasOwnProperty(handle) ) {
			var component = _components[handle];

			component.destroy();

			delete _components[handle];
		}
	};

	/**
	 * Get private _components property.
	 *
	 * @method	getComponents
	 * @public
	 * @return	{object}
	 */
	_self.getComponents = function() {
		return _components;
	};

	/**
	 * Gets a component by its handle.
	 *
	 * @method	getComponent
	 * @public
	 * @param		{string}	handle	The component's handle
	 * @return	{object}			Returns false if no component by that handle exists
	 */
	_self.getComponent = function(handle) {
		if( _components.hasOwnProperty(handle) ) {
			return _components[handle];
		}

		return false;
	};

	/**
	 * Loops through all components and passes them to a callback function after ordering them.
	 *
	 * @method	eachComponent
	 * @public
	 * @param		{function}	callback		A callback function. Gets passed a component and its handle as arguments. Returning false will break the loop.
	 */
	_self.eachComponent = function(callback) {
		var orderedComponents = {};

		// Sort the components before passing them to the callback function
		for(var handle in _components) {
			var position	= _order.indexOf(handle);
			var component	= _components[handle];

			orderedComponents[position] = component;
		}

		// Pass each component to the callback function
		for(var index in orderedComponents) {
			var component	= orderedComponents[index];
			var response	= callback(component);

			// Break if the callback returns false
			if( typeof(response) != 'undefined' ) {
				if( !response ) {
					break;
				}
			}
		}
	};

	/**
	 * Reorders a component's handle in _order.
	 *
	 * @method	reorderComponent
	 * @public
	 * @param		{string}	handle		Component handle
	 * @param		{number}	newPosition	The new position for the component
	 */
	_self.reorderComponent = function(handle, newPosition) {
		if( typeof(newPosition) != 'number' ) {
			return;
		}

		var index		= _order.indexOf(handle);
		var origLength	= _order.length;

		// Exit if the new and current positions match
		if( newPosition == index ) {
			return;
		}

		// Remove the element
		_order.splice(index, 1);
		/*
		if( index == 0 ) {
			_order = _order.slice(1);
		} else {
			var piece1 = _order.slice(0, index);
			var piece2 = _order.slice(index + 1);

			_order = [...piece1, ...piece2];
		}
		*/

		// Add the element at the desired position
		if( (newPosition + 1) >= origLength ) {
			_order.push(handle);
		} else if( newPosition == 0 ) {
			_order.unshift(handle);
		} else {
			var piece1 = _order.slice(0, newPosition);
			var piece2 = _order.slice(newPosition);

			_order = [...piece1, handle, ...piece2];
		}
	};
}
