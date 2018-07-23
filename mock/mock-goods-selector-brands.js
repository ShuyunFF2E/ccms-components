var data = {
	'currentPage': 1,
	'pageSize': 20,
	'totalPage': 1,
	'totalCount': 1,
	'data': [
		{
			'brand_id': '1111',
			'brand_name': '品牌1'
		},
		{
			'brand_id': '2222',
			'brand_name': '品牌2'
		},
		{
			'brand_id': '3333',
			'brand_name': '品牌3'
		}
	]
};
module.exports = function(configurations) {

	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/brands'
			},
			response: {
				status: 200,
				body: function() {
					return data;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	]);
};
