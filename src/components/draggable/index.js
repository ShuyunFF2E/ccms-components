import angular from 'angular';

function ddo($parse) {
	return {

		restrict: 'A',
		link(scope, element, attrs) {

			const dragHandler = element[0].querySelector('[cc-drag-handler]') || element[0];

			element[0].addEventListener('mousedown', function(evt) {

				if (!dragHandler.contains(evt.target) && !evt.target.hasAttribute('cc-drag-handler')) {
					return;
				}

				let L = 0;
				let T = 0;

				element[0].style.position = 'absolute';

				if (element[0].setCapture) {
					element[0].setCapture();
				}

				const e = evt || window.event;
				const disX = e.clientX - this.offsetLeft;
				const disY = e.clientY - this.offsetTop;

				const mousemoveListener = function(evt) {

					const e = evt || window.event;
					L = e.clientX - disX;
					T = e.clientY - disY;

					if (T < 0) {
						T = 0;
					} else if (T > document.documentElement.clientHeight - element[0].offsetHeight) {
						T = document.documentElement.clientHeight - element[0].offsetHeight;
					}

					if (L < 0) {
						L = 0;
					} else if (L > document.documentElement.clientWidth - element[0].offsetWidth) {
						L = document.documentElement.clientWidth - element[0].offsetWidth;
					}

					if (T < 0) T = 0;

					element[0].style.left = `${L}px`;
					element[0].style.top = `${T}px`;
				};

				const mouseupListener = function() {

					document.removeEventListener('mousemove', mousemoveListener, false);
					document.removeEventListener('mouseup', mouseupListener, false);

					if (element[0].releaseCapture) {
						element[0].releaseCapture();
					}

					// 建议修改为 EventBus
					scope.$broadcast('ccDragEnd', {left: L, top: T});

				};

				document.addEventListener('mousemove', mousemoveListener, false);
				document.addEventListener('mouseup', mouseupListener, false);

				evt.preventDefault();

			}, false);
		}
	};
}

ddo.$inject = ['$parse'];

export default angular.module('ccms.components.ccDraggable', [])
	.directive('ccDraggable', ddo)
	.name;
