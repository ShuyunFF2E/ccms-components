/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 11:19
 */

import { Inject } from 'angular-es-utils';

const _LABELDISPLAYCONFIG = {
	size: {
		margin: 10,
		width: 100,
		height: 30
	},
	colorList: ['rgba(239,83,98,.7)', 'rgba(7,198,201,.7)', 'rgba(15,131,201,.7)', 'rgba(250,173,90,.7)', 'rgba(239,83,98,.4)', 'rgba(7,198,201,.4)', 'rgba(15,131,201,.4)', 'rgba(250,173,90,.4)']
};

@Inject('$element', '$scope')
export default class CustomerProfileViewModeCtrl {
	/**
	 * @name $onChanges
	 * @param {Object} obj
	 */
	$onChanges(obj) {
		obj.customerData.currentValue.tags && this.generateUserLabels(this.customerData.tags);
	}

	/**
	 * @name generateUserLabels
	 * @param {Array} labels
	 * generate user label into page
	 */
	generateUserLabels(labels = []) {
		const MAXRANDOMATTEMPTCOUNT = 999;
		let tmpCoordinate;
		this._generateAreaOffset = this.getGenerateAreaOffset(labels.length);
		this._occupiedAreaOffset = [this.getElementOuterOffset(this._$element[0].querySelector('.center-icon'))];

		labels.forEach((label, index) => {
			let attemptCount = 0;
			tmpCoordinate = this.randomLabelCoordinate();
			while (this.isOffsetConflict(this.getElementOuterOffset(tmpCoordinate), this._occupiedAreaOffset)) {
				if (attemptCount++ > MAXRANDOMATTEMPTCOUNT) break; // 防止人品不好，随机次数过多，页面卡死
				tmpCoordinate = this.randomLabelCoordinate();
			}
			if (attemptCount < MAXRANDOMATTEMPTCOUNT) {
				this._occupiedAreaOffset.push(this.getElementOuterOffset(tmpCoordinate));
				this.appendUserLabelToDom(label, _LABELDISPLAYCONFIG.colorList[index], tmpCoordinate);
			} else {
				console.log('Hide label: ', label);
			}
		});
	}

	/**
	 * @name appendUserLabelToDom
	 * @param {string} label
	 * @param {string} color
	 * @param {Object} coordinate
	 * append label into dom according coordinate
	 */
	appendUserLabelToDom(label = '', color = _LABELDISPLAYCONFIG.colorList[_LABELDISPLAYCONFIG.colorList.length - 1], coordinate = {offsetTop: _LABELDISPLAYCONFIG.size.margin, offsetLeft: _LABELDISPLAYCONFIG.size.margin}) {
		this._$element.children().append(`<div class="customer-label" style="top: ${coordinate.offsetTop}px;left: ${coordinate.offsetLeft}px;background-color: ${color}">${label}</div>`);
	}

	/**
	 * @name getGenerateAreaOffset
	 * @param {Number} labelCount
	 * @returns {Object} Offset
	 * get generate area offset
	 */
	getGenerateAreaOffset(labelCount) {
		const coefficient = 3 - labelCount * 0.2;
		const LEAVEBLANKDISTANCE = 40 * coefficient;
		const	NOTEELEMENTHALFWIDTH = 100;
		const element = this._$element[0].querySelector('.customer-profile-view-mode');
		return {
			top: LEAVEBLANKDISTANCE,
			right: element.offsetWidth - NOTEELEMENTHALFWIDTH - LEAVEBLANKDISTANCE / 4,
			bottom: element.offsetHeight - LEAVEBLANKDISTANCE,
			left: NOTEELEMENTHALFWIDTH + LEAVEBLANKDISTANCE / 4
		};
	}

	/**
	 * get element offset coordinate(include margin)
	 * @name getElementOuterOffset
	 * @param {Object} Offset
	 * @returns {Object} Offset
	 */
	getElementOuterOffset({offsetTop = _LABELDISPLAYCONFIG.size.margin, offsetLeft = _LABELDISPLAYCONFIG.size.margin, offsetWidth = _LABELDISPLAYCONFIG.size.width, offsetHeight = _LABELDISPLAYCONFIG.size.height, margin = _LABELDISPLAYCONFIG.size.margin} = {}) {
		return {
			top: offsetTop - margin,
			right: offsetLeft + offsetWidth + margin,
			bottom: offsetTop + offsetHeight + margin,
			left: offsetLeft - margin
		};
	}

	/**
	 * @name getRandomInt
	 * @param {number} min
	 * @param {number} max
	 * @returns {number} randomNumber
	 * get random int
	 */
	getRandomInt(min = 0, max = 1) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	/**
	 * @name randomLabelCoordinate
	 * @returns {Object} labelCoordinate
	 * generate random label coordinate
	 */
	randomLabelCoordinate() {
		return {
			offsetTop: this.getRandomInt(this._generateAreaOffset.top + _LABELDISPLAYCONFIG.size.margin, this._generateAreaOffset.bottom - _LABELDISPLAYCONFIG.size.height - 2 * _LABELDISPLAYCONFIG.size.margin),
			offsetLeft: this.getRandomInt(this._generateAreaOffset.left + _LABELDISPLAYCONFIG.size.margin, this._generateAreaOffset.right - _LABELDISPLAYCONFIG.size.width - 2 * _LABELDISPLAYCONFIG.size.margin)
		};
	}

	/**
	 * @name isOffsetConflict
	 * @param {Object} elementCoordinate
	 * @param {Array} occupiedArea
	 * @returns {boolean}
	 * judge the element coordinate is in the occupied area, if yes, return true, else return false
	 */
	isOffsetConflict(elementCoordinate = {}, occupiedArea = []) {
		for (let area of occupiedArea) {
			// top
			if (area.top <= elementCoordinate.top && elementCoordinate.top <= area.bottom) {
				// top left
				if (area.left <= elementCoordinate.left && elementCoordinate.left <= area.right) return true;
				// top right
				if (area.left <= elementCoordinate.right && elementCoordinate.right <= area.right) return true;
			}
			// bottom
			if (area.top <= elementCoordinate.bottom && elementCoordinate.bottom <= area.bottom) {
				// bottom left
				if (area.left <= elementCoordinate.left && elementCoordinate.left <= area.right) return true;
				// bottom right
				if (area.left <= elementCoordinate.right && elementCoordinate.right <= area.right) return true;
			}
		}
		return false;
	}
}
