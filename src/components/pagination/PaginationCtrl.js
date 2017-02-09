/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-05
 * 分页组件控制器
 */

import {Inject} from 'angular-es-utils';

@Inject('$scope', '$element')
export default class PaginationCtrl {

	constructor() {
		// 分页风格
		// enum: ['normal', 'simple']
		this.type = 'normal';

		this.pageSizeListDisabled = undefined;
	}

	$onInit() {
		let element = this.getElement();
		if (element.hasAttribute('page-size-list-hidden') && this.pageSizeListHidden !== false) {
			this.pageSizeListHidden = true;
		}
		if (element.hasAttribute('page-size-list-disabled') && this.pageSizeListDisabled !== false) {
			this.pageSizeListDisabled = true;
		}

		this._prepareWatches();
	}

	_prepareWatches() {
		const scope = this.getScope();

		scope.$watch(() => this.pageNum, pageNum => {
			this.isFirstPage = pageNum === 1;
			this.isLastPage = pageNum === this.totalPages;
			this.inputPage = pageNum;
		});

		scope.$watch(() => this.totalPages, totalPages => {
			this.isLastPage = this.pageNum === this.totalPages;
		});
	}

	get totalPages() {
		return this._totalPages || 1;
	}

	set totalPages(value) {
		this._totalPages = value;
	}

	get pageSize() {
		return this._pageSize || 20;
	}

	set pageSize(value) {
		this._pageSize = value;
	}

	get pageSizeList() {
		return this._pageSizeList || [10, 15, 20, 30, 50];
	}

	set pageSizeList(value) {
		this._pageSizeList = value;
	}

	getElement() {
		return this._$element[0];
	}

	getScope() {
		return this._$scope;
	}

	first() {
		this.pageNum = 1;
		this.onPageChange();
	}

	last() {
		this.pageNum = this.totalPages;
		this.onPageChange();
	}

	previous() {
		if (this.pageNum > 1) {
			this.pageNum--;
		}
		this.onPageChange();
	}

	next() {
		const { pageNum, totalPages } = this;
		if (pageNum < totalPages) {
			this.pageNum++;
		} else {
			this.pageNum = totalPages;
		}
		this.onPageChange();
	}

	goto(pageNum) {
		pageNum = Number(pageNum);
		if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > this.totalPages) {
			return false;
		}
		this.pageNum = pageNum;
		this.onPageChange();
		return true;
	}

	onPageChange() {
		const { pageNum, pageSize } = this;
		this.onChange({ pageNum, pageSize });
		console.log('onPageChange...');
	}

	setPageSize(pageSize) {
		this.pageSize = pageSize;
		this.pageNum = 1;
		this.onPageChange();
	}
}

