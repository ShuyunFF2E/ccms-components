
import angular from 'angular';
import bindHtml from '../bind-html';
import gsTabs from './tabs';
import GoodsSelectorService from './GoodsSelectorService';

export default angular
	.module('ccms.components.goodsSelector', [bindHtml, gsTabs])
	.value('$ccGoodsSelector', GoodsSelectorService)
	.name;
