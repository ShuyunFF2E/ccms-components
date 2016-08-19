/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */

import angular from 'angular';
import ngEnter from '../ng-enter';
import ngDomValue from '../ng-dom-value';

import './_pagination.scss';
import controller from './PaginationCtrl';
import template from './pagination.tpl.html';

const paginationDDO = {

	template,
	controller,
	bindings: {
		type: '@?',
		totalPages: '<?',  // 总页数
		pageNum: '<?',  // 当前页码
		pageSize: '<?', // 每页大小
		pageSizeList: '<?',
		pageSizeListDisabled: '<?',
		onChange: '&?'	// 刷新回调
	}

};

export default angular
	.module('ccms.components.pagination', [ngEnter, ngDomValue])
	.component('ccPagination', paginationDDO)
	.deprecatedComponent('pagination', paginationDDO)
	.name;

