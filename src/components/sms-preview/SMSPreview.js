/**
 * Created by AshZhang on 16/1/29.
 */


import './_sms-preview.scss';
import template from './sms-preview.tpl.html';
import angular from 'angular';
import { escapeRegExp } from '../../common/bases/common';

let defaultKeywordPrefix = 'œœ';
let defaultKeywordSuffix = 'œœ';
let defaultKeywordEnter = 'þ_enter_þ';

import injector from 'angular-es-utils/injector';

export default {

	restrict: 'E',
	scope: {
		opts: '='
	},
	template,

	link(scope, element) {

		const opts = scope.opts || (scope.opts = {});

		if (!scope.opts.isMarketing) {
			defaultKeywordPrefix = '$$';
			defaultKeywordSuffix = '$$';
			defaultKeywordEnter = '#_enter_#';
		}

		const keywordPrefix = scope.opts.keywordPrefix || defaultKeywordPrefix;
		const keywordSuffix = scope.opts.keywordSuffix || defaultKeywordSuffix;
		this.keywordEnter = defaultKeywordEnter;

		const trimContent = angular.isDefined(opts.trimContent) ? opts.trimContent : true;
		scope.smsPreviewStatText = trimContent ? '不含变量' : '含空格，不含变量';
		scope.smsPreviewTipsText = trimContent ? '2.上图仅为操作预览，最终字数和计费条数以实际执行时发送为准。' : '2.上图仅为操作预览，变量无固定长度，最终字数和计费条数以实际执行时发送为准，建议先测试执行。';

		scope.$watch('opts', () => {
			const varReg = RegExp(`${escapeRegExp(keywordPrefix)}_(\\[[^]]+])?(.+?)_${escapeRegExp(keywordSuffix)}`, 'g');

			const gatewayType = opts.gatewayType;
			const text = opts.text || '';
			const preview = opts.preview || '';
			const signature = opts.signature || '';
			const customSignature = opts.customSignature ? `【${opts.customSignature.replace(/</g, '&lt;')}】` : '';
			const unsubscribeText = opts.useUnsubscribe ? (opts.unsubscribeText || '') : '';

			scope.smsPreviewTipsInTipsText = injector.get('$sce').trustAsHtml(opts.smsChargeTips ? `1.${opts.smsChargeTips}` : '1.当前通道单条短信字数限制 <span style="color: red;">70</span> 个字；超出 70 个字，按 <span style="color: red;">67</span> 字一条计费；');
			// 字数统计
			scope.totalChars = opts.totalCharts = text
					.replace(varReg, '')
					.replace(new RegExp(this.keywordEnter, 'g'), '').length +
				(gatewayType === 1 || gatewayType === 3 || gatewayType === 4 || gatewayType === 5 ? signature.length : 0) +
				customSignature.length +
				unsubscribeText.length;
			// 换行统计
			scope.newLineNum = opts.newLineNum = text.split(this.keywordEnter).length - 1;

			// 变量统计
			const varMatch = text.match(varReg);
			scope.totalVars = opts.totalVars = varMatch ? varMatch.length : 0;

			element[0].querySelector('.sms-preview-content').innerHTML = opts.generatedText = this.generateText(preview, unsubscribeText, signature, customSignature, gatewayType);
		}, true);
	},

	/*
	 0: 短信 +【自定义签名】
	 1,5: 短信 +【自定义签名】+ 备案签名
	 2: 【自定义签名】+ 短信
	 3,4: 备案签名 +【自定义签名】+ 短信
	 */
	generateText(preview, unsubscribeText, signature, customSignature, gatewayType) {
		const content = preview.split(this.keywordEnter);
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
