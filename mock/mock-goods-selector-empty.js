var gridEmptyData = {
	'id': 1,
	'pageNum': 1,
	'currentPage': 1,
	'totalCount': 10,
	'pageSize': 20,
	'list': []
};

module.exports = function(configurations) {

	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/emptyData/1'
			},
			response: {
				status: 200,
				body: function() {
					return gridEmptyData;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	]);
}

