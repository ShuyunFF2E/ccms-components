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
		field: 'channel',
		displayName: '渠道',
		align: 'center'
	},
	{
		cellTemplate: '<span ng-bind="entity.type ? entity.type : \'---\'"></span>',
		displayName: '店铺类型',
		align: 'center'
	},
	{
		cellTemplate: '<span class="grid-shop-address" ng-bind="entity.address ? entity.address : \'---\'" cc-tooltip="entity.address" tooltip-append-to-body="true"></span>',
		displayName: '店铺详细地址',
		align: 'center'
	}
];

