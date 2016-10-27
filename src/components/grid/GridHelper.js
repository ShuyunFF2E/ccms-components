/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */
import injector from 'angular-es-utils/injector';
import { isPromiseLike, isObject, isFunction } from 'angular-es-utils/type-auth';

import filter from '../../common/utils/object/filter';

function transformer(response, mapping) {

	let result = Object.assign({}, response);

	for (let prop in mapping) {
		if (mapping.hasOwnProperty(prop)) {
			result[prop] = response[mapping[prop]] || response[prop];
		}
	}

	return result;
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
			enableHiddenColumns: false, // 自定义数据列，enum: false, Array(field)
			externalData: null, // 来自外部表格数据
			showPagination: true, // 是否展示分页
			headerTpl: null, // 表头模板,允许 字符串 or 模板url
			rowTpl: null, // 表格行模板,允许 字符串 or 模板url
			emptyTipTpl: null,  // 表格为空时的提示 允许 字符串 or 模板url
			transformer: null, // 数据格式转换方法 | 字段映射对象
			pager: {
				totals: 0,  // 总条数
				totalPages: 1,  // 总页数
				pageNum: 1,  // 当前页码
				pageSize: 20, // 每页大小
				pageSizeList: [10, 15, 20, 30, 50],
				pageSizeListDisabled: false
			} // 分页配置 @see pagination component
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

			const params = filter(Object.assign({}, pageParams, gridOptions.queryParams, queryParams), value => !!value);

			return gridOptions.resource.get(params).$promise

				.then(res => {

					let transformedData = null;

					if (gridOptions.transformer) {
						if (isFunction(gridOptions.transformer)) {
							transformedData = gridOptions.transformer(res);
						} else if (isObject(gridOptions.transformer)) {
							transformedData = transformer(res, gridOptions.transformer);
						}
					} else {
						transformedData = res;
					}

					gridOptions.response = res;
					gridOptions.data = transformedData.list;
					gridOptions.loading = false;

					let pager = gridOptions.pager;

					pager.pageNum = transformedData.pageNum;
					pager.pageSize = transformedData.pageSize;
					pager.totals = transformedData.totals;
					pager.totalPages = Math.ceil((transformedData.totals || 0) / pager.pageSize);

					return gridOptions;
				});

		} else {

			const finish = data => {
				gridOptions.data = data;
				gridOptions.loading = false;
				return gridOptions;
			};

			if (isPromiseLike(gridOptions.externalData)) {
				return gridOptions.externalData.then(finish);
			} else {
				return injector.get('$q').resolve(finish(gridOptions.externalData));
			}

		}
	}

};
