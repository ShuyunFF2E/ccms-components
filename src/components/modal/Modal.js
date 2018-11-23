/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-02-26
 */

import angular from 'angular';

import { isFunction } from 'angular-es-utils/type-auth';

import { Deferred, Animation, Throttle, Bind, getInjector } from 'angular-es-utils';
import Popup from '../../common/bases/Popup';
import { chopStyle2Num } from '../../common/utils/style-helper';
import CONSTANT from './Constants';

const noop = () => {
};
const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') !== -1;

export default class Modal extends Popup {

	/**
	 * modal对象,具备几个基本方法
	 * @param {HTMLElement} element
	 * @param renderDeferred 模板deferred
	 */
	constructor(element, renderDeferred) {

		super(element, document.body, CONSTANT.MODAL_OPENED_CLASS);

		this._renderDeferred = renderDeferred;

		// angular框架环境下使用$q($q.promise的回调会自动apply scope)
		let rootElement = document.querySelector('[ng-app]');
		if (angular && rootElement) {
			this._resultDeferred = getInjector().get('$q').defer();
		} else {
			this._resultDeferred = new Deferred();
		}

		this.result = this._resultDeferred.promise;

		this._modalContainer = this.element.querySelector(CONSTANT.MODAL_CONTAINER);
		this._modalBody = this.element.querySelector(CONSTANT.BODY_SELECTOR);
		this._confirmContainer = this.element.querySelector(CONSTANT.CONFIRM_CONTAINER);
	}

	@Bind
	@Throttle(CONSTANT.THROTTLE_DELAY)
	_resizeModal() {

		let modalStyle = this._modalContainer.style;
		let modalBodyStyle = this._modalBody.style;

		const header = this.element.querySelector(CONSTANT.HEADER_SELECTOR);
		const footer = this.element.querySelector(CONSTANT.FOOTER_SELECTOR);
		const othersHeight = (header && header.offsetHeight || 0) + (footer && footer.offsetHeight || 0);

		const maxWidth = Math.ceil(window.innerWidth * CONSTANT.SCALE);
		const maxHeight = Math.ceil(window.innerHeight * CONSTANT.SCALE);

		const minWidth = chopStyle2Num(window.getComputedStyle(this._modalContainer).getPropertyValue('min-width'));
		const minHeight = chopStyle2Num(window.getComputedStyle(this._modalBody).getPropertyValue('min-height')) + othersHeight;

		if (maxWidth > minWidth) {
			modalStyle.maxWidth = modalBodyStyle.maxWidth = `${maxWidth}px`;
		} else {
			modalStyle.maxWidth = modalBodyStyle.maxWidth = `${minWidth}px`;
		}

		if (maxHeight > minHeight) {
			modalStyle.maxHeight = `${maxHeight}px`;
			modalBodyStyle.maxHeight = `${maxHeight - othersHeight}px`;
		} else {
			modalStyle.maxHeight = `${minHeight}px`;
			modalBodyStyle.maxHeight = `${minHeight - othersHeight}px`;
		}

	}

	@Bind
	ok(value) {
		this.close();
		this._resultDeferred.resolve(value);
	}

	@Bind
	cancel(value) {
		this.close();
		this._resultDeferred.reject(value);
	}

	/**
	 * @param resizeable
	 * @returns {Modal}
	 */
	@Bind
	open(resizeable = true) {

		this.init();
		super.open();

		// modal初始化完成后显示modal
		this._renderDeferred.promise.then(() => {

			// modal打开时禁用底层文档滚动条
			document.body.style.overflow = 'hidden';
			this.show();

			if (resizeable) {
				this._resizeModal();
				window.addEventListener('resize', this._resizeModal);
			}

			this._onHashChange();

		});

		return this;
	}

	@Bind
	close(onClose = noop) {
		this.element.removeChild(this._modalContainer || this._confirmContainer);

		this._offHashChange();
		window.removeEventListener('resize', this._resizeModal);

		// force firefox to repaint for attaching trasitionend/animationend event
		if (isFirefox) {
			this.element.offsetHeight;
		}

		Animation.removeClass(this.element, CONSTANT.MODAL_OPENED_CLASS, () => {
			// 弹出框关闭恢复文档滚动行为
			document.body.style.overflow = 'auto';

			// 若modal绑定了ng-scope则手动回收scope
			if (this.element.$scope && typeof this.element.$scope.$destroy === 'function') {
				this.element.$scope.$destroy();
			}

			if (isFunction(onClose)) {
				onClose();
			}

			this.destroy();
		});
	}

}
