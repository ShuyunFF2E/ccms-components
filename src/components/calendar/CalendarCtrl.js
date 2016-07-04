/**
 * Created by AshZhang on 2016-3-13.
 */

import angular from 'angular';

import { Inject } from 'angular-es-utils';

import { addZero, destructDate, parseNumber } from '../date-picker/dateUtils';


const yearList = (function() {
	const end = new Date().getFullYear() + 10,
		result = [];

	for (let i = 1900; i <= end; i += 1) {
		result.push(i + '');
	}

	return result;
}());


@Inject('$scope', '$element')
export default class DatePickerCtrl {

	constructor($scope, $element) {
		this.$scope = $scope;
		this.$element = $element;

		this.years = yearList;
		this.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

		this.close = this.close.bind(this);

		$scope.$watch('ctrl.value', dateValue => {
			if (dateValue) {
				this.createTimeRange(dateValue);
				this.parts = destructDate(dateValue, this.datePicker.dateOnly);
				this.parts.month = this.parts.month.replace(/^0/, '') - 1 + '';
			}
		});

		$scope.$watchGroup(['ctrl.datePicker.minDate', 'ctrl.datePicker.maxDate'], () => {
			if (this._realValue) {
				this.createTimeRange(this._realValue);
			}
		});
	}


	/**
	 * 改变月份
	 */
	changeMonth() {
		this.value = new Date(new Date(this.value).setMonth(this.parts.month));
	}


	/**
	 * 改变年份
	 */
	changeYear() {
		this.value = new Date(new Date(this.value).setFullYear(this.parts.year));
	}


	/**
	 * 关闭日历
	 */
	close() {
		this.$element[0].style.display = 'none';
	}


	/**
	 * 确定输入值
	 */
	confirm() {
		this.datePicker.setValue(this.value);
		this.close();

		if (this.range && this.datePicker.rangeStart) {
			this.range.endCalendar.open();
		}
	}


	/**
	 * 生成日历
	 * @param dateValue
	 */
	createTimeRange(dateValue) {
		dateValue || (dateValue = new Date());

		const currentTime = new Date(new Date(dateValue).setHours(0, 0, 0, 0)),
			monthStart = new Date(new Date(currentTime).setDate(1)).setHours(0, 0, 0, 0),

			minDate = this.datePicker.minDate,
			maxDate = this.datePicker.maxDate,
			start = this.datePicker.start,
			end = this.datePicker.end,

			dates = [];

		let showStart = new Date(monthStart - 1000 * 60 * 60 * 24 * new Date(monthStart).getDay()).setHours(0, 0, 0, 0),
			i = 0;

		while (i++ < 42) {
			const showDate = new Date(new Date(showStart).setHours(0, 0, 0, 0));

			showDate.active = (this._realValue && (
					showDate.getFullYear() === this._realValue.getFullYear() &&
					showDate.getMonth() === this._realValue.getMonth() &&
					showDate.getDate() === this._realValue.getDate()
				)) || (
					this.datePicker.rangeStart &&
					end &&
					new Date(end).setHours(0, 0, 0, 0) === showDate.valueOf()
				) || (
					this.datePicker.rangeEnd &&
					start &&
					new Date(start).setHours(0, 0, 0, 0) === showDate.valueOf()
				);

			showDate.inRange = (this.datePicker.rangeStart && end && (showDate <= end) && (showDate >= this._realValue)) ||
				(this.datePicker.rangeEnd && start && (showDate >= start) && (showDate <= this._realValue));

			showDate.otherMonth = showDate.getMonth() !== dateValue.getMonth();

			showDate.disabled = (minDate && (new Date(showDate).setHours(23, 59, 59, 999) < minDate)) ||
				(maxDate && (showDate > maxDate));

			dates.push(showDate);
			showStart += 1000 * 60 * 60 * 24;
		}

		this.timeRange = dates;
	}


	/**
	 * 判断值是否合法
	 */
	isValid() {
		const min = this.datePicker.minDate,
			max = this.datePicker.maxDate;

		return (!min || (min && this.value >= min)) && (!max || (max && this.value <= max));
	}


	/**
	 * 打开, 并根据文本框的值作初始化
	 */
	open() {
		const datePicker = this.datePicker,
			calendar = this.$element[0];

		if (calendar.style.display === 'block') return;

		// 设置值 (默认今天)
		this.setValue(datePicker.ngModelCtrl.$viewValue);

		// 隐藏其余日历
		angular.element(document.querySelectorAll('.date-picker-holder > .calendar')).css('display', 'none');

		// 定位日历
		calendar.style.display = 'block';
	}


	/**
	 * 设置日期
	 * @param date
	 */
	setDate(date) {
		this.setValue(date);

		if (!this.dateOnly) {
			date.setHours(parseNumber(this.parts.hour));
			date.setMinutes(parseNumber(this.parts.minute));
			date.setSeconds(parseNumber(this.parts.second));
		}
	};


	/**
	 * 设为当前时间
	 */
	setNow() {
		let now = new Date();

		if (this.dateOnly) {
			now.setHours(0, 0, 0, 0);
		}

		this.setValue(now);
	};


	/**
	 * 设置日期值
	 * @param dateValue
	 */
	setValue(dateValue) {
		this.value = dateValue || new Date();
		this._realValue = this.value;
	}


	/**
	 * 切换月份
	 * @param delta
	 */
	switchMonth(delta) {
		this.value = new Date(new Date(this.value).setMonth(this.value.getMonth() + delta));
	};


	/**
	 * 更新时间值
	 * @param $event
	 */
	updateTime($event) {
		const input = $event.target,
			value = parseNumber(input.value);

		if (isNaN(value) || (value < +input.getAttribute('ng-min')) || (value > +input.getAttribute('ng-max'))) {
			this.parts[input.name] = '00';
		} else {
			this.parts[input.name] = addZero(value);
			this.setDate(this.value);
		}
	}


	preventDefault($event) {
		$event.stopPropagation();
	};
}
