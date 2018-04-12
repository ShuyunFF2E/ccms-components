
import angular from 'angular';
import ngSanitize from 'angular-sanitize';
import bindHtml from '../bind-html';
import gsTabs from './tabs';
import GoodsSelectorService from './GoodsSelectorService';

export default angular
	.module('ccms.components.goodsSelector', [bindHtml, gsTabs, ngSanitize])
	.value('$ccGoodsSelector', GoodsSelectorService)
	.name;
