/**
 * Created by AshZhang on 16/1/29.
 */


import './_sms-preview.scss';
import template from './sms-preview.tpl.html';
import angular from 'angular';
import { escapeRegExp } from '../../common/bases/common';

export default {

	restrict: 'E',
	scope: {
		opts: '='
	},
	template,

	link(scope, element) {

		const opts = scope.opts || (scope.opts = {});
		const keywordPrefix = scope.opts.keywordPrefix || '$$';
		const keywordSuffix = scope.opts.keywordSuffix || '$$';
		const trimContent = angular.isDefined(opts.trimContent) ? opts.trimContent : true;
		scope.smsPreviewStatText = trimContent ? '不含变量' : '含空格，不含变量';
		scope.smsPreviewTipsText = trimContent ? '上图仅为操作预览，最终计数以实际发送为准，查看' : '上图仅为操作预览，变量无固定长度，最终计数以实际发送为准，建议先测试执行，查看';
		scope.smsPreviewTipsInTipsText = opts.smsChargeTips || '单条短信字数限制 70 字；超出 70 字，按 67 字条计费；<br>字数和计费条数以实际执行时发送为准。';

		scope.$watch('opts', () => {
			const varReg = RegExp(`${escapeRegExp(keywordPrefix)}_(\\[[^]]+])?(.+?)_${escapeRegExp(keywordSuffix)}`, 'g');

			const gatewayType = opts.gatewayType;
			const text = opts.text || '';
			const preview = opts.preview || '';
			const signature = opts.signature || '';
			const customSignature = opts.customSignature ? `【${opts.customSignature.replace(/</g, '&lt;')}】` : '';
			const unsubscribeText = opts.useUnsubscribe ? (opts.unsubscribeText || '') : '';

			// 字数统计
			scope.totalChars = opts.totalCharts = text
					.replace(varReg, '')
					.replace(/#_enter_#/g, '').length +
				(gatewayType === 1 || gatewayType === 3 ? signature.length : 0) +
				customSignature.length +
				unsubscribeText.length;
			// 换行统计
			scope.newLineNum = opts.newLineNum = text.split('#_enter_#').length - 1;

			// 变量统计
			const varMatch = text.match(varReg);
			scope.totalVars = opts.totalVars = varMatch ? varMatch.length : 0;

			element[0].querySelector('.sms-preview-content').innerHTML = this.generateText(preview, unsubscribeText, signature, customSignature, gatewayType);
		}, true);
	},

	/*
	 0: 短信 +【自定义签名】
	 1: 短信 +【自定义签名】+ 备案签名
	 2: 【自定义签名】+ 短信
	 3: 备案签名 +【自定义签名】+ 短信
	 */
	generateText(preview, unsubscribeText, signature, customSignature, gatewayType) {
		const content = preview.split('#_enter_#');
		const len = content.length;

		switch (gatewayType) {
			case 0:
				content[len - 1] = content[len - 1] + unsubscribeText + customSignature;
				return this.formatEmpty(content);
			case 1:
			case 5:
				content[len - 1] = content[len - 1] + unsubscribeText + customSignature + signature;
				return this.formatEmpty(content);
			case 2:
				content[0] = customSignature + content[0];
				content[len - 1] = content[len - 1] + unsubscribeText;
				return this.formatEmpty(content);
			case 3:
			case 4:
				content[0] = signature + customSignature + content[0];
				content[len - 1] = content[len - 1] + unsubscribeText;
				return this.formatEmpty(content);
		}

		return '';
	},

	/**
	 * 将空行标记格式化
	 * */
	formatEmpty(data) {
		const sms = [];
		for (let item of data) {
			const content = item.length ? `<div>${item}</div>` : '<div><br/></div>';
			sms.push(content);
		}
		return sms.join('');
	}
};
