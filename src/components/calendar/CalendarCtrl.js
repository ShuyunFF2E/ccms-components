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

		this.DISPLAY_FORMAT = DISPLAY_FORMAT;
		this.years = yearList;
		this.months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
		this.customFestivals = this.customFestivals || {};
		this.festivals = Object.assign({}, festivals, lunnarFestivals, this.customFestivals);

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

	hideYear() {
		return this.DISPLAY_FORMAT[this.displayFormat] === 1 || this.DISPLAY_FORMAT[this.displayFormat] === 2;
	}

	hideMonth() {
		return this.DISPLAY_FORMAT[this.displayFormat] === 2;
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
	setValue(dateValue) {
		this.value = dateValue || new Date();

		if (this.dateOnly) {
			this.value = new Date(this.value.setHours(0, 0, 0, 0));
		}

		this._realValue = this.value;
	}


	/**
	 * 切换月份
	 * @param delta
	 */
	switchMonth(delta) {
		if (this.disableYear || this.disableMonth) return;
		this.value = new Date(new Date(this.value).setMonth(this.value.getMonth() + delta));
	};


	/**
	 * 更新时间值
	 * @param $event
	 */
	updateTime($event) {
		const input = $event.target;

		if (!input.value) return;

		const value = parseNumber(input.value);

		if (isNaN(value) ||
				(value < +input.getAttribute('ng-min')) ||
				(value > +input.getAttribute('ng-max'))) {
			this.parts[input.name] = '00';
		} else {
			this.parts[input.name] = value;
			this.setDate(this.value);
		}
	}


	/**
	 * 为时间栏补零
	 * @param $event
   */
	addTimeZero($event) {
		const input = $event.target,
			value = parseNumber(input.value);

		this.parts[input.name] = addZero(value);
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
