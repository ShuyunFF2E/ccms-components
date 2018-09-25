var data = {
	'currentPage': 1,
	'pageSize': 20,
	'totalPage': 1,
	'totalCount': 1,
	'data': [
		{
			'brandId': '1111',
			'brandName': '品牌1'
		},
		{
			'brandId': '2222',
			'brandName': '品牌2'
		},
		{
			'brandId': '3333',
			'brandName': '品牌3'
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
