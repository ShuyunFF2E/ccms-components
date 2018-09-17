/**
 * Created by AshZhang on 2016-3-4.
 */


import './_date-picker.scss';
import template from './date-picker.tpl.html';
import { destructDate, setTextWidth } from './dateUtils';
import DatePickerCtrl from './DatePickerCtrl';


export default {

	bindToController: true,
	controller: DatePickerCtrl,
	controllerAs: 'ctrl',
	replace: true,
	require: 'ngModel',
	restrict: 'E',
	scope: {
		dateOnly: '=',
		disabled: '=',
		disabledInput: '=',
		minDate: '=',
		maxDate: '=',
		rangeStart: '=',
		rangeEnd: '=',
		start: '=',
		end: '=',
		onCalendarOpen: '&?',
		onCalendarClose: '&?',
		isFestival: '<?',
		customFestivals: '<?',
		disableYear: '<?',
		disableMonth: '<?',
		displayFormat: '@?'
	},
	template,

	link($scope, $element, $attrs, ngModelCtrl) {
		$scope.inputs = [].slice.call($element[0].querySelectorAll('input'));
		$scope.ctrl.ngModelCtrl = ngModelCtrl;

		this.setAllInputsWidth($scope);

		/**
		 * 根据日期渲染模板
		 */
		ngModelCtrl.$render = () => {
			$scope.ctrl.parts = destructDate(ngModelCtrl.$viewValue ? new Date(ngModelCtrl.$viewValue) : null, $scope.ctrl.dateOnly);
			$scope.ctrl._displayValue = $scope.ctrl.toDateValue($scope.ctrl.parts);
			$scope.ctrl.checkValidity($scope.ctrl._displayValue);
			this.setAllInputsWidth($scope);
		};
	},


	setAllInputsWidth($scope) {
		for (let i = 0; i < $scope.inputs.length; i += 1) {
			setTextWidth($scope.inputs[i]);
		}
	}
};
