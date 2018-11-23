var categories = {
	'data': [
		{
			'id': '111111',
			'name': '标准类目1',
			'order': '排序',
			'status': '状态',
			'created': '创建时间',
			'modified': '更改时间',
			'lastSync': '同步时间',
			'shopId': '店铺',
			'pid': '上级类目',
			'level': '级别',
			'isLeaf': true
		},
		{
			'id': '222222',
			'name': '标准类目1',
			'order': '排序',
			'status': '状态',
			'created': '创建时间',
			'modified': '更改时间',
			'lastSync': '同步时间',
			'shopId': '店铺',
			'pid': '上级类目',
			'level': '级别',
			'isLeaf': true
		}
	]
};

module.exports = function(configurations) {

	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/categories'
			},
			response: {
				status: 200,
				body: function() {
					return categories;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	]);
}

