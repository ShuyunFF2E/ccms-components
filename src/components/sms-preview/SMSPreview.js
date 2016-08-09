/**
 * Created by AshZhang on 16/1/29.
 */


import './_sms-preview.scss';

import template from './sms-preview.tpl.html';

export default class SMSPreview {

	constructor() {
		Object.assign(this, {
			restrict: 'E',
			scope: {
				opts: '='
			},
			template
		});
	}

	link(scope, element) {

		scope.$watch('opts', () => {
			const opts = scope.opts || {};
			const varReg = /\$\$_(\[[^]]+])?(.+?)_\$\$/g;

			const gatewayType = opts.gatewayType;
			const text = opts.text || '';
			const preview = opts.preview || '';
			const signature = opts.signature || '';
			const customSignature = opts.customSignature ? `【${opts.customSignature.replace(/</g, '&lt;')}】` : '';
			const unsubscribeText = opts.useUnsubscribe ? (opts.unsubscribeText || '') : '';

			// 字数统计
			scope.totalChars = text.replace(varReg, '').length +
				(gatewayType === 1 || gatewayType === 3 ? signature.length : 0) +
				customSignature.length +
				unsubscribeText.length;

			// 变量统计
			const varMatch = text.match(varReg);
			scope.totalVars = varMatch ? varMatch.length : 0;

			element[0].querySelector('.sms-preview-content').innerHTML = this.generateText(preview, unsubscribeText, signature, customSignature, gatewayType);
		}, true);
	}

	/*
	 0: 短信 +【自定义签名】
	 1: 短信 +【自定义签名】+ 备案签名
	 2: 【自定义签名】+ 短信
	 3: 备案签名 +【自定义签名】+ 短信
	 */
	generateText(preview, unsubscribeText, signature, customSignature, gatewayType) {

		switch (gatewayType) {
			case 0:
				return preview + unsubscribeText + customSignature;
			case 1:
				return preview + unsubscribeText + customSignature + signature;
			case 2:
				return customSignature + preview + unsubscribeText;
			case 3:
				return signature + customSignature + preview + unsubscribeText;
		}

		return '';
	}
}
