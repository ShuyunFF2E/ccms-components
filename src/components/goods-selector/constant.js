export const apiPrefix = '/api';
// export const apiPrefix = '/shuyun-searchapi/1.0';
export const onceMaxSelectedNumber = 500;
export const getExceedSelectedNumberMsg = function(number) {
	return `<span>最多允许选择${number}条数据</span>`;
};
export const getExceedSelectedAllNumberMsg = function(number) {
	return `当前商品超过${ number }个，不支持全部选中，请修改条件后重新搜索。`;
};
export const errorMsg = '出错提示：后台服务出错，请联系数云客服人员';
export const getNotFoundMsg = function(currentTime, value) {
	return `<span class="not-found-details" ng-click="$ctrl.checkNotFoundDetails(${currentTime})">查看未成功明细</span>
			<div class="details-wrap" ng-show="$ctrl.isShowNotFoundDetails${currentTime}">
				<div class="title">
					<p ng-if="$ctrl.isCopied${currentTime}">
						<i class="icon iconfont icon-right"></i>
						<span>已复制</span>
					</p>
					<p ng-if="!$ctrl.isCopied${currentTime}" ng-click="$ctrl.isCopied${currentTime} = true; $ctrl.copyToBoard(${currentTime})">复制所有${value}</p>
					<p ng-click="$ctrl.isShowNotFoundDetails${currentTime} = false">收起</p>
				</div>
				<ul>
					<li ng-repeat="item in $ctrl.addSectionFailedData${currentTime} track by $index">{{ item }}</li>
				</ul>
				<div class="angle"></div>
			</div>`;
};
export const statusList = [
	{
		'title': '不限',
		'value': '-1'
	},
	{
		'title': '在架',
		'value': '1'
	},
	{
		'title': '下架',
		'value': '0'
	}
];
export const getFieldsMap = function() {
	return {
		shopListFieldsMap: {
			valueField: 'shopId',
			displayField: 'shopName'
		},
		categoriesFieldsMap: {
			valueField: 'id',
			displayField: 'name'
		},
		propsVidFieldsMap: {
			valueField: 'id',
			displayField: 'value'
		},
		statusListFieldsMap: {
			valueField: 'value',
			displayField: 'title'
		},
		brandsListFieldsMap: {
			valueField: 'brandId',
			displayField: 'brandName'
		}
	};
};
export const getFormConfig = function() {
	return {
		// 已选商品 form 表单搜索配置项（前端搜索）
		formConfig: {
			shopId: 'equal',
			id: 'equalArray',
			name: 'fuzzySearch',
			shopCategoriesId: 'fuzzymutipleArray',
			categoriesId: 'equal',
			propsPid: 'equal',
			propsVid: 'fuzzySearch',
			propsVname: 'fuzzySearch',
			status: 'equalStatus',
			outerId: 'fuzzySearch',
			startListTime: 'lessEqual',
			endListTime: 'greaterEqual',
			minPrice: 'lessEqual',
			maxPrice: 'greaterEqual',
			brandId: 'equal'
		},
		// 已选商品 form 表单sku相关搜索配置项（前端搜索）
		skuFormConfig: {
			skusOuterId: 'fuzzySearch',
			skusPropsVname: 'fuzzySearch',
			skusId: 'equalArray'
		}
	};
};


