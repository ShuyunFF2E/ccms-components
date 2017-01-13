/**
 * Created by AshZhang on 2016-3-5.
 */


import './_calendar.scss';
import template from './calendar.tpl.html';
import CalendarCtrl from './CalendarCtrl';


export default {

	bindToController: true,
	controller: CalendarCtrl,
	controllerAs: 'ctrl',
	replace: true,
	require: ['^ccDatePicker', '^^?ccDateRange'],
	restrict: 'E',
	scope: {
		onCalendarOpen: '&?',
		onCalendarClose: '&?'
	},
	template,


	link($scope, $element, $attrs, ctrls) {
		this.$scope = $scope;

		this._registerToDatePicker(ctrls[0]);
		this._registerToRangePicker(ctrls[0], ctrls[1]);
	},


	/**
	 * 将日期选择器和文本框关联起来
	 * @param datePickerCtrl
	 * @private
	 */
	_registerToDatePicker(datePickerCtrl) {
		datePickerCtrl.calendar = this.$scope.ctrl;
		this.$scope.ctrl.datePicker = datePickerCtrl;

		this.$scope.ctrl.dateOnly = datePickerCtrl.dateOnly;
		this.$scope.ctrl.disabled = datePickerCtrl.disabled;
	},


	/**
	 * 注册 range 组件
	 * @param datePickerCtrl
	 * @param rangeCtrl
	 * @private
	 */
	_registerToRangePicker(datePickerCtrl, rangeCtrl) {
		this.$scope.ctrl.range = rangeCtrl;

		if (datePickerCtrl.rangeStart) {
			rangeCtrl.startCalendar = this.$scope.ctrl;
		}

		if (datePickerCtrl.rangeEnd) {
			rangeCtrl.endCalendar = this.$scope.ctrl;
		}
	}
};
