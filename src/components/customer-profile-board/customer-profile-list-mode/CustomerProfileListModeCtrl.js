/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 11:19
 */

import { Inject } from 'angular-es-utils';
import { Debounce } from 'angular-es-utils/decorators';

@Inject('$element')
export default class CustomerProfileListModeCtrl {
	constructor() {
		this.rightPanelScrollListener = this.rightPanelScrollListener.bind(this);
	}

	$onInit() {
		this.activeAttributeBlockIndex = 0;
		const RIGHTPANELELEMENT = this._$element[0].querySelector('.right-panel-block');
		RIGHTPANELELEMENT.addEventListener('scroll', this.rightPanelScrollListener);
	}

	$postLink() {
		this._$element.ready(() => {
			this.attributesOffsetList = this.getAttributeBlockOffsetList();
		});
	}

	$onDestroy() {
		const RIGHTPANELELEMENT = this._$element[0].querySelector('.right-panel-block');
		RIGHTPANELELEMENT.removeEventListener('scroll', this.rightPanelScrollListener);
	}

	@Debounce(50)
	rightPanelScrollListener(e) {
		this.activeAttributeBlockIndex = this.getActiveAttributeBlockIndex(e.target.scrollTop, this.attributesOffsetList);
	}

	getActiveAttributeBlockIndex(scrollTop = 0, offsetList = []) {
		let index = 0;
		for (let len = offsetList.length; index < len - 1; index++) {
			if (scrollTop < offsetList[index + 1]) break;
		}
		return index;
	}

	getAttributeBlockOffsetList() {
		const HEADERHEIGHT = this._$element[0].parentNode.querySelector('.customer-profile-header').clientHeight;
		const BlockNodeList = this._$element[0].querySelectorAll('customer-attribute-editor');
		let offsetList = [];
		for (let index = 0, len = BlockNodeList.length; index < len; index++) {
			offsetList.push(BlockNodeList[index].offsetTop);
		}
		return offsetList.map(offset => offset - HEADERHEIGHT);
	}
}
