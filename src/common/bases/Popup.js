/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-10
 */

import { addOnceEventListener } from '../../common/utils/dom-event';

export default class Popup {

	constructor(element, container, openedClass, closedClass) {
		this.element = element;
		this.container = container;
		this.openedClass = openedClass;
		this.closedClass = closedClass;
		this.hashChangeListener = null;
	}

	/**
	 * @abstract
	 */
	open() {

	}

	_onHashChange(onChange) {
		// 路由发生变更时自动关闭弹出框
		// FIXME 因为会存在路由切换过程中弹出modal的场景,所以必须确保路由切换完成之后才对modal做新的hashchange绑定
		setTimeout(() => {
			this.hashChangeListener = addOnceEventListener(window, 'hashchange', (onChange || this.close).bind(this));
		}, 0);
	}

	_offHashChange() {
		window.removeEventListener('hashchange', this.hashChangeListener);
	}

	/**
	 * @abstract
	 */
	close() {

	}

	/**
	 * @protected
	 * @param append2Container
	 * @param referNode
	 */
	init(append2Container = true, referNode) {
		this.container[append2Container ? 'appendChild' : 'insertBefore'](this.element, referNode);
		// 强制浏览器渲染dom(触发相应transition/animation)
		this.element.offsetHeight;
	}

	/**
	 * @protected
	 */
	destroy() {
		this.container.removeChild(this.element);
		this.element = this.container = this.openedClass = this.closedClass = null;
	}

	/**
	 * @protected
	 */
	show() {
		if (this.openedClass) {
			this.element.classList.add(this.openedClass);
		}
	}

	/**
	 * @protected
	 */
	hide() {
		this.element.classList.remove(this.openedClass);
		if (this.closedClass) {
			this.element.classList.add(this.closedClass);
		}
	}

}
