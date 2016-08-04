/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 * 表格控制器,包含一些表格的基本方法跟初始化逻辑
 */

import angular from 'angular';
import 'jquery.nicescroll';

import { Debounce } from 'angular-es-utils/decorators';

import rowCellTemplate from './tpls/row-cell.tpl.html';
import browser from '../../common/utils/browser';
import TplReqHelper from '../../common/utils/tpl-req-helper';

import GRID_TEMPLATES from './Constant';
import GridHelper from './GridHelper';

/**
 * 容器是否包含另一个集合
 */
function contains(container, collection) {
	return !!collection && collection.every(item => findEntity(container, item) !== -1);
}

/**
 * 从集合中获取entity的index,找不到返回-1
 */
function findEntity(collection, entity) {
	return collection.findIndex(item => angular.equals(item, entity));
}

const PLACEHOLDER = '{::cell-placeholder}';
const $ = window.NiceScroll.getjQuery();
const SORT_ORDERS = ['asc', 'desc'];

export default class GridCtrl {

	$onInit() {

		this.selectedItems = this.selectedItems || [];
		const type = (this.type || 'default').toUpperCase();

		GridHelper.fillOpts(this.opts);

		const {headerTpl, emptyTipTpl, cellTpl} = this.opts;

		this.headerTemplate = TplReqHelper.get(headerTpl || GRID_TEMPLATES[type][0]);
		this.emptyTipsTemplate = TplReqHelper.get(emptyTipTpl || GRID_TEMPLATES[type][2]);
		TplReqHelper.get(cellTpl || GRID_TEMPLATES[type][1]).then(tpl => {
			this.bodyTemplate = rowCellTemplate.replace(PLACEHOLDER, tpl);
		});

		// 排序
		this.sortGridData(true);
	}

	$postLink() {
		if (browser.os !== 'MacOS') {
			$('.cc-grid [data-id=tbody]').niceScroll();
		}
	}

	get $allSelected() {
		// 全选标识
		return !!this.selectedItems.length && !!this.opts.data && contains(this.selectedItems, this.opts.data);
	}

	@Debounce(200)
	onPagerChange(pageNum, pageSize) {

		const {opts} = this;

		GridHelper
			.refresh(opts, Object.assign(opts.queryParams || {}, {pageNum, pageSize}))
			.then(() => this.onRefresh && this.onRefresh({opts}));
	}

	switchSelectAll(allSelected, selectedCollection) {

		selectedCollection.forEach(entity => {

			const index = findEntity(this.selectedItems, entity);

			if (allSelected) {
				if (index === -1) {
					this.selectedItems.push(entity);
				}
			} else {
				if (index !== -1) {
					this.selectedItems.splice(index, 1);
				}
			}
		});
	}

	switchSelectItem($selected, entity) {

		if ($selected) {
			this.selectedItems.push(entity);
		} else {
			this.selectedItems.splice(findEntity(this.selectedItems, entity), 1);
		}
	}

	isEntitySelected(entity) {
		return findEntity(this.selectedItems, entity) !== -1;
	}

	toggleSort(column) {
		if (column.sortProp) {
			switch (column.sortOrder) {
				case 'asc':

					column.sortOrder = 'desc';
					break;
				case 'desc':

					column.sortOrder = undefined;
					break;
				default:

					column.sortOrder = 'asc';
					break;
			}
			this.sortGridData();
		}
	}

	sortGridData(isInit = false) {

		const sortQueryParam = {
			orders: [],
			props: []
		};

		const {opts} = this;

		this.opts.columnsDef.forEach(column => {
			if (column.sortProp && SORT_ORDERS.includes(column.sortOrder)) {
				sortQueryParam.orders.push(column.sortOrder);
				sortQueryParam.props.push(column.sortProp);
			}
		});

		GridHelper
			.refresh(opts, Object.assign(opts.queryParams || {},
				sortQueryParam.props.length > 0 ? {
					pageNum: 1,
					sortProps: sortQueryParam.props.toString(),
					sortOrders: sortQueryParam.orders.toString()
				} : {sortProps: '', sortOrders: ''}))
			.then(() => {
				if (!isInit && this.onRefresh) {
					this.onRefresh({opts});
				}
			});
	}

	toggleColumnByIndex(index) {
		const columns = this.opts.columnsDef;
		const column = columns[index];
		column.isHidden = !column.isHidden;
	}

	getShownColumnsCount() {
		return this.opts.columnsDef.reduce(
			(count, col) => col.isHidden ? count : count + 1, 0
		);
	}
}
