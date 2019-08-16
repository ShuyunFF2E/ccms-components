/**
 * Created by AshZhang on 2016-3-13.
 */

import angular from 'angular';
import chineseLunar from 'chinese-lunar';

import { Inject } from 'angular-es-utils';

import { DISPLAY_FORMAT } from '../../common/bases/constant';

import { addZero, destructDate, parseNumber } from '../date-picker/dateUtils';

const festivals = {
	'0101': '元旦',
	'0214': '情人节',
	'0308': '妇女节',
	'0312': '植树节',
	'0315': '消费者权益日',
	'0401': '愚人节',
	'0422': '地球日',
	'0501': '劳动节',
	'0504': '青年节',
	'0512': '护士节',
	'0520': '母亲节',
	'0601': '儿童节',
	'0630': '父亲节',
	'0701': '建党节',
	'0801': '建军节',
	'0903': '抗战胜利日',
	'0910': '教师节',
	'1001': '国庆节',
	'1111': '双11购物节',
	'1212': '双12购物节',
	'1224': '平安夜',
	'1225': '圣诞节'
};

const lunnarFestivals = {
	'腊月三十': '除夕',
	'正月初一': '春节',
	'正月十五': '元宵节',
	'五月初五': '端午节',
	'七月初七': '七夕节',
	'八月十五': '中秋节',
	'九月初九': '重阳节',
	'腊月初八': '腊八节',
	'腊月廿三': '小年'
};

const dateRange = {
	preMinDate: new Date(1900, 1, 1),
	preMaxDate: new Date((new Date()).getFullYear() + 30, 11, 1),
	minDate: new Date(1900, 0, 1), // 闭
	maxDate: new Date((new Date()).getFullYear() + 31, 0, 1) // 开
};

const MIN_YEAR = 1900;
const MAX_YEAR = new Date().getFullYear() + 30;


@Inject('$scope', '$element')
export default class DatePickerCtrl {

	constructor($scope, $element) {
		this.$scope = $scope;
		this.$element = $element;

		this.DISPLAY_FORMAT = DISPLAY_FORMAT;
		this.years = this.getYearList();
		this.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
		this.customFestivals = this.customFestivals || {};
		this.festivals = Object.assign({}, festivals, lunnarFestivals, this.customFestivals);

		this.close = this.close.bind(this);

		$scope.$watch('ctrl.value', dateValue => {
			if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
				this.createTimeRange(dateValue);
				this.parts = destructDate(dateValue, this.datePicker.dateOnly);
				this.parts.month = this.parts.month.replace(/^0/, '') - 1 + '';
			}
		});

