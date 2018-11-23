var gridData = {
	"id": 1,
	"pageNum": 1,
	"pageSize": 20,
	"totals": 40,
	"list": [
		{
			"name": "旗木卡卡西",
			"age": 25,
			"gender": "男"
		},
		{
			"name": "野原新之助",
			"age": 5,
			"gender": "男"
		},
		{
			"name": "藤原拓海",
			"age": 20,
			"gender": "男"
		},
		{
			"name": "朽木露基亚",
			"age": 18,
			"gender": "女"
		},
		{
			"name": "毛利兰",
			"age": 18,
			"gender": "女"
		},
		{
			"name": "江户川乱步",
			"age": "不详",
			"gender": "男"
		}
	]
};

module.exports = function(configurations) {

	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/pages/1'
			},
			response: {
				status: 200,
				body: function() {
					return gridData;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	]);
}
