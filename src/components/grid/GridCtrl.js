/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 * 表格控制器,包含一些表格的基本方法跟初始化逻辑
 */

import angular from 'angular';
import {Debounce} from 'angular-es-utils/decorators';

import rowCellTemplate from './tpls/row-cell.tpl.html';
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

export default class GridCtrl {

	constructor() {
		this.columns = [];
	}

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

		this.updateColumns();

		// -temp column config
		this.sortConfig = [];
		this.opts.columnsDef.forEach(col => {
			let colConfig = {};

			// - 根据 col.sort 的类型分别处理
			switch (typeof col.sort) {

				case 'boolean':

					if (!col.field && col.cellTemplate) {

						console.warn('grid 配置中[' + col.displayName + ']列未指定排列属性,会造成失效!');
					}

					colConfig.prop = col.field;
					colConfig.type = 'default';
					break;

				case 'string':

					colConfig.prop = col.sort;
					colConfig.type = 'default';
					break;

				default:

					colConfig = null;
					break;
			}
			this.sortConfig.push(colConfig);
		});

		// 刷新页面
		GridHelper.refresh(this.opts);
	}

	get $allSelected() {
		// 全选标识
		return !!this.selectedItems.length && !!this.opts.data && contains(this.selectedItems, this.opts.data);
	}

	@Debounce(200)
	onPagerChange(pageNum, pageSize) {

		const {opts} = this;

		GridHelper
			.refresh(opts, Object.assign(opts.queryParams || {}, {pageNum, pageSize}), this.sortConfig)
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

	toggleColumn(field) {
		// TODO: 至少保留一个显示的列
		const hiddenColumns = this.opts.hiddenColumns;
		const index = hiddenColumns.indexOf(field);
		if (index !== -1) {
			hiddenColumns.splice(index, 1);
		} else {
			hiddenColumns.push(field);
		}
		this.updateColumns();
	}

	updateColumns() {
		// 记录没有被设置隐藏的列
		const hiddenColumns = this.opts.hiddenColumns;
		if (Array.isArray(hiddenColumns)) {
			this.columns = this.opts.columnsDef.filter(column => {
				return hiddenColumns.indexOf(column.field) === -1;
			});
		} else {
			this.columns = [...this.opts.columnsDef];
		}
	}

	runColumnSorting(index) {

		// - 遍历sortConfig 修改状态
		this.sortConfig.forEach((config, cIndex) => {
			if (config) {
				if (index === cIndex) {
					config.type = config.type === 'asc' ? 'desc' : 'asc';
				} else {
					config.type = 'default';
				}
			}
		});

		const columnConfig = this.sortConfig[index];

		const {opts} = this;

		GridHelper
			.refresh(opts, Object.assign(opts.queryParams || {}, {
				sortOrder: columnConfig ? columnConfig.type : '',
				sortProp: columnConfig ? columnConfig.prop : ''
			})).then(() => this.onRefresh && this.onRefresh({opts}));
	}
}
