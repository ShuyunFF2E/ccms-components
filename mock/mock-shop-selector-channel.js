var data = [
	{
		'id': 'qiakr',
		'name': '恰克',
		'shopType': [
			{
				'id': '0',
				'name': '直营'
			},
			{
				'id': '1',
				'name': '商超'
			},
			{
				'id': '2',
				'name': '旗舰'
			},
			{
				'id': '3',
				'name': '加盟'
			}
		],
		'districtSelector': true
	},
	{
		'id': 'taobao',
		'name': '淘宝',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'jos',
		'name': '京东',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'weixin',
		'name': '微信',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'yhd',
		'name': '一号店',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'suning',
		'name': '苏宁',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'weixin',
		'name': '微信',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'paipai',
		'name': '拍拍',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'dangdang',
		'name': '当当',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'belle',
		'name': '百丽',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'youzan',
		'name': '友赞',
		'shopType': [],
		'districtSelector': false
	},
	{
		'id': 'mogujie',
		'name': '蘑菇街',
		'shopType': [],
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
