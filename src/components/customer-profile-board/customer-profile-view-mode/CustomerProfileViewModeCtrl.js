/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 11:19
 */

import { Inject } from 'angular-es-utils';

const _LABEL_DISPLAY_CONFIG = {
	size: {
		margin: 10,
		padding: 20,
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
		obj.customerTags && this.generateUserLabels(obj.customerTags.currentValue);
	}

	/**
	 * @name generateUserLabels
	 * @param {Array} labels
	 * generate user label into page
	 */
	generateUserLabels(labels = []) {
		const MAX_RANDOM_ATTEMPT_COUNT = 999;
		let tmpCoordinate;
		this._generateAreaOffset = this.getGenerateAreaOffset(labels.length);
		this._occupiedAreaOffset = [this.getElementOuterOffset(labels, this._$element[0].querySelector('.center-icon'))];

		labels.forEach((label, index) => {
			let attemptCount = 0;
			tmpCoordinate = this.randomLabelCoordinate(label);
			while (this.isOffsetConflict(this.getElementOuterOffset(label, tmpCoordinate), this._occupiedAreaOffset)) {
				if (attemptCount++ > MAX_RANDOM_ATTEMPT_COUNT) break; // 防止人品不好，随机次数过多，页面卡死
				tmpCoordinate = this.randomLabelCoordinate(label);
			}
			if (attemptCount < MAX_RANDOM_ATTEMPT_COUNT) {
				this._occupiedAreaOffset.push(this.getElementOuterOffset(label, tmpCoordinate));
				this.appendUserLabelToDom(label, _LABEL_DISPLAY_CONFIG.colorList[index], tmpCoordinate);
			} else {
				console.info('Hide label: ', label);
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
	appendUserLabelToDom(label = '', color = _LABEL_DISPLAY_CONFIG.colorList[_LABEL_DISPLAY_CONFIG.colorList.length - 1], coordinate = {
		offsetTop: _LABEL_DISPLAY_CONFIG.size.margin,
		offsetLeft: _LABEL_DISPLAY_CONFIG.size.margin
	}) {
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
		const NOTEELEMENTHALFWIDTH = 100;
		const element = this._$element[0].querySelector('.customer-profile-view-mode');
		return {
			top: LEAVEBLANKDISTANCE,
			right: element.offsetWidth - NOTEELEMENTHALFWIDTH - LEAVEBLANKDISTANCE / 4,
			bottom: element.offsetHeight - LEAVEBLANKDISTANCE,
			left: NOTEELEMENTHALFWIDTH + LEAVEBLANKDISTANCE / 4
		};
	}

	getGenerateLabelWidth(label = '') {
		return label.length * 13 + _LABEL_DISPLAY_CONFIG.size.padding * 2;
	}

	/**
	 * get element offset coordinate(include margin)
	 * @name getElementOuterOffset
	 * @param {string} label
	 * @param {Object} Offset
	 * @returns {Object} Offset
	 */
	getElementOuterOffset(label = '', {
		offsetTop = _LABEL_DISPLAY_CONFIG.size.margin,
		offsetLeft = _LABEL_DISPLAY_CONFIG.size.margin,
		offsetWidth = this.getGenerateLabelWidth(label),
		offsetHeight = _LABEL_DISPLAY_CONFIG.size.height,
		margin = _LABEL_DISPLAY_CONFIG.size.margin
	} = {}) {
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
	randomLabelCoordinate(label) {
		return {
			offsetTop: this.getRandomInt(this._generateAreaOffset.top + _LABEL_DISPLAY_CONFIG.size.margin, this._generateAreaOffset.bottom - _LABEL_DISPLAY_CONFIG.size.height - 2 * _LABEL_DISPLAY_CONFIG.size.margin),
			offsetLeft: this.getRandomInt(this._generateAreaOffset.left + _LABEL_DISPLAY_CONFIG.size.margin, this._generateAreaOffset.right - this.getGenerateLabelWidth(label) - 2 * _LABEL_DISPLAY_CONFIG.size.margin)
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
			if (elementCoordinate.top > area.bottom || elementCoordinate.bottom < area.top ||
			elementCoordinate.left > area.right || elementCoordinate.right < area.left) continue;
			// top line in block
			if (area.top <= elementCoordinate.top && elementCoordinate.top <= area.bottom) {
				// left line in block
				if (area.left <= elementCoordinate.left && elementCoordinate.left <= area.right) return true;
				// right line in block
				if (area.left <= elementCoordinate.right && elementCoordinate.right <= area.right) return true;
				// left line and right line at block two sides
				if (elementCoordinate.left < area.left && elementCoordinate.right > area.right) return true;
			}
			// bottom line in block
			if (area.top <= elementCoordinate.bottom && elementCoordinate.bottom <= area.bottom) {
				// left line in block
				if (area.left <= elementCoordinate.left && elementCoordinate.left <= area.right) return true;
				// right line in block
				if (area.left <= elementCoordinate.right && elementCoordinate.right <= area.right) return true;
				// left line and right line at block two sides
				if (elementCoordinate.left < area.left && elementCoordinate.right > area.right) return true;
			}
		}
		return false;
	}
}
