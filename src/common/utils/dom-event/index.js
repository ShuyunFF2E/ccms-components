/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-08-15
 */


function addOnceEventListener(element, event, listener) {

	const onceListener = () => {
		listener();
		element.removeEventListener(event, onceListener);
	};

	element.addEventListener(event, onceListener);

	return onceListener;
}

export {
	addOnceEventListener
};

