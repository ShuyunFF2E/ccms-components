/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 * 表格控制器,包含一些表格的基本方法跟初始化逻辑
 */

import angular from 'angular';
import rowCellTemplate from './tpls/row-cell.tpl.html';
import TplReqHelper from '../../common/utils/tpl-req-helper';

import GRID_TEMPLATES from './Constant';
import GridHelper from './GridHelper';

const PLACEHOLDER = '{::cell-placeholder}';

export default class GridCtrl {

	$onInit() {

		this.selectedItems = this.selectedItems || [];
		this.$allSelected = false;
		const type = (this.type || 'default').toUpperCase();

		GridHelper.fillOpts(this.opts);

		const {headerTpl, emptyTipTpl, cellTpl} = this.opts;

		this.headerTemplate = TplReqHelper.get(headerTpl || GRID_TEMPLATES[type][0]);
		this.emptyTipsTemplate = TplReqHelper.get(emptyTipTpl || GRID_TEMPLATES[type][2]);
		TplReqHelper.get(cellTpl || GRID_TEMPLATES[type][1]).then(tpl => {
			this.bodyTemplate = rowCellTemplate.replace(PLACEHOLDER, tpl);
		});

		// 刷新页面
		GridHelper.refresh(this.opts);
	}

	get $partSelected() {
		// 部分选中标识
		return !this.$allSelected && this.selectedItems.length > 0;
	}

	get $allSelected() {
		// 全选标识
		return !!this.selectedItems.length && !!this.opts.data && (this.opts.data.length === this.selectedItems.length);
	}

	set $allSelected(value) {
		return value;
	}

	onPagerChange(pageNum, pageSize) {
		// 每次页码更新重置全选状态
		this.$allSelected = false;
		this.selectedItems.length = 0;
		GridHelper.refresh(this.opts, Object.assign(this.opts.queryParams || {}, {pageNum, pageSize}));
	}

	selectAll(allSelected) {

		if (allSelected) {
			// 先清空,然后将所有表格数据存入选中数组
			this.selectedItems.length = 0;
			Array.prototype.push.apply(this.selectedItems, this.opts.data);
		} else {
			this.selectedItems.length = 0;
		}
	}

	selectItem(entity, $selected) {

		if ($selected) {
			this.selectedItems.push(entity);
		} else {
			this.selectedItems.splice(this.selectedItems.indexOf(entity), 1);
		}
	}

	isEntitySelected(entity) {
		return this.selectedItems.indexOf(entity) !== -1 || this.selectedItems.some(item => angular.equals(item, entity));
	}

}
