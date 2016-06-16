/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-05
 * 分页组件控制器
 */

import {Inject, Debounce} from 'angular-es-utils';

const DEFAULT_PAGER = {
	totals: 0,  // 总条数
	totalPages: 1,  // 总页数
	pageNum: 1,  // 当前页码
	pageSize: 20, // 每页大小
	pageSizeList: [10, 15, 20, 30, 50]
};

@Inject('$element')
export default class PaginationCtrl {

	constructor() {
		// 分页风格
		// enum: ['normal', 'simple']
		this.type = 'normal';

		this.pageSizeListDisabled = undefined;
	}

	$onInit() {
		let element = this.getElement();
		if (element.hasAttribute('page-size-list-disabled') && this.pageSizeListDisabled !== false) {
			this.pageSizeListDisabled = true;
		}

		// 初始化默认值
		Object.keys(DEFAULT_PAGER).forEach(prop => {
			this[prop] = this[prop] || DEFAULT_PAGER[prop];
		});
	}

	getElement() {
		return this._$element[0];
	}

	changePageNumByShortcut(type) {

		let {pageNum, totalPages, pageSize} = this;

		switch (type) {

			case 'first':
				pageNum = 1;
				break;

			case 'prev':

				if (!--pageNum) {
					pageNum = 1;
				}

				break;

			case 'next':

				if (++pageNum > totalPages) {
					pageNum = totalPages;
				}

				break;

			case 'last':
				pageNum = totalPages;
				break;

			// no default
		}

		if (pageNum !== this.pageNum) {
			this.changePager({pageNum, pageSize});
		}

	}

	// todo controller中不应该出现dom
	changePageNumByInput(event) {

		const inputDom = event.target;
		const value = inputDom.value;

		let {pageNum, totalPages, pageSize} = this;

		// 如果是非数字 or 输入页码大于总页码 则回滚成之前的值
		if (isNaN(value) || value > totalPages || value <= 0) {
			inputDom.value = pageNum;
		} else {
			pageNum = Number(value);
		}

		if (pageNum !== this.pageNum) {
			this.changePager({pageNum, pageSize});
		}

	}

	changePageSize(pageSize) {
		this.changePager({pageNum: 1, pageSize});
	}

	@Debounce(200)
	changePager(pagerInfo) {
		// 通知外部分页内容已发生变更
		this.onChange(pagerInfo);
	}

}

