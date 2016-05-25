/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-10
 */

export default class Popup {

	constructor(element, container, openedClass, closedClass) {
		this.element = element;
		this.container = container;
		this.openedClass = openedClass;
		this.closedClass = closedClass;
	}

	/**
	 * @abstract
	 */
	open() {

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
