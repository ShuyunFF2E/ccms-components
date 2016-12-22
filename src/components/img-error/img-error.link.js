/**
 * Created with img-error.link.js.js
 * @Author: maxsmu
 * @Homepage: https://github.com/maxsmu
 * @Date: 2016-12-22 PM4:22
 */
export default (scope, element, attrs) => {
	const imgElement = element[0];
	imgElement.onerror = event => {
		event.target.src = scope.ccImgDefault;
		typeof scope.ccImgOnerror === 'function' && scope.ccImgOnerror({event});
	};
};
