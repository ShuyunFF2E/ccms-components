// export const apiPrefix = '/api';
export const apiPrefix = '/shuyun-searchapi/1.0';
export const onceMaxSelectedNumber = 500;

export const getExceedSelectedNumberMsg = number => {
	return `<span>最多允许选择${number}条数据</span>`;
};

export const exceedSelectedAllNumberMsg = '您选择的商品过多，不支持全部选中，请修改条件后重新搜索。';

export const errorMsg = '出错提示：后台服务出错，请联系数云客服人员';

export const getNotFoundMsg = (currentTime, value) => {
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

export const getFieldsMap = () => {
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

export const getFormConfig = () => {
	return {
		// 已选商品 form 表单搜索配置项（前端搜索）
		formConfig: {
			shopId: 'equalStr',
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

export const getBatchImportMsg = (currentTime, key, successNumber, failedNumber, repeatNumber) => {
	if (failedNumber) {
		if (repeatNumber > 0) {
			return `<span class="check-details" id="batch-${currentTime}">成功导入${key}${successNumber}个，失败${failedNumber}个，重复${repeatNumber}个</span>`;
		} else {
			return `<span class="check-details" id="batch-${currentTime}">成功导入${key}${successNumber}个，失败${failedNumber}个</span>`;
		}
	} else {
		if (repeatNumber > 0) {
			return `成功导入${key}${successNumber}个，重复${repeatNumber}个`;
		} else {
			return `成功导入${key}${successNumber}个`;
		}
	}
};

// 不同平台 form 表单项配置
export const fieldsetConfig = {
	jos: [
		{
			name: 'platform',
			title: '平台',
			isTotalChannelItem: true
		},
		{
			name: 'skusId',
			title: '商品编号',
			isSkuItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'categoriesId',
			title: '标准类目',
			isSimpleSearchItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'endListTime',
			title: '上架时间',
			isTotalChannelItem: true
		},
		{
			name: 'id',
			title: '商品ID',
			isSimpleSearchItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'maxPrice',
			title: '价格',
			isTotalChannelItem: true
		},
		{
			name: 'minPrice',
			title: '价格',
			isTotalChannelItem: true
		},
		{
			name: 'name',
			title: '商品标题',
			isSimpleSearchItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'outerId',
			title: '商品商家编码',
			isTotalChannelItem: true
		},
		{
			name: 'propsPid',
			title: '商品属性',
			isTotalChannelItem: false
		},
		{
			name: 'propsVid',
			title: '属性值',
			isTotalChannelItem: false
		},
		{
			name: 'propsVname',
			title: '商品属性值名称',
			isTotalChannelItem: false
		},
		{
			name: 'shopId',
			title: '店铺选择',
			isTotalChannelItem: true
		},
		{
			name: 'skusOuterId',
			title: 'SKU商家编码',
			isSkuItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'skusPropsVname',
			title: 'SKU规格',
			isSkuItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'startListTime',
			title: '上架时间',
			isTotalChannelItem: true
		},
		{
			name: 'status',
			title: '商品状态',
			isTotalChannelItem: true
		}
	],
	top: [
		{
			name: 'platform',
			title: '平台',
			isTotalChannelItem: true
		},
		{
			name: 'shopCategoriesId',
			title: '自定义类目',
			isTotalChannelItem: false
		},
		{
			name: 'tagItemIds',
			title: '商品标签',
			isTotalChannelItem: false
		},
		{
			name: 'categoriesId',
			title: '标准类目',
			isSimpleSearchItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'endListTime',
			title: '上架时间',
			isTotalChannelItem: true
		},
		{
			name: 'id',
			title: '商品ID',
			isSimpleSearchItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'maxPrice',
			title: '价格',
			isTotalChannelItem: true
		},
		{
			name: 'minPrice',
			title: '价格',
			isTotalChannelItem: true
		},
		{
			name: 'name',
			title: '商品标题',
			isSimpleSearchItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'outerId',
			title: '商品商家编码',
			isTotalChannelItem: true
		},
		{
			name: 'propsPid',
			title: '商品属性',
			isTotalChannelItem: false
		},
		{
			name: 'propsVid',
			title: '属性值',
			isTotalChannelItem: false
		},
		{
			name: 'propsVname',
			title: '商品属性值名称',
			isTotalChannelItem: false
		},
		{
			name: 'shopId',
			title: '店铺选择',
			isTotalChannelItem: true
		},
		{
			name: 'skusOuterId',
			title: 'SKU商家编码',
			isSkuItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'skusPropsVname',
			title: 'SKU规格',
			isSkuItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'startListTime',
			title: '上架时间',
			isTotalChannelItem: true
		},
		{
			name: 'status',
			title: '商品状态',
			isTotalChannelItem: true
		}
	],
	offline: [
		{
			name: 'platform',
			title: '平台',
			isTotalChannelItem: true
		},
		{
			name: 'skusId',
			title: 'SKU ID',
			isSkuItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'brandId',
			title: '品牌',
			isTotalChannelItem: false
		},
		{
			name: 'categoriesId',
			title: '商品类目',
			isSimpleSearchItem: false
		},
		{
			name: 'endListTime',
			title: '上架时间',
			isTotalChannelItem: true
		},
		{
			name: 'id',
			title: '商品ID',
			isSimpleSearchItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'maxPrice',
			title: '价格',
			isTotalChannelItem: true
		},
		{
			name: 'minPrice',
			title: '价格',
			isTotalChannelItem: true
		},
		{
			name: 'name',
			title: '商品标题',
			isSimpleSearchItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'shopId',
			title: '店铺选择',
			isTotalChannelItem: true
		},
		{
			name: 'skusPropsVname',
			title: 'SKU规格',
			isSkuItem: true,
			isTotalChannelItem: true
		},
		{
			name: 'startListTime',
			title: '上架时间',
			isTotalChannelItem: true
		},
		{
			name: 'status',
			title: '商品状态',
			isTotalChannelItem: true
		}
	]
};

