module.exports = function(configurations) {

	var shopsData = [
		{
			"name": "天猫店铺",
			"value": "tb",
			"active": true,
			"child": [
				{
					"name": "小猫时尚旗舰店",
					"active": true,
					"value": "tb-cut",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "小狗时尚旗舰店",
					"value": "tb-dog",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "小狗时尚旗舰店",
					"value": "tb-dog1",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "小狗时尚旗舰店",
					"value": "tb-dog2",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "小狗时尚旗舰店",
					"value": "tb-dog3",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "小狗时尚旗舰店",
					"value": "tb-dog4",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "小狗时尚旗舰店",
					"value": "tb-dog5",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "小仔时尚旗舰店",
					"value": "tb-cub",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "洋陽轩旗舰店",
					"value": "tb-yy",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				}
			]
		},
		{
			"name": "京东店铺",
			"value": "jd",
			"child": [
				{
					"name": "小猫时尚旗舰店",
					"value": "jd-cut",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "小狗时尚旗舰店",
					"value": "jd-dog",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "小仔时尚旗舰店",
					"value": "jd-cub",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				},
				{
					"name": "洋陽轩旗舰店",
					"value": "jd-yy",
					"logo": "http://himg.bdimg.com/sys/portrait/item/e999e992b1c2b7e58588e7949f7b16.jpg"
				}
			]
		}
	];

	var menuData = [
		{
			"name": "忠诚度设置",
			"state": "card",
			"icon": "",
			"children": [
				{
					"name": "积分类型",
					"state": "card.point",
					"icon": "",
					"children": []
				},
				{
					"name": "等级类型",
					"state": "card.grade",
					"icon": "",
					"children": []
				}
			]
		},
		{
			"name": "TAE会员专区",
			"state": "views",
			"icon": "",
			"children": [
				{
					"name": "界面设置",
					"state": "views.set",
					"icon": "",
					"children": [
						{
							"name": "手淘",
							"state": "views.set.st",
							"icon": "",
							"children": []
						}
					]
				},
				{
					"name": "赚积分",
					"state": "views.point",
					"icon": "",
					"children": [
						{
							"name": "签到",
							"state": "views.point.sign",
							"icon": "",
							"children": [
								{
									"name": "再签到",
									"state": "views.point.sign.reload",
									"icon": "",
									"children": []
								}
							]
						}
					]
				}
			]
		},
		{
			"name": "会员等级管理",
			"state": "grade",
			"icon": "",
			"children": []
		}
	];

	configurations.add([
		{
			request: {
				method: 'GET',
				urlPattern: '/menus'
			},
			response: {
				status: 200,
				body: function() {
					return menuData;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		},
		{
			request: {
				method: 'GET',
				urlPattern: '/shops'
			},
			response: {
				status: 200,
				body: function() {
					return shopsData;
				},
				headers: {
					'Content-Type': 'application/json'
				}
			}
		}
	]);
}
