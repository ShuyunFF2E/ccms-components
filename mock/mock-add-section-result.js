var data = {
	'total': 21, // 导入总量
	'foundNum': 17, // 导入成功的数量
	'notFound': ['10121260413', '10123396937', '10121549268'] // 导入失败的数据
};
var data1 = {
	'total': 13, // 导入总量
	'foundNum': 2, // 导入成功的数量
	'notFound': ['BXY33801DU1BT7225', 'BXY33801DU1BT7250', 'BXY33801DU1BT7215', 'BXY33801DU1BT7220', 'BXY33801DU1BT7245',
		'BXY33801DU2BT7240', 'BXY33801DU1BT7250', 'BXY33801DU2BT7245', 'BXY33801DU1BT7215', 'BXY33801DU1BT7230'] // 导入失败的数据
};
var data2 = {
	'total': 42, // 导入总量
	'foundNum': 42, // 导入成功的数量
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
					console.log('*************', body);
					if (body.id.length) {
						result = data;
					} else if (body['outerId'].length) {
						result = data1;
					} else if (body['skus.outerId'].length) {
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
