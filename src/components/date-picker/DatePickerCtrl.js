/**
 * Created by AshZhang on 2016-3-12.
 */

import angular from 'angular';

import {Inject} from 'angular-es-utils/decorators';

import { DISPLAY_FORMAT } from '../../common/bases/constant';

import { addZero, parseNumber, setTextWidth } from './dateUtils';
import Tooltip from '../tooltip/Tooltip';
import { TOOLTIP_TYPE } from '../tooltip/Contants';


let service;

@Inject('$scope', '$element', '$filter', '$timeout')
export default class DatePickerCtrl {

	constructor($scope, $element, $filter) {
		this.inputs = [].slice.call($element[0].querySelectorAll('input'));
		this.$scope = $scope;
		this.$element = $element;
		this.DISPLAY_FORMAT = DISPLAY_FORMAT;

		if (this.minDate instanceof Date) {
			this.minDate = new Date(
				this.dateOnly
					? this.minDate.setHours(0)
					: this.minDate.setMilliseconds(0)
			);
		}

		if (this.maxDate instanceof Date) {
			this.maxDate = new Date(
				this.dateOnly
					? this.maxDate.setHours(23, 59, 59, 999)
					: this.maxDate.setMilliseconds(999)
			);
		}

		// 当开始和结束日期变化时, 清除过期的报错信息
		$scope.$watchGroup(['ctrl.minDate', 'ctrl.maxDate'], () => {
			if (this._displayValue) {
				this.checkValidity(this._displayValue);
			}
		});

		service = {
			$filter
		};
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

	/**
	 * 根据输入的年份和月份, 计算日期的上限
	 */
	calDateMax() {
		const month = parseInt(this.parts.month, 10),
			year = parseInt(this.parts.year, 10);

		let	max;

		if (month === 2) {
			max = 28 + (!(year % 400) || (!(year % 4) && year % 100) ? 1 : 0);
		} else {
			max = 30 + ((month <= 7) ? (month % 2) : ((month + 1) % 2));
		}

		return max || 31;
	}


	/**
	 * 如输入不合法, 弹出框框
	 * @param dateValue
	 */
	checkValidity(dateValue) {
		this.clearErrorMessage();

		if (dateValue && this.minDate && (this.compareDateWithoutMilliseconds(this.minDate, dateValue))) {
			this.ngModelCtrl.$setValidity('minDate', false);
			this.createErrorTip(`时间不能早于 ${service.$filter('date')(this.minDate, 'yyyy-MM-dd HH:mm:ss')}`);
		} else if (dateValue && this.maxDate && (this.compareDateWithoutMilliseconds(dateValue, this.maxDate))) {
			this.ngModelCtrl.$setValidity('maxDate', false);
			this.createErrorTip(`时间不能晚于 ${service.$filter('date')(this.maxDate, 'yyyy-MM-dd HH:mm:ss')}`);
		}
	}

	/**
	 * 比较日期大小 (不考虑毫秒)
	 */
	compareDateWithoutMilliseconds(a, b) {
		return Math.floor(a.getTime() / 1000) > Math.floor(b.getTime() / 1000);
	}


	/**
	 * 清除错误消息
	 */
	clearErrorMessage() {
		this.ngModelCtrl.$setValidity('minDate', true);
		this.ngModelCtrl.$setValidity('maxDate', true);
		this._errorTip && this._errorTip.close();
		this._errorTip = null;
	}


	/**
	 * 清除日期
	 * @param $event
	 */
	clearValue($event) {
		$event.stopPropagation();
		this.setValue(null);
	}


  /**
	 * 生成报错信息
	 * @param msg
	 */
	createErrorTip(msg) {
		this._errorTip = new Tooltip(this.$element[0], TOOLTIP_TYPE.ERROR_MINOR, false);
		this._errorTip.open(msg);
	}


	/**
	 * 聚焦 input
	 * @param $event
	 */
	focusInput($event) {
		const input = $event.target;

		this.$element.addClass('active');

		if (!input.value) {

			// 聚焦的单元格没有值, 转而聚焦第一个没有值的单元格, 从头开始输入
			const firstEmptyInput = this.inputs.find(input => !input.value);

			firstEmptyInput && firstEmptyInput.focus();
		} else {

			// 有值, 则选中, 方便输入
			input.select();
		}
	}


	/**
	 * 聚焦到下一个输入框
	 * @param input
	 * @param step - -1 上一个, 1, 下一个
	 */
	focusNextInput(input, step) {
		const inputToFocus = this.inputs[this.inputs.indexOf(input) + step];

		if (inputToFocus) {
			inputToFocus.focus();
			inputToFocus.select();
		}
	}


	/**
	 * 设置输入框的宽度
	 * @param $event
	 */
	setInputLength($event) {
		setTextWidth($event.target);
	}


	/**
	 * 设置日期 (外部调用)
	 * @param date
	 */
	setValue(date) {
		this.ngModelCtrl.$setViewValue(date);
		this.ngModelCtrl.$render();
		this.clearErrorMessage();
	}


	/**
	 * 打开/关闭日历
	 */
	toggleCalendar($event) {
		$event.stopPropagation();

		if (!this.disabled) {
			this.calendar.open(this);

			if (this.$element[0] === $event.target) {
				this.inputs[0].focus();
			}

			if (!this.disableScrollIntoView) {
				// 将日历弹框 scroll into view
				const datePickerEle = this.$element[0].querySelector('form.date-picker');
				const calendarEle = this.$element[0].querySelector('.calendar');
				setTimeout(() => {
					const containerHeight = this.containerElement ? this.containerElement.getClientRects()[0].bottom : document.documentElement.clientHeight;
					if (datePickerEle.getClientRects()[0].bottom + calendarEle.getClientRects()[0].height > containerHeight) {
						calendarEle.scrollIntoView({behavior: 'smooth', block: 'end', inline: 'nearest'});
					}
				});
			}
		}
	}

	/**
	 * 转换日期格式
	 * from parts to dateValue
	 * */
	toDateValue(parts) {
		const allDateHasValue = parts.year && parts.month && parts.date,
			allTimeHasValue = parts.hour && parts.minute && parts.second;

		if ((!this.dateOnly && allDateHasValue && allTimeHasValue) || (this.dateOnly && allDateHasValue)) {
			return new Date(
				parseNumber(parts.year),
				parseNumber(parts.month) - 1,
				parseNumber(parts.date),
				parseNumber(parts.hour || 0),
				parseNumber(parts.minute || 0),
				parseNumber(parts.second || 0)
			);
		} else {
			return null;
		}
	}

	/**
	 * 更新日期值
	 */
	updateValue($event) {
		const input = $event.target,
			parts = this.parts;

		let dateValue = this.toDateValue(parts);

		input.value = addZero(input.value);
		setTextWidth(input);

		this.checkValidity(dateValue);

		// 区分显示值和实际值
		this._displayValue = dateValue;
		this.ngModelCtrl.$setViewValue(this.$scope.datePicker.$valid ? dateValue : null);

		if (!$event.relatedTarget || this.inputs.indexOf($event.relatedTarget) === -1) {
			this.$element.removeClass('active');
		}
	}


	/**
	 * 输入/修改年月日值时, 验证合法性
	 * @param $event
	 */
	validateValue($event) {
		const input = $event.target,
			value = +input.value,
			key = $event.which;

		let valid = true;

		// 按的键是 tab
		if (key === 9) return;

		// 左 右 切换
		if (key === 37) {
			if (input.selectionStart === 0) {
				return this.focusNextInput(input, -1);
			}
			return;
		} else if (key === 39) {
			if (input.selectionEnd === input.value.length) {
				return this.focusNextInput(input, 1);
			}
			return;
		}

		// 判断是否删除到上一个 input, 或输入完成, 进入下一个 input
		// 按的键是 delete, 如当前单元格已无内容, 且是连续按 delete, 回退至上一单元格
		if (key === 8 && !input.value.length && (!input._lastKey || input._lastKey === key)) {
			this.focusNextInput(input, -1);
			input._lastKey = key;
			return;
		}

		// 验证合法性
		if (this.$scope.datePicker[input.name].$invalid || isNaN(value)) {
			valid = false;
			this.parts[input.name] = '';
			setTextWidth(input);
		} else if (input.value !== '0') {

			// 单独输入一个 0 时, 无法判断是否输入完成, 不做验证
			const min = +input.getAttribute('ng-min'),
				max = +input.getAttribute('ng-max');

			if ((angular.isDefined(min) && (value < min)) ||
				(angular.isDefined(max) && (value > max))) {
				valid = false;
				this.parts[input.name] = '';
				setTextWidth(input);
			}
		}

		if (!valid) {
			input._lastKey = key;
			return;
		}

		// 判断是否输入完成, 跳到下一个单元格
		if (input.value.length === +input.maxLength) {
			// 校验年的范围
			if (input.name === 'year') {
				if (input.value < 1900 || input.value > new Date().getFullYear() + 30) {
					this.parts[input.name] = '';
					setTextWidth(input);
					return;
				}
			}
			this.focusNextInput(input, 1);
		}

		input._lastKey = key;
	}
}
