/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */

import {Animation} from 'angular-es-utils';

import Popup from '../../common/bases/Popup';

const OPENING_CLASS = 'tips-opening';

export default class Tips extends Popup {

	constructor(element, container, openHook, closeHook) {
		super(element, container);
		this.openHook = openHook;
		this.closeHook = closeHook;
	}

	open() {

		this.init();
		Animation.addClass(this.element, OPENING_CLASS, undefined, true);

		this.openHook();
	}

	close() {

		// FIXME 如何监听多个动画的onend事件(多个动画之间存在delay)
		Animation.removeClass(this.element, this.openedClass);
		Animation.addClass(this.element, 'tips-fade-out', () => {
			Animation.addClass(this.element, 'tips-compress', this.destroy.bind(this));
		});

		this.closeHook();
	}

}
