var goodsLabel = {
	'id': 1,
	'pageNum': 1,
	'currentPage': 1,
	'totalCount': 10,
	'pageSize': 20,
	'list': [
		{
			'id': 1,
			'label': '标签1',
			'children': [
				{
					'id': 12,
					'label': '标签11'
				},
				{
					'id': 13,
					'label': '标签12'
				}
			]
		},
		{
			'id': 2,
			'label': '标签2',
			'children': [
				{
					'id': 21,
					'label': '标签21'
				},
				{
					'id': 22,
					'label': '标签22'
				},
				{
					'id': 23,
					'label': '标签23'
				}
			]
		}
	]
};

module.exports = function(configurations) {

	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/goodsLabel/1'
			},
			response: {
				status: 200,
				body: function() {
					return goodsLabel;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	]);
}

