var data = [
	{
		'id': 'qiakr',
		'name': '恰克',
		'shopTypes': [
			{
				'id': 'directSale',
				'name': '直营'
			},
			{
				'id': 'superMarket',
				'name': '商超'
			},
			{
				'id': 'flagShip',
				'name': '旗舰'
			},
			{
				'id': 'joinIn',
				'name': '加盟'
			}
		],
		'districtSelector': true
	},
	{
		'id': 'taobao',
		'name': '淘宝',
		'shopTypes': [],
		'districtSelector': false
	}
];
module.exports = function(configurations) {

	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/channel'
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
