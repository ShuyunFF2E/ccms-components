var data = {
	'total': 22, // 总共导入的数量
	'notFound': ['10121260413', '10123396937', '10121549268'] // 导入失败的数据
};
var data1 = {
	'total': 13, // 总共导入的数量
	'notFound': ['BXY33801DU1BT7225', 'BXY33801DU1BT7250', 'BXY33801DU1BT7215', 'BXY33801DU1BT7220', 'BXY33801DU1BT7245',
		'BXY33801DU2BT7240', 'BXY33801DU1BT7250', 'BXY33801DU2BT7245', 'BXY33801DU1BT7215', 'BXY33801DU1BT7230'] // 导入失败的数据
};
var data2 = {
	'total': 42, // 总共导入的数量
	'notFound': [] // 导入失败的数据
};
module.exports = function(configurations) {

	configurations.add([
		{
			request: {
				method: 'POST',
				urlPattern: '/items/batchImport/result'
			},
			response: {
				status: 200,
				body: function(req) {
					let result = [];
					let body = req.body;
					if (body.id) {
						result = data;
					} else if (body['outerId']) {
						result = data1;
					} else if (body['skus.outerId']) {
						result = data2;
					}
					return result;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	]);
}
