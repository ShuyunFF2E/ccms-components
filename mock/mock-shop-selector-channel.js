var data = [
	{
		'id': 'offline',
		'name': '恰克',
		'shopTypes': [
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
		'shopTypes': [],
		'districtSelector': false
	},
	{
		'id': 'jos',
		'name': '京东',
		'shopTypes': [],
		'districtSelector': false
	},
	{
		'id': 'weixin',
		'name': '微信',
		'shopTypes': [],
		'districtSelector': false
	},
	{
		'id': 'yhd',
		'name': '一号店',
		'shopTypes': [],
		'districtSelector': false
	},
	{
		'id': 'suning',
		'name': '苏宁',
		'shopTypes': [],
		'districtSelector': false
	},
	{
		'id': 'weixin',
		'name': '微信',
		'shopTypes': [],
		'districtSelector': false
	},
	{
		'id': 'paipai',
		'name': '拍拍',
		'shopTypes': [],
		'districtSelector': false
	},
	{
		'id': 'dangdang',
		'name': '当当',
		'shopTypes': [],
		'districtSelector': false
	},
	{
		'id': 'belle',
		'name': '百丽',
		'shopTypes': [],
		'districtSelector': false
	},
	{
		'id': 'youzan',
		'name': '友赞',
		'shopTypes': [],
		'districtSelector': false
	},
	{
		'id': 'mogujie',
		'name': '蘑菇街',
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
