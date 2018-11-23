/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 * 表格控制器,包含一些表格的基本方法跟初始化逻辑
 */

import angular from 'angular';
import 'jquery.nicescroll';

import {Debounce, Inject} from 'angular-es-utils/decorators';

import rowTemplate from './tpls/row.tpl.html';
import errorMessageTpl from './tpls/error.tpl.html';
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

const SORT_ORDERS = ['asc', 'desc'];

@Inject('$scope', '$element')
export default class GridCtrl {

	$onInit() {
		this.$scope = this._$scope;
		this.selectedItems = this.selectedItems || [];
		const type = (this.type || 'default').toUpperCase();

		GridHelper.fillOpts(this.opts);

		const {headerTpl, emptyTipTpl, rowTpl, footerTpl} = this.opts;

		this.headerTemplate = TplReqHelper.get(headerTpl || GRID_TEMPLATES[type][0]);
		this.emptyTipsTemplate = TplReqHelper.get(emptyTipTpl || GRID_TEMPLATES[type][2]);
		this.footerTemplate = TplReqHelper.get(footerTpl || GRID_TEMPLATES[type][3]);
		this.errorMessageTpl = errorMessageTpl;

		if (rowTpl) {
			this.bodyTemplate = TplReqHelper.get(rowTpl);
		} else {
			this.bodyTemplate = rowTemplate;
			this.rowCellTemplate = GRID_TEMPLATES[type][1];
		}
		this.sortGridData();

		this.opts._gridElement = this._$element[0];
	}

	get $allSelected() {
		// 全选标识
		return !!this.selectedItems.length && !!this.opts.data && contains(this.selectedItems, this.opts.data);
	}

	@Debounce(200)
	onPagerChange(pageNum, pageSize) {

		const {opts} = this;
		opts.pager.pageNum = pageNum;
		opts.pager.pageSize = pageSize;
		const queryParams = Object.assign(opts.queryParams || {}, {pageNum, pageSize});

		this._refresh(opts, queryParams);
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
			if (!this.opts.enableMultipleFieldsSort) {
				this.opts.columnsDef.forEach(columnDef => {
					if (columnDef.sortProp !== column.sortProp) {
						delete columnDef.sortOrder;
					}
				});
			}
			this.sortGridData();
		}
	}

	sortGridData() {
		const sortQueryParam = {orders: [], props: []};
		const {opts} = this;
		let param = {sortProps: '', sortOrders: ''};

		this.opts.columnsDef.forEach(columnDef => {
			if (columnDef.sortProp && SORT_ORDERS.includes(columnDef.sortOrder)) {
				sortQueryParam.orders.push(columnDef.sortOrder);
				sortQueryParam.props.push(columnDef.sortProp);
			}
		});

		if (sortQueryParam.props.length > 0) {
			param = {
				pageNum: 1,
				sortProps: sortQueryParam.props.toString(),
				sortOrders: sortQueryParam.orders.toString()
			};
		}
		const queryParams = Object.assign(opts.queryParams || {}, param);

		this._refresh(opts, queryParams);
	}

	toggleColumnByIndex(index) {
		const column = this.opts.columnsDef[index];
		column.isHidden = !column.isHidden;
	}

	getShownColumnsCount() {
		return this.opts.columnsDef.reduce(
			(count, col) => col.isHidden ? count : count + 1, 0
		);
	}

	_refresh(opts, queryParams) {
		this.onBeforeRefresh && this.onBeforeRefresh({opts, queryParams});
		GridHelper
			.refresh(opts, queryParams)
			.then(gridOptions => {
				// 排序,刷新和切换分页数据操作后, 将 scrollTop 重置为 0
				if (this.opts.resetScrollBar) {
					this._$element[0].querySelector('div[cc-nice-scroll]').scrollTop = 0;
				}
				return this.onRefresh && this.onRefresh({opts: gridOptions});
			});
	}
}
