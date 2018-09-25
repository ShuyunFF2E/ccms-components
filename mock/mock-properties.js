var categories = [
	{	'categoryId': '111111',
		'data': [
			{
				'id': '1',
				'name': '商品属性1',
				'order': '排序',
				'status': '状态',
				'created': '创建时间',
				'modified': '更改时间',
				'lastSync': '同步时间',
				'type': '类型',
				'categoryId': '111111',
				'ppid': '上级属性',
				'ppvid': '上级属性值',
				'values': [
					{
						'id': '11',
						'value': '属性值11',
						'order': '排序',
						'status': '状态',
						'created': '创建时间',
						'modified': '更改时间',
						'lastSync': '同步时间',
						'alias': '别名'
					},
					{
						'id': '12',
						'value': '属性值12',
						'order': '排序',
						'status': '状态',
						'created': '创建时间',
						'modified': '更改时间',
						'lastSync': '同步时间',
						'alias': '别名'
					}
				]
			},
			{
				'id': '2',
				'name': '名称',
				'order': '排序',
				'status': '状态',
				'created': '创建时间',
				'modified': '更改时间',
				'lastSync': '同步时间',
				'type': '类型',
				'categoryId': '111111',
				'ppid': '上级属性',
				'ppvid': '上级属性值',
				'values': [
					{
						'id': '21',
						'value': '属性值21',
						'order': '排序',
						'status': '状态',
						'created': '创建时间',
						'modified': '更改时间',
						'lastSync': '同步时间',
						'alias': '别名'
					},
					{
						'id': '22',
						'value': '属性值22',
						'order': '排序',
						'status': '状态',
						'created': '创建时间',
						'modified': '更改时间',
						'lastSync': '同步时间',
						'alias': '别名'
					}
				]
			}
		]
	},
	{
		'categoryId': '222222',
		'data': [
			{
				'id': '1',
				'name': '商品属性3',
				'order': '排序',
				'status': '状态',
				'created': '创建时间',
				'modified': '更改时间',
				'lastSync': '同步时间',
				'type': '类型',
				'categoryId': '222222',
				'ppid': '上级属性',
				'ppvid': '上级属性值',
				'values': [
					{
						'id': '31',
						'value': '属性值11',
						'order': '排序',
						'status': '状态',
						'created': '创建时间',
						'modified': '更改时间',
						'lastSync': '同步时间',
						'alias': '别名'
					},
					{
						'id': '32',
						'value': '属性值12',
						'order': '排序',
						'status': '状态',
						'created': '创建时间',
						'modified': '更改时间',
						'lastSync': '同步时间',
						'alias': '别名'
					}
				]
			},
			{
				'id': '4',
				'name': '名称',
				'order': '排序',
				'status': '状态',
				'created': '创建时间',
				'modified': '更改时间',
				'lastSync': '同步时间',
				'type': '类型',
				'categoryId': '222222',
				'ppid': '上级属性',
				'ppvid': '上级属性值',
				'values': [
					{
						'id': '41',
						'value': '属性值21',
						'order': '排序',
						'status': '状态',
						'created': '创建时间',
						'modified': '更改时间',
						'lastSync': '同步时间',
						'alias': '别名'
					},
					{
						'id': '42',
						'value': '属性值22',
						'order': '排序',
						'status': '状态',
						'created': '创建时间',
						'modified': '更改时间',
						'lastSync': '同步时间',
						'alias': '别名'
					}
				]
			}
		]
	}
];

module.exports = function(configurations) {

	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/categories/:id/properties'
			},
			response: {
				status: 200,
				body: function(req) {
					let categoryId = req.originalUrl.split('/')[3].toString();
					let result = null;
					categories.forEach((item, index) => {
						if (categoryId === item.categoryId) {
							result = categories[index];
						}
					});
					return result;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	]);
};


