/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 11:19
 */

import { Inject } from 'angular-es-utils';
import { Debounce } from 'angular-es-utils/decorators';

@Inject('$element', '$timeout')
export default class CustomerProfileListModeCtrl {
	constructor() {
		this.rightPanelScrollListener = this.rightPanelScrollListener.bind(this);
		this.activeAttributeBlockIndex = 0;
	}

	/**
	 * @name $postLink
	 * generator attributes block offset list
	 */
	$postLink() {
		const RIGHT_PANEL_ELEMENT = this._$element[0].querySelector('.right-panel-block');
		RIGHT_PANEL_ELEMENT.addEventListener('scroll', this.rightPanelScrollListener);

		this.updateAttributeBlockOffsetList();
	}

	/**
	 * @name $onDestroy
	 * remove scroll event listener on right panel
	 */
	$onDestroy() {
		const RIGHT_PANEL_ELEMENT = this._$element[0].querySelector('.right-panel-block');
		RIGHT_PANEL_ELEMENT.removeEventListener('scroll', this.rightPanelScrollListener);
	}

	/**
	 * @name rightPanelScrollListener
	 * @param {Object} event
	 * listen element scroll event, then according scroll offset set the active label
	 */
	@Debounce(50)
	rightPanelScrollListener(e) {
		this.activeAttributeBlockIndex = this.getActiveAttributeBlockIndex(e.target.scrollTop, this.attributesOffsetList);
	}

	/**
	 * @name getActiveAttributeBlockIndex
	 * @param {Number} scrollTop
	 * @param {Array} offsetList
	 * @returns {number}
	 * according scroll offset return active label index
	 */
	getActiveAttributeBlockIndex(scrollTop = 0, offsetList = []) {
		let index = 0;
		for (let len = offsetList.length; index < len - 1; index++) {
			if (scrollTop < offsetList[index + 1]) break;
		}
		return index;
	}

	/**
	 * @name getAttributeBlockOffsetList
	 * @returns {Array}
	 * get attribute block offset list
	 */
	getAttributeBlockOffsetList() {
		const HEADER_HEIGHT = this._$element[0].parentNode.querySelector('.customer-profile-header').clientHeight;
		const BlockNodeList = this._$element[0].querySelectorAll('cc-customer-attribute-editor');
		let offsetList = [];
		for (let index = 0, len = BlockNodeList.length; index < len; index++) {
			offsetList.push(BlockNodeList[index].offsetTop);
		}
		return offsetList.map(offset => offset - HEADER_HEIGHT);
	}

	/**
	 * @name updateAttributeBlockOffsetList
	 */
	updateAttributeBlockOffsetList() {
		this._$timeout(() => {
			this.attributesOffsetList = this.getAttributeBlockOffsetList();
		}, 50);
	}
}
