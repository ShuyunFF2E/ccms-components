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
	colorList: ['#ef5362', '#07c6c9', '#0f83c9', '#faad50']
};

@Inject('$element', '$scope')
export default class CustomerProfileViewModeCtrl {
	constructor() {}

	$postLink() {
		this._$scope.changeToSpecificAttributeBlock = this.changeToSpecificAttributeBlock;
		this.generateUserLabels(this.userLabels);
	}

	/**
	 * generate user label into page
	 * @name generateUserLabels
	 * @param {Array} labels
	 */
	generateUserLabels(labels = []) {
		let tmpCoordinate;
		this._generateAreaOffset = this.getGenerateAreaOffset();
		this._occupiedAreaOffset = [this.getElementOuterOffset(this._$element[0].querySelector('.center-icon'))];

		labels.forEach((label, index) => {
			tmpCoordinate = this.randomLabelCoordinate();
			while (this.isOffsetConflict(this.getElementOuterOffset(tmpCoordinate), this._occupiedAreaOffset)) {
				tmpCoordinate = this.randomLabelCoordinate();
			}
			this._occupiedAreaOffset.push(this.getElementOuterOffset(tmpCoordinate));
			this.appendUserLabelToDom(label, _LABELDISPLAYCONFIG.colorList[index], tmpCoordinate);
		});
	}

	/**
	 * append label into dom according coordinate
	 * @name appendUserLabelToDom
	 * @param {string} label
	 * @param {string} color
	 * @param {Object} coordinate
	 */
	appendUserLabelToDom(label = '', color = _LABELDISPLAYCONFIG.colorList[0], coordinate = {offsetTop: _LABELDISPLAYCONFIG.size.margin, offsetLeft: _LABELDISPLAYCONFIG.size.margin}) {
		this._$element.children().append(`<div class="customer-label" style="top: ${coordinate.offsetTop}px;left: ${coordinate.offsetLeft}px;background-color: ${color}">${label}</div>`);
	}

	/**
	 * get generate area offset
	 * @name getGenerateAreaOffset
	 * @returns {{top: number, right: number, bottom: number, left: number}}
	 */
	getGenerateAreaOffset() {
		const LEAVEBLANKDISTANCE = 100;
		const element = this._$element[0].querySelector('.customer-profile-view-mode');
		return {
			top: 0,
			right: element.offsetWidth - LEAVEBLANKDISTANCE,
			bottom: element.offsetHeight,
			left: LEAVEBLANKDISTANCE
		};
	}

	/**
	 * get element offset coordinate(include margin)
	 * @name getElementOuterOffset
	 * @param {number} offsetTop
	 * @param {number} offsetLeft
	 * @param {number} offsetWidth
	 * @param {number} offsetHeight
	 * @param {number} margin
	 * @returns {{top: number, right: number, bottom: number, left: number}}
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
	 * get random int
	 * @name getRandomInt
	 * @param {number} min
	 * @param {number} max
	 * @returns {number} randomNumber
	 */
	getRandomInt(min = 0, max = 1) {
		return Math.floor(Math.random() * (max - min)) + min;
	}

	/**
	 * generate random label coordinate
	 * @name randomLabelCoordinate
	 * @returns {{offsetTop: number, offsetLeft: number}} labelCoordinate
	 */
	randomLabelCoordinate() {
		return {
			offsetTop: this.getRandomInt(this._generateAreaOffset.top + _LABELDISPLAYCONFIG.size.margin, this._generateAreaOffset.bottom - _LABELDISPLAYCONFIG.size.height - 2 * _LABELDISPLAYCONFIG.size.margin),
			offsetLeft: this.getRandomInt(this._generateAreaOffset.left + _LABELDISPLAYCONFIG.size.margin, this._generateAreaOffset.right - _LABELDISPLAYCONFIG.size.width - 2 * _LABELDISPLAYCONFIG.size.margin)
		};
	}

	/**
	 * judge the element coordinate is in the occupied area, if yes, return true, else return false
	 * @name isOffsetConflict
	 * @param {Object} elementCoordinate
	 * @param {Array} occupiedArea
	 * @returns {boolean}
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
