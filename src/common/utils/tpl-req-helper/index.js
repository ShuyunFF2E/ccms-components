/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-02-25
 * 模板获取帮助类
 */

import injector from 'angular-es-utils/injector';

// 模板正则
const TEMPLATE_REGEXP = /<.+>/;

export default {

	get(tpl) {

		return injector.get('$q')(resolve => {

			// 如果是一个模板url
			if (!TEMPLATE_REGEXP.test(tpl)) {
				injector.get('$templateRequest')(tpl).then(template => resolve(template));
			} else {
				resolve(tpl);
			}

		});
	}
};
