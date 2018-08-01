export const commonGridColumnDef = [
	{
		field: 'id',
		displayName: '店铺ID',
		align: 'left'
	},
	{
		cellTemplate: '<span style="color:#145681" ng-bind="entity.id" cc-tooltip="entity.name" tooltip-append-to-body="true"></span>',
		displayName: '店铺名称',
		align: 'left'
	},
	{
		field: 'id',
		displayName: '渠道',
		align: 'left'
	},
	{
		field: 'id',
		displayName: '店铺类型',
		align: 'left'
	},
	{
		field: 'id',
		displayName: '店铺详细地址',
		align: 'left'
	}
];

