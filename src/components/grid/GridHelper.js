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
			actionName: 'get', // 调用 $resource 那个方法默认是 get
			postData: null, // 如果调用的方法是 post, 请提供 post Data
			resource: null, // 资源$resource
			response: null, // 对外暴露的response
			queryParams: null, // 外部查询参数
			enableMultipleFieldsSort: false, // 多字段排序(默认关闭). true -> 开启
			columnsDef: [],   // 列定义,包括 field:字段 displayName:字段名 cellTemplate:单元格模板 align:文字对齐方式 sortProp: 排序字段 sortOrder：排序规则
			enableHiddenColumns: false, // 自定义数据列，enum: false, Array(field)
			externalData: null, // 来自外部表格数据
			showPagination: true, // 是否展示分页
			headerTpl: null, // 表头模板,允许 字符串 or 模板url
			footerTpl: null, // 表尾模板,允许 字符串 or 模板url
			rowTpl: null, // 表格行模板,允许 字符串 or 模板url
			emptyTipTpl: null,  // 表格为空时的提示 允许 字符串 or 模板url
			transformer: null, // 数据格式转换方法 | 字段映射对象
			resetScrollBar: false, // 排序, 刷新, 分页操作重置 scrollBar 位置为 0
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
		gridOptions.errorMessage = '';

		// 如果不存在外部表格数据则请求接口拿数据
		if (!gridOptions.externalData && gridOptions.resource) {

			gridOptions.lastRequest && gridOptions.lastRequest.$cancelRequest && gridOptions.lastRequest.$cancelRequest();

			const pageParams = {
				pageNum: gridOptions.pager.pageNum,
				pageSize: gridOptions.pager.pageSize
			};

			const params = filter(Object.assign({}, pageParams, gridOptions.queryParams, queryParams), value => !!value);

			// 如果参数中包含 postData ，使用自定义请求
			gridOptions.lastRequest = gridOptions.postData ? gridOptions.resource[gridOptions.actionName](params, gridOptions.postData) : gridOptions.resource[gridOptions.actionName](params);

			return gridOptions.lastRequest.$promise

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
				})
				.catch(res => {
					gridOptions.errorMessage = `${res.status} ${res.statusText}`;
					gridOptions.loading = false;
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
