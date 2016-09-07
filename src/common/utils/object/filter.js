/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-09-07
 */

export default (obj, iterator) => {

	const result = {};

	for (let prop in obj) {
		if (obj.hasOwnProperty(prop)) {
			if (iterator(obj[prop], prop)) {
				result[prop] = obj[prop];
			}
		}
	}

	return result;
};
