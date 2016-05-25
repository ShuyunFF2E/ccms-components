/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-11
 */

import {Inject} from 'angular-es-utils';
import throttle from './throttle';

@Inject('$timeout')
export default class Performance {

	constructor($timeout) {
		this.$timeout = $timeout;
	}

	/**
	 * 函数只会在确定时间延时后才会被触发(只会执行间隔时间内的最后一次调用)
	 */
	debounce(func, delay, scope, invokeApply) {

		const $timeout = this.$timeout;
		let timer;

		return (...args) => {
			const context = scope;

			$timeout.cancel(timer);
			timer = $timeout(() => {

				timer = undefined;
				func.apply(context, args);

			}, delay || 300, invokeApply);
		};
	}

	throttle(...args) {
		return throttle(...args);
	}

}