		$scope.$watchGroup(['ctrl.datePicker.minDate', 'ctrl.datePicker.maxDate', 'ctrl.minYear', 'ctrl.maxYear'], ([ minDate, maxDate, minYear, maxYear ]) => {
			if (this._realValue) {
				this.createTimeRange(this._realValue);
			}
			if (minYear || maxYear) {

				// 更新年份下拉列表
				this.years = this.getYearList(minYear, maxYear);

				// 更新当前默认年份
				const { year } = this.parts || {};
				const { minDate: min, maxDate: max } = this.datePicker.getMinMaxDate(minYear, maxYear, minDate, maxDate);
				if (this.range && (min && year < min.getFullYear() || max && year > max.getFullYear())) {
					this.parts.year = this.years[0];
				}
			}
		});
	}

	getYearList(minYear, maxYear) {
		const result = [];

		minYear = minYear || MIN_YEAR;
		maxYear = maxYear || MAX_YEAR;

		for (let i = minYear; i <= maxYear; i += 1) {
			result.push(i + '');
		}

		return result;
	}

	hideYear() {
		return this.DISPLAY_FORMAT[this.displayFormat] === 1 || this.DISPLAY_FORMAT[this.displayFormat] === 2;
	}

	hideMonth() {
		return this.DISPLAY_FORMAT[this.displayFormat] === 2;
	}

	hideSeconds() {
		return this.DISPLAY_FORMAT[this.displayFormat] === 3;
	}

	setLGButtonStatus() {
		if (this.parts.month === '0' && this.parts.year === MIN_YEAR + '') {
			this.disabledL = true;
		} else {
			this.disabledL = false;
		}

		if (this.parts.month === '11' && this.parts.year === MAX_YEAR + '') {
			this.disabledG = true;
		} else {
			this.disabledG = false;
		}
	}

	/**
	 * 改变月份
	 */
	changeMonth() {
		this.setLGButtonStatus();
		this.value = new Date(new Date(this.value).setMonth(this.parts.month));
	}


	/**
	 * 改变年份
	 */
	changeYear() {
		this.setLGButtonStatus();
		(this.minYear || this.maxYear) && !this.parts.year && (this.parts.year = this.years[0]);
		this.value = new Date(new Date(this.value).setFullYear(this.parts.year));
	}


	/**
	 * 关闭日历
	 */
	close() {
		if (this.$element[0].style.display !== 'none' && this.$element[0].style.display !== '') {
			this.onCalendarClose();
		}
		this.$element[0].style.display = 'none';
		document.removeEventListener('click', this.close, false);
		this.onCalendarClose();
		this._$scope.$root.$$phase || this._$scope.$apply();
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

			{ minDate, maxDate } = this.datePicker.getMinMaxDate(this.minYear, this.maxYear, this.datePicker.minDate, this.datePicker.maxDate),
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
		const { datePicker: { minDate, maxDate }, minYear, maxYear } = this;
		const { minDate: min, maxDate: max } = this.datePicker.getMinMaxDate(minYear, maxYear, minDate, maxDate);

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

		// 如果是 range 且为 rangeStart 时间设置为 00:00:00
		if (this.range && this.datePicker.rangeStart && !datePicker.ngModelCtrl.$viewValue) {
			this.setValue(datePicker.ngModelCtrl.$viewValue, true, false);
		}

		// 如果是 range 且为 rangeEnd 时间设置为 23:59:59
		if (this.range && this.datePicker.rangeEnd && !datePicker.ngModelCtrl.$viewValue) {
			this.setValue(datePicker.ngModelCtrl.$viewValue, false, true);
		}

		// 如果是设置了默认显示的CalendarValue
		if (!angular.isUndefined(this.defaultCalendarValue) && !datePicker.ngModelCtrl.$viewValue) {
			this.setValue(this.defaultCalendarValue);
		}

		const { minYear, maxYear } = this;
		if (minYear || maxYear) {
			const { ngModelCtrl: { $viewValue }, rangeEnd, minDate, maxDate } = datePicker;

			const { minDate: min, maxDate: max, minYearDate } = this.datePicker.getMinMaxDate(minYear, maxYear, minDate, maxDate);
			const currentDate = new Date();

			let value = $viewValue
				? (min && min >= $viewValue || max && max <= $viewValue ? min : $viewValue)
				: (max && currentDate <= max || min && currentDate >= min ? currentDate : min);

			if (value && this.years.indexOf(value.getFullYear().toString()) === -1) {
				value = minYearDate;
			}

			this.setValue(value, false, this.range && rangeEnd);
		}

		// 隐藏其余日历
		angular.element(document.querySelectorAll('.date-picker-holder > .calendar')).css('display', 'none');

		// 定位日历
		calendar.style.display = 'block';
		document.addEventListener('click', this.close, false);
		this.onCalendarOpen();
		this._$scope.$root.$$phase || this._$scope.$apply();
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
		this.setValue(new Date());
	};


	/**
	 * 设置日期值
	 * @param dateValue
	 */
	setValue(dateValue, start = false, end = false) {
		this.value = dateValue || new Date();

		if (this.dateOnly) {
			this.value = new Date(this.value.setHours(0, 0, 0, 0));
		}

		if (!this.dateOnly && start) {
			this.value = new Date(this.value.setHours(0, 0, 0, 0));
		}

		if (!this.dateOnly && end) {
			this.value = new Date(this.value.setHours(23, 59, 59, 0));
		}

		this._realValue = this.value;
	}


	/**
	 * 切换月份
	 * @param delta
	 */
	switchMonth(delta) {
		if (this.disableYear || this.disableMonth) return;
		const newDate = new Date(new Date(this.value).setMonth(this.value.getMonth() + delta));

		if (newDate < dateRange.preMinDate) {
			this.disabledL = true;
		} else {
			this.disabledL = false;
		}

		if (newDate >= dateRange.preMaxDate) {
			this.disabledG = true;
		} else {
			this.disabledG = false;
		}

		if (newDate >= dateRange.minDate && newDate < dateRange.maxDate) {
			this.value = newDate;
		}
	};


	/**
	 * 更新时间值
	 * @param $event
	 */
	updateTime($event) {
		const input = $event.target;

		if (!input.value) return;

		// 非数字清为 '00'
		if (input.value.match(/[^\d]{1,2}/g)) {
			this.parts[input.name] = '00';
			this.setDate(this.value);
			return;
		}

		// 数字且为二位数, 校验, 不在范围内, 清为 '00'
		if (input.value.match(/[0-9]{2}/g)) {

			const value = parseNumber(input.value);

			if (isNaN(value) ||
				(value < +input.getAttribute('ng-min')) ||
				(value > +input.getAttribute('ng-max'))) {
				this.parts[input.name] = '00';
				this.setDate(this.value);
			} else {
				this.parts[input.name] = addZero(value);
				this.setDate(this.value);
			}
		} else {
			this.setDate(this.value);
		}
	}


	/**
	 * 为时间栏补零
	 * @param $event
   */
	addTimeZero($event) {
		const input = $event.target,
			originValue = input.value,
			value = parseNumber(originValue);
		this.parts[input.name] = addZero(value);

		// 用户未输入任何值, 对齐补领时, 需要重新 setDate
		if (originValue === '') {
			this.setDate(this.value);
		}
	}

	/**
	 * 是否定义了该日期
	 * 如果定义了, 返回节日 tips, 没有返回 undefined
	 * */
	isFestivalDefined(date) {
		const parts = destructDate(date, true);
		const solarStr = `${parts.month}${parts.date}`;

		const lunarStr = chineseLunar.format(chineseLunar.solarToLunar(date), 'Md');

		const tipStr = `${this.festivals[solarStr] || ''}${(this.festivals[solarStr] && this.festivals[lunarStr]) ? ' 和 ' : ''}${this.festivals[lunarStr] || ''}`;

		return tipStr;
	}

	preventDefault($event) {
		$event.stopPropagation();
	};
}
