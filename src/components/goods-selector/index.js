
import angular from 'angular';
import bindHtml from '../bind-html';
import GoodsSelectorService from './GoodsSelectorService';

export default angular
	.module('ccms.components.goodsSelector', [bindHtml])
	.value('$ccGoodsSelector', GoodsSelectorService)
	.name;
