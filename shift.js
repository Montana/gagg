* @param {string|object} selector
 * @param {string} context - optional
 * @returns {array} Shift.collection
 */

	var Shift = function(selector, context) {
		var selectedElements, ctx, els;
		if (context) {
			ctx = d.querySelectorAll(context);
			ctx = Array.prototype.slice.call(ctx);
			selectedElements = [];
			ctx.forEach(function(container) {
				els = container.querySelectorAll(selector);
				els = Array.prototype.slice.call(els);
				els.forEach(function(el) {
					selectedElements.push(el);
				});
			});
		} else {
			selectedElements = d.querySelectorAll(selector);
		}
		if (selectedElements.length > 0) this.collection = selectedElements;
	};

	var shift = function(selector, context) {
		return new Shift(selector, context);
	};

	shift.fn = Shift.prototype;

/**
 * Private functions:
 * Used throughout the library
 */

	var priv = {};

	// Loop through each member of the collection throughout each module
	priv.loop = function(collection, callback) {
		var set = Array.prototype.slice.call(collection);
		set.forEach(function(item) {
			callback.call(item);
		});
	};

	// Default properties
	priv.environment = {
		duration: '0.5s',
		easing: 'ease',
		delay: '0.5s',
		originX: '50%',
		originY: '50%'
	};

	// Easing values
	priv.easingMap = function(value) {
		var easingValue;
		switch (value) {
			case 'ease':
				easingValue = 'ease';
				break;
			case 'in':
				easingValue = 'ease-in';
				break;
			case 'out':
				easingValue = 'ease-out';
				break;
			case 'in-out':
				easingValue = 'ease-in-out';
				break;
			case 'linear':
				easingValue = 'linear';
				break;
			case 'snap':
				easingValue = 'cubic-bezier(0, 1, 0.5, 1)';
				break;
			default:
				easingValue = priv.environment['easing'];
		};
		// Override the default value if a cubic-bezier array is passed
		if (typeof value === 'object' && value.length === 4) easingValue = 'cubic-bezier(' + value[0] + ',' + value[1] + ',' + value[2] + ',' + value[3] + ')';
		return easingValue;
	};

	// Duration of each animation
	priv.timer = function(duration) {
		return typeof duration === 'number' ? duration + 's' : priv.environment['duration'];
	};

	// Multiple-value transforms
	priv.multipleValueTransform = function(target, func, timer, ease, val1, val2, deg) {
		target.style.transition = 'transform ' + timer + ' ' + ease;
		target.style.webkitTransition = '-webkit-transform ' + timer + ' ' + ease;
		target.style.transform = func + '(' + val1 + (deg ? 'deg' : '') + ',' + val2 + (deg ? 'deg' : '') + ')';
		target.style.webkitTransform = func + '(' + val1 + (deg ? 'deg' : '') + ',' + val2 + (deg ? 'deg' : '') + ')';
	};

	// Single-value transforms
	priv.singleValueTransform = function(target, func, timer, ease, val, deg) {
		target.style.transition = 'transform ' + timer + ' ' + ease;
		target.style.webkitTransition = '-webkit-transform ' + timer + ' ' + ease;
		target.style.transform = func + '(' + val + (deg ? 'deg' : '') + ')';
		target.style.webkitTransform = func + '(' + val + (deg ? 'deg' : '') + ')';
	};
