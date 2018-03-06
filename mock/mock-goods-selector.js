var goodsData = {
	'id': 1,
	'pageNum': 1,
	'currentPage': 1,
	'totalCount': 10,
	'pageSize': 20,
	'list': [
		{
			'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB1rLzYbA9WBuNjSspeXXaz5VXa_!!0-item_pic.jpg_430x430q90.jpg',
			'goodsName': '商品名称商品名称商品名称商品名称',
			'goodsId': '12345678910124',
			'storeCount': 344,
			'price': 1569,
			'code': 'A1-2334-543',
			'childrenList': []
		},
		{
			'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB1rLzYbA9WBuNjSspeXXaz5VXa_!!0-item_pic.jpg_430x430q90.jpg',
			'goodsName': '商品名称商品名称商品名称商品名称',
			'goodsId': '12345678910126',
			'storeCount': 344,
			'price': 1569,
			'code': 'A1-2334-543',
			'childrenList': []
		},
		{
			'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB1rLzYbA9WBuNjSspeXXaz5VXa_!!0-item_pic.jpg_430x430q90.jpg',
			'goodsName': '商品名称商品名称商品名称商品名称',
			'goodsId': '12345678910121',
			'storeCount': 344,
			'price': 1569,
			'code': 'A1-2334-543',
			'childrenList': [
				{
					'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB2CYAflmfD8KJjSszhXXbIJFXa_!!414285109.jpg_430x430q90.jpg',
					'goodsIntro': '颜色：黄色；尺码：46；',
					'goodsId': '12345678910122',
					'storeCount': 344,
					'price': 1569,
					'code': 'A1-2334-543'
				},
				{
					'imgUrl': 'https://img.alicdn.com/bao/uploaded/i4/414285109/TB2UGDHllDH8KJjSspnXXbNAVXa_!!414285109.jpg_430x430q90.jpg',
					'goodsIntro': '颜色：黄色；尺码：46；',
					'goodsId': '12345678910123',
					'storeCount': 344,
					'price': 1569,
					'code': 'A1-2334-543'
				}
			]
		},
		{
			'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB1rLzYbA9WBuNjSspeXXaz5VXa_!!0-item_pic.jpg_430x430q90.jpg',
			'goodsName': '商品名称商品名称商品名称商品名称',
			'goodsId': '12345678910128',
			'storeCount': 344,
			'price': 1569,
			'code': 'A1-2334-543',
			'childrenList': []
		},
		{
			'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB1rLzYbA9WBuNjSspeXXaz5VXa_!!0-item_pic.jpg_430x430q90.jpg',
			'goodsName': '商品名称商品名称商品名称商品名称',
			'goodsId': '123456789101211',
			'storeCount': 344,
			'price': 1569,
			'code': 'A1-2334-543',
			'childrenList': []
		},
		{
			'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB1rLzYbA9WBuNjSspeXXaz5VXa_!!0-item_pic.jpg_430x430q90.jpg',
			'goodsName': '商品名称商品名称商品名称商品名称',
			'goodsId': '123456789101214',
			'storeCount': 344,
			'price': 1569,
			'code': 'A1-2334-543',
			'childrenList': []
		},
		{
			'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB1rLzYbA9WBuNjSspeXXaz5VXa_!!0-item_pic.jpg_430x430q90.jpg',
			'goodsName': '商品名称商品名称商品名称商品名称',
			'goodsId': '123456789101217',
			'storeCount': 344,
			'price': 1569,
			'code': 'A1-2334-543',
			'childrenList': []
		},
		{
			'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB1rLzYbA9WBuNjSspeXXaz5VXa_!!0-item_pic.jpg_430x430q90.jpg',
			'goodsName': '商品名称商品名称商品名称商品名称',
			'goodsId': '123456789101220',
			'storeCount': 344,
			'price': 1569,
			'code': 'A1-2334-543',
			'childrenList': []
		},
		{
			'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB1rLzYbA9WBuNjSspeXXaz5VXa_!!0-item_pic.jpg_430x430q90.jpg',
			'goodsName': '商品名称商品名称商品名称商品名称',
			'goodsId': '123456789101223',
			'storeCount': 344,
			'price': 1569,
			'code': 'A1-2334-543',
			'childrenList': []
		},
		{
			'imgUrl': 'https://img.alicdn.com/bao/uploaded/i3/414285109/TB1rLzYbA9WBuNjSspeXXaz5VXa_!!0-item_pic.jpg_430x430q90.jpg',
			'goodsName': '商品名称商品名称商品名称商品名称',
			'goodsId': '123456789101226',
			'storeCount': 344,
			'price': 1569,
			'code': 'A1-2334-543',
			'childrenList': []
		}
	]
};

module.exports = function(configurations) {

	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/goodsData/1'
			},
			response: {
				status: 200,
				body: function() {
					return goodsData;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	]);
}
