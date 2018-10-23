/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-02-25
 */

import './_modal.scss';

import angular from 'angular';
import injector from 'angular-es-utils/injector';

import modalTemplate from './modal.tpl.html';
import confirmTemplate from './confirm.tpl.html';
import Modal from './Modal';
import CONSTANT from './Constants';

const noop = () => {
};

/**
 * modal服务
 */
const ModalService = {

	/**
	 *
	 * {
	 *  scope:  {Scope} modal需要继承的scope,不设置则为$rootScope
	 *  title:  {string} modal框的标题
	 *  style:  {object} modal自定义样式,多为宽高
	 *  fullscreen:   {boolean} 是否允许全屏,默认不允许
	 *  hasFooter: {boolean} 是否有底部按钮,默认有
	 *  body:   {string} 模板url,modal主体内容区
	 *  footer: {string} 模板url,modal footer按钮区
	 *  header: {string} 模板url,modal header头部区
	 *  locals: {object} 需要传递到modal控制器中的数据,以服务的方式注入
	 *  controller: {function|string} 控制器
	 *  controllerAs: {string} 控制器别名,默认为$ctrl
	 *  bindings: {boolean|Object} 为true时则从scope中复制数据,为Object则直接从提供的这个对象中复制数据(浅复制)
	 * }
	 *
	 * @returns {Modal}
	 */
	modal({scope, title, style, fullscreen = false, hasFooter = true, body, uid, __body, header, footer, locals, controller, controllerAs = '$ctrl', bindings, onClose = noop}) {

		const $compile = injector.get('$compile');
		const $rootScope = injector.get('$rootScope');
		const $q = injector.get('$q');
		const $templateRequest = injector.get('$templateRequest');
		const $controller = injector.get('$controller');

		let modalElement = angular.element(modalTemplate);
		let modalHTMLElement = modalElement[0];
		let modalContainer$Element = angular.element(modalHTMLElement.querySelector('.container'));

		// 如果指定了scope,则以该scope为父作用域构建modal作用域,否则以rootScope为父作用域构建
		const providedScope = scope || $rootScope;
		let modalScope = providedScope.$new();
		// 将当前scope挂载到节点上,节点销毁时会回收scope
		modalHTMLElement.$scope = modalScope;

		let renderDeferred = $q.defer();
		let modalInstance = new Modal(modalHTMLElement, renderDeferred);

		// 从配置中获取 body/footer 模版
		// 私有属性 __body 允许配置字符串模板
		let tplPromises = {
			bodyTpl: __body ? $q.resolve(__body) : $templateRequest(body),
			footerTpl: footer ? $templateRequest(footer) : $q.resolve(null),
			headerTpl: header ? $templateRequest(header) : $q.resolve(null)
		};
		$q.all(tplPromises).then(({bodyTpl, footerTpl, headerTpl}) => {

			// 复制modal的scope中支持的属性
			modalScope.title = title;
			modalScope.style = style;
			modalScope.fullscreen = fullscreen;
			modalScope.uid = uid;

			// 为模板scoep添加方法
			modalScope.$ok = modalInstance.ok;
			modalScope.$cancel = modalInstance.cancel;
			modalScope.$close = () => {
				modalInstance.close(onClose);
			};
			modalScope.$toggleFullScreen = isFullScreen => {
				modalScope.$parent.isFullScreen = isFullScreen;
				if (isFullScreen) {
					const clientRect = modalContainer$Element[0].getClientRects()[0];
					modalScope.top = clientRect.top;
					modalScope.left = clientRect.left;
					modalContainer$Element.css({
						top: 0,
						left: 0
					});
				} else {
					modalContainer$Element.css({
						top: `${modalScope.top}px`,
						left: `${modalScope.left}px`
					});
				}
			};

			if (controller) {

				const ctrlLocals = Object.assign({
					$scope: modalScope,
					$element: modalContainer$Element,
					modalInstance: modalInstance
				}, locals);

				let ctrlInstance;

				// 构建controller壳子,等数据全部绑定完成后再做初始化($controller第三个参数设成true,private api),黑科技hold不住别乱用hhh
				// @see https://github.com/angular/angular.js/blob/master/src/ng/controller.js#L126
				let ctrlInstantiate = $controller(controller, ctrlLocals, true);

				// 获取controller实例引用,此时还未初始化
				ctrlInstance = ctrlInstantiate.instance;

				// 将scope上的数据绑定到controller中
				if (bindings) {

					let bindingsForController = angular.isObject(bindings) ? bindings : providedScope;
					Object.assign(ctrlInstance, bindingsForController);
				}

				// 正式实例化controller
				ctrlInstance = ctrlInstantiate();
				// 将controller实例上的回调绑定到scope上
				ctrlInstance.ok && (modalScope.$ok = ctrlInstance.ok.bind(ctrlInstance));
				ctrlInstance.cancel && (modalScope.$cancel = ctrlInstance.cancel.bind(ctrlInstance));
				ctrlInstance.close && (modalScope.$close = ctrlInstance.close.bind(ctrlInstance));

				modalScope[controllerAs] = ctrlInstance;

				if (angular.isFunction(ctrlInstance.$onInit)) {
					ctrlInstance.$onInit();
				}
			}

			modalHTMLElement.querySelector(CONSTANT.BODY_SELECTOR).innerHTML = bodyTpl;
			if (footerTpl) {
				modalHTMLElement.querySelector(CONSTANT.FOOTER_SELECTOR).innerHTML = footerTpl;
			}
			if (headerTpl) {
				modalHTMLElement.querySelector(CONSTANT.HEADER_SELECTOR).innerHTML = headerTpl;
			}

			// 如果配置了没有底部,则手动将底部块移除.这里不采用ng-if的指令方式是因为$compile是一个异步过程,会导致后面的计算出问题
			if (!hasFooter) {
				const footer = modalHTMLElement.querySelector('footer');
				footer.parentNode.removeChild(footer);
			}

			renderDeferred.resolve($compile(modalElement)(modalScope));
		});

		return modalInstance;
	},

	confirm(message, onClose = noop) {

		const $rootScope = injector.get('$rootScope');
		const $q = injector.get('$q');
		const $compile = injector.get('$compile');

		let confirmElement = angular.element(confirmTemplate);
		let confirmDOMElement = confirmElement[0];

		let renderDeferred = $q.defer();
		let confirmInstance = new Modal(confirmDOMElement, renderDeferred);

		let scope = $rootScope.$new();
		scope.message = message;
		scope.$ok = confirmInstance.ok;
		scope.$cancel = confirmInstance.cancel;
		scope.$close = () => {
			confirmInstance.close();
			onClose();
		};

		$compile(confirmDOMElement.querySelector(CONSTANT.CONFIRM_CONTAINER))(scope);

		renderDeferred.resolve();

		const originalOpen = confirmInstance.open;
		// confirm不需要resizable功能
		confirmInstance.open = () => originalOpen(false);

		return confirmInstance;

	}

};

export default ModalService;
