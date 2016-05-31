/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */

import injector from 'angular-es-utils/injector';

function isPromiseLike(obj) {
	return !!obj && typeof obj.then === 'function';
}

/**
 * 表格服务,对外提供刷新服务
 */
export default {

	fillOpts(gridOptions) {

		let DEFAULT_CONFIGS = {
			resource: null, // 资源$resource
			response: null, // 对外暴露的response
			queryParams: null, // 外部查询参数
			columnsDef: [],   // 列定义,包括 field:字段 displayName:字段名 cellTemplate:单元格模板 align:文字对齐方式
			externalData: null, // 来自外部表格数据
			showPagination: true, // 是否展示分页
			headerTpl: null, // 表头模板,允许 字符串 or 模板url
			cellTpl: null, // 表格元素模板,允许 字符串 or 模板url
			emptyTipTpl: null,  // 表格为空时的提示 允许 字符串 or 模板url
			pager: {
				totals: 0,  // 总条数
				totalPages: 1,  // 总页数
				pageNum: 1,  // 当前页码
				pageSize: 20, // 每页大小
				pageSizeList: [10, 15, 20, 30, 50]
			}
		};

		return Object.assign(gridOptions, Object.assign(DEFAULT_CONFIGS, gridOptions));
	},

	refresh(gridOptions, queryParams) {

		this.fillOpts(gridOptions);
		gridOptions.loading = true;

		// 如果不存在外部表格数据则请求接口拿数据
		if (!gridOptions.externalData && gridOptions.resource) {

			const pageParams = {
				pageNum: gridOptions.pager.pageNum,
				pageSize: gridOptions.pager.pageSize
			};

			const $rootScope = injector.get('$rootScope');
			const params = Object.assign({}, pageParams, gridOptions.queryParams, queryParams);

			gridOptions.resource.get(params).$promise

				.then(res => {

					gridOptions.response = res;
					gridOptions.data = res.list;
					gridOptions.loading = false;

					let pager = gridOptions.pager;

					pager.pageNum = res.pageNum || 1;
					pager.pageSize = res.pageSize || 20;
					pager.totals = res.totals || 0;
					pager.totalPages = Math.ceil((res.totals || 0) / pager.pageSize);

					gridOptions.asyncChanged = true;

					// 当$http触发的apply调用即将接收，重置状态（基于js单线程原理）
					$rootScope.$$postDigest(() => {
						gridOptions.pager.asyncChanged = false;
					});

				});

		} else {

			const finish = data => {
				gridOptions.data = data;
				gridOptions.loading = false;
			};

			if (isPromiseLike(gridOptions.externalData)) {
				gridOptions.externalData.then(finish);
			} else {
				finish(gridOptions.externalData);
			}

		}
	}

};
