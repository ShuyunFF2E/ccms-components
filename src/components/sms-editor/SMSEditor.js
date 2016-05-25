/**
 * Created by AshZhang on 2016/1/18.
 */


import './_sms-editor.scss';

import template from './sms-editor.tpl.html';
import SMSEditorCtrl from './SMSEditorCtrl';

export default class SMSEditor {

	constructor() {
		Object.assign(this, {
			bindToController: true,
			controller: SMSEditorCtrl,
			controllerAs: 'ctrl',
			replace: true,
			restrict: 'E',
			scope: {
				opts: '='
			},
			template
		});
	}
}
