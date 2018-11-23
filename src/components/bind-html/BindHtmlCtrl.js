/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-08-17
 */

import { Inject } from 'angular-es-utils/decorators';

function isPromiseLik(object) {
	return object && typeof object.then === 'function';
}

@Inject('$element', '$compile', '$scope')
export default class BindHtmlCtrl {

	$onChanges(changesObj) {

		const contentObj = changesObj.content;

		if (contentObj.currentValue !== contentObj.previousValue || contentObj.isFirstChange()) {
			this.compileContent(contentObj.currentValue);
		}

	}

	compileContent(content) {

		const compile = tpl => {
			this._$element[0].innerHTML = tpl;
			this._$compile(this._$element[0].childNodes)(this._$scope);
		};

		if (isPromiseLik(content)) {
			content.then(tpl => compile(tpl));
		} else {
			compile(content);
		}

	}
}
