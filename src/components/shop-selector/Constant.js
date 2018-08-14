export const apiPrefix = '/api';
export const commonGridColumnDef = [
	{
		field: 'id',
		displayName: '店铺ID',
		align: 'center'
	},
	{
		cellTemplate: '<span class="grid-shop-name" ng-bind="entity.name" cc-tooltip="entity.name" tooltip-append-to-body="true"></span>',
		displayName: '店铺名称',
		align: 'center'
	},
	{
		field: 'channelName',
		displayName: '渠道',
		align: 'center'
	},
	{
		cellTemplate: '<span ng-bind="entity.typeName ? entity.typeName : \'---\'"></span>',
		displayName: '店铺类型',
		align: 'center'
	},
	{
		cellTemplate: '<span class="grid-shop-address" ng-bind="entity.address ? entity.address : \'---\'" cc-tooltip="entity.address" tooltip-append-to-body="true"></span>',
		displayName: '店铺详细地址',
		align: 'center'
	}
];
export const commonListFieldsMap = {
	valueField: 'id',
	displayField: 'name'
};
export const errorMsg = '后台服务出错，请联系数云客服人员';
export const channelList = [
	{
		'id': 'qiakr',
		'name': '恰克',
		'shopType': [
			{
				'id': '0',
				'name': '直营'
			},
			{
				'id': '1',
				'name': '商超'
			},
			{
				'id': '2',
				'name': '旗舰'
			},
			{
				'id': '3',
				'name': '加盟'
			}
		],
		'districtSelector': true
	},
	{
		'id': 'taobao',
		'name': '淘宝',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'jos',
		'name': '京东',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'weixin',
		'name': '微信',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'yhd',
		'name': '一号店',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'suning',
		'name': '苏宁',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'weixin',
		'name': '微信',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'paipai',
		'name': '拍拍',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'dangdang',
		'name': '当当',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'belle',
		'name': '百丽',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'youzan',
		'name': '友赞',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'mogujie',
		'name': '蘑菇街',
		'shopType': [],
		'districtSelector': false
	}
];
