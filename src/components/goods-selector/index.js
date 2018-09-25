
import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import bindHtml from '../bind-html';
import gsTabs from './tabs';
import labelChoose from './labelChoose';
import GoodsSelectorService from './GoodsSelectorService';

export default angular
	.module('ccms.components.goodsSelector', [bindHtml, gsTabs, labelChoose, ngSanitize])
	.value('$ccGoodsSelector', GoodsSelectorService)
	.name;
