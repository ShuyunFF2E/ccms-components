/*
* copy from https://github.com/angular/angular.js/blob/master/src/ng/directive/ngEventDirs.js
* 支持捕获事件
* */

import angular from 'angular';

let ngEventDirectives = {};

let directiveNormalize = directiveName => {
	return directiveName.replace(/-([a-z])/g, g => g[1].toUpperCase());
};

let forceAsyncEvents = {
	'blur': true,
	'focus': true
};

angular.forEach(
	'click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste'.split(' '),
	function(eventName) {
		let directiveName = directiveNormalize('cc-capture-' + eventName);
		ngEventDirectives[directiveName] = ['$parse', '$rootScope', function($parse, $rootScope) {
			return {
				restrict: 'A',
				compile: function($element, attr) {
					var fn = $parse(attr[directiveName]);
					return function ngEventHandler(scope, element) {
						element.on(eventName, function(event) {
							var callback = function() {
								fn(scope, {$event: event});
							};
							if (forceAsyncEvents[eventName] && $rootScope.$$phase) {
								scope.$evalAsync(callback);
							} else {
								scope.$apply(callback);
							}
						}, true);
					};
				}
			};
		}];
	}
);

export default angular.module('ccms.components.captureEvent', [])
	.directive(ngEventDirectives)
	.name;
