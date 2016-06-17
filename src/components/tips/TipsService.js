/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-08
 */

import {Inject} from 'angular-es-utils';
import angular from 'angular';

import {position} from '../../common/utils/style-helper';
import throttle from '../../common/utils/performance/throttle';
import Tips from './Tips';
import tipsTpl from './float-tips.tpl.html';

const TIPS_TYPE = {
	SUCCESS: 'success',
	ERROR: 'error'
};

const FLOAT_TIPS_CONTAINER = '<div class="float-tips-container"></div>';

const AUTO_CLOSE_DELAY = 3 * 1000;

const noopCloneAttachFn = () => {
};

@Inject('$compile', '$rootScope')
export default class TipsService {

	constructor() {
		this.containerMap = new Map();
		this._linkedTpl = null;
	}

	_create(type, msg, contextContainer = document.body) {

		// 性能考虑,模板只编译一次
		if (!this._linkedTpl) {
			this._linkedTpl = this._$compile(angular.element(tipsTpl));
		}

		let floatTipsContainer = this.containerMap.get(contextContainer);
		// 如果未在当前父容器里使用过float-tips
		if (!floatTipsContainer) {

			// 将浮动tips的容器加入到当前上下文容器中
			floatTipsContainer = angular.element(FLOAT_TIPS_CONTAINER)[0];
			contextContainer.appendChild(floatTipsContainer);

			this.containerMap.set(contextContainer, floatTipsContainer);
		}

		// 初始化tips
		let scope = this._$rootScope.$new();
		scope.type = type;
		scope.msg = msg;

		const tipsHook = throttle(() => setTipsPosition(contextContainer, floatTipsContainer), 100);
		const tips = new Tips(this._linkedTpl(scope, noopCloneAttachFn)[0], floatTipsContainer, () => window.addEventListener('resize', tipsHook),
			() => window.removeEventListener('resize', tipsHook));

		// 成功类型的tips在用户点击close按钮或者timeout完成时自动关闭
		const closePromise = new Promise(resolve => scope.$close = resolve);
		const timeOutPromise = new Promise(resolve => setTimeout(resolve, AUTO_CLOSE_DELAY));
		const racePromises = (type === TIPS_TYPE.SUCCESS) ? [closePromise, timeOutPromise] : [closePromise];
		Promise.race(racePromises).then(::tips.close);

		// 根据上下文容器设置提示层位置
		setTipsPosition(contextContainer, floatTipsContainer);
		tips.open();
	}

	success(msg, container) {
		this._create(TIPS_TYPE.SUCCESS, msg, container);
	}

	error(msg, container) {
		this._create(TIPS_TYPE.ERROR, msg, container);
	}

}

function setTipsPosition(contextContainer, floatTipsContainer) {
	floatTipsContainer.style.top = `${position(contextContainer).top}px`;
}
