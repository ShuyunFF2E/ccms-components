/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-29
 */

angular
	.module('app', ['ccms.components'])
	.controller('appCtrl', function() {

		this.entity = ['A', 'B', 'C'];

		this.join = function(entity) {
			return entity.join(',');
		};

		this.opened = true;

		this.click = function(i) {
			console.log(i);
		};

		this.template = '<div>' +
			'<div ng-repeat="i in app.entity" ng-bind="i" ng-click="app.click(i)"></div>' +
			'</div>';

	});
