/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-25 11:50
 */

const customer = {
	title: '客户信息',
	name: 'customer',
	icon: '&#xe65b;',
	attributeBlock: [{
		title: '基本信息',
		name: 'base',
		attributeList: [{
			attribute: 'receiver_name',
			name: '姓名',
			defaultValue: '无',
			editable: true,
			type: 'text',
			validate: ['/^\\w{1, 50}$/'],
			isInListMode: true
		}, {
			attribute: 'sex',
			name: '性别',
			defaultValue: '',
			editable: true,
			type: 'radio',
			enum: [{
				name: '男',
				value: 'm'
			}, {
				name: '女',
				value: 'f'
			}, {
				name: '未知',
				value: ''
			}],
			validate: [],
			isInListMode: true
		}, {
			attribute: 'birthday',
			name: '出生日期',
			defaultValue: '无',
			editable: true,
			type: 'date',
			validate: [],
			isInListMode: true
		}, {
			attribute: 'age',
			name: '年龄',
			defaultValue: 0,
			editable: false,
			isInListMode: true
		}, {
			attribute: 'job',
			name: '职业',
			defaultValue: '自由职业',
			editable: true,
			type: 'text',
			validate: ['/^\\w{1, 50}$/'],
			isInListMode: true
		}, {
			attribute: 'receiver_mobile',
			name: '常用手机',
			defaultValue: '无',
			editable: true,
			type: 'text',
			validate: ['/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]){1}\\d{8}$/']
		}, {
			attribute: 'receiver_mobile',
			name: '支付手机',
			defaultValue: '无',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'receiver_mobile',
			name: '最新收货手机',
			defaultValue: '无',
			editable: false
		}, {
			attribute: 'buyer_email',
			name: 'email邮箱',
			defaultValue: '无',
			editable: true,
			type: 'text',
			validate: ['/^\\w{1, 50}$/', '/@.+(.com|.cn)$/']
		}, {
			name: '常用地址',
			attributes: [{
				attribute: 'receiver_state',
				name: '省份',
				type: 'select',
				enum: [{
					name: '上海市',
					value: 'shanghai'
				}, {
					name: '浙江省',
					value: 'zhejiang'
				}, {
					name: '北京市',
					value: 'beijing'
				}],
				isInListMode: true
			}, {
				attribute: 'receiver_city',
				name: '城市',
				type: 'select',
				enum: [{
					name: '上海市',
					value: 'shanghai'
				}, {
					name: '绍兴市',
					value: 'shaoxin'
				}, {
					name: '北京市',
					value: 'beijing'
				}],
				isInListMode: true
			}, {
				attribute: 'receiver_district',
				name: '市县',
				type: 'select',
				enum: [{
					name: '黄浦区',
					value: 'huangpu'
				}, {
					name: '青浦区',
					value: 'qingpu'
				}, {
					name: '杨浦区',
					value: 'yangpu'
				}],
				isInListMode: true
			}, {
				attribute: 'receiver_address',
				type: 'text',
				validate: ['/^\\w{1, 50}$/']
			}, {
				attribute: 'receiver_zip',
				type: 'text',
				validate: ['/^\\d{1, 6}$/']
			}],
			defaultValue: '无',
			editable: true
		}]
	}
		/* 自定义属性，暂不提供
		, {
		title: '更多个人信息',
		name: 'personal',
		attributeList: [{
			attribute: '',
			name: '身高/cm',
			defaultValue: '无',
			editable: true,
			type: 'text',
			validate: ['/^\\d{1, 5}$/'],
			isInListMode: true
		}, {
			attribute: '',
			name: '体重/kg',
			defaultValue: '无',
			editable: true,
			type: 'text',
			validate: ['/^\\d{1, 5}$/'],
			isInListMode: true
		}, {
			attribute: '',
			name: '星座',
			defaultValue: '无',
			editable: false,
			isInListMode: true
		}, {
			attribute: '',
			name: '血型',
			defaultValue: '',
			editable: true,
			type: 'radio',
			enum: [{
				name: 'A',
				value: 'a'
			}, {
				name: 'B',
				value: 'b'
			}, {
				name: 'AB',
				value: 'ab'
			}, {
				name: 'O',
				value: 'o'
			}, {
				name: '未知',
				value: ''
			}],
			isInListMode: true
		}]
	}*/
	]
};

const consumer = {
	title: '消费信息',
	name: 'consumer',
	icon: '&#xe65e;',
	attributeBlock: [{
		title: '基本消费指标',
		name: 'base',
		attributeList: [{
			attribute: '',
			name: '客户来源',
			defaultValue: '淘宝',
			editable: false,
			isInListMode: true
		}, {
			attribute: '',
			name: '客户类型',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'vip_info',
			name: '淘宝全站等级',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'buyer_credit_lev',
			name: '信用等级',
			defaultValue: '',
			editable: false
		}, {
			attribute: '',
			name: '买家好评率',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}]
	}, {
		title: 'RFM指标',
		name: 'rfm',
		type: 'List',
		attributeList: [{
			attribute: 'trade_first_time',
			name: '第一次购买时间',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_first_amount',
			name: '第一次购买金额/元',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_first_interval',
			name: '第一次购买间隔/天',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_last_time',
			name: '最后一次购买时间',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'trade_last_amount',
			name: '最后一次购买金额/元',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'trade_last_interval',
			name: '最后一次购买间隔/天',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_tidcount',
			name: '累计购买订单数/单',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_count',
			name: '累计购买次数/次',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_amount',
			name: '累计购买金额/元',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'trade_item_num',
			name: '累计购买件数/件',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_avg_amount',
			name: '平均每次购买金额/元',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'trade_avg_item_num',
			name: '平均每次购买件数/件',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_avg_buy_interval',
			name: '平均每次购买间隔/天',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_refund_count',
			name: '退款次数/次',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_refund_amount',
			name: '退款金额/元',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_avg_confirm_interval',
			name: '平均发货到确认收货间隔',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_max_amount',
			name: '最大单笔订单购买金额',
			defaultValue: '',
			editable: false
		}, {
			attribute: 'trade_order_discount_fee',
			name: '订单级优惠费用',
			defaultValue: '',
			editable: false
		}]
	}]
};

const other = {
	title: '会员信息',
	name: 'other',
	icon: '&#xe65c;',
	attributeBlock: [{
		title: '会员互动',
		name: 'member',
		attributeList: [{
			attribute: 'vip_info',
			name: '会员等级',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: '',
			name: '会员等级有效日期',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: '',
			name: '会员等级失效日期',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: '',
			name: '当前积分',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: '',
			name: '历史积分',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: '',
			name: '签到次数',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: '',
			name: '兑换次数',
			defaultValue: '',
			editable: false,
			isInListMode: true
		}]
	}, {
		title: '社交绑定',
		name: 'social',
		attributeList: [{
			attribute: 'nickName',
			name: '微信昵称',
			defaultValue: '未开通',
			editable: false,
			isInListMode: false
		}, {
			attribute: 'sinawbUserId',
			name: '微博账号',
			defaultValue: '未开通',
			editable: false,
			isInListMode: false
		}]
	}]
};

const CustomerAttributeSetting = [
	customer,
	consumer,
	other
];

export default CustomerAttributeSetting;
