// export const apiPrefix = '/api';
export const apiPrefix = '/tenant/v2';
export const areaUrl = 'http://qa-ual.fenxibao.com/shuyun-searchapi/1.0/area?platform=top';
export const getGridColumnDef = isSupportedChannel => {
	let column = [
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
	if (!isSupportedChannel) {
		column.splice(2, 2);
	}
	return column;
};
export const commonListFieldsMap = {
	valueField: 'id',
	displayField: 'name'
};
export const errorMsg = '后台服务出错，请联系数云客服人员';
