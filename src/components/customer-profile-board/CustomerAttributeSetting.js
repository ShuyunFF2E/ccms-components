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
			attribute: 'full_name',
			name: '姓名',
			defaultValue: '无',
			unit: '',
			editable: true,
			type: 'text',
			validate: ['/^\\w{1, 50}$/'],
			isInListMode: true
		}, {
			attribute: 'sex',
			name: '性别',
			defaultValue: '',
			unit: '',
			editable: true,
			type: 'radio',
			valueMap: {
				m: '男',
				f: '女',
				'': '未知'
			},
			validate: [],
			isInListMode: true
		}, {
			attribute: 'birthday',
			name: '出生日期',
			defaultValue: '无',
			unit: '',
			editable: true,
			type: 'date',
			validate: [],
			isInListMode: true
		}, {
			attribute: 'age',
			name: '年龄',
			defaultValue: 0,
			unit: '岁',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'mobile',
			name: '常用手机',
			defaultValue: '无',
			unit: '',
			editable: true,
			type: 'text',
			validate: ['/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]){1}\\d{8}$/']
		}, {
			attribute: 'mobile',
			name: '支付手机',
			defaultValue: '无',
			unit: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'mobile',
			name: '最新收货手机',
			defaultValue: '无',
			unit: '',
			editable: false
		}, {
			attribute: 'buyer_email',
			name: 'email邮箱',
			defaultValue: '无',
			unit: '',
			editable: true,
			type: 'text',
			validate: ['/^\\w{1, 50}$/', '/@.+(.com|.cn)$/']
		}, {
			attribute: 'address_zip',
			name: '常用地址',
			defaultValue: '无',
			unit: '',
			editable: true,
			attributes: [{
				attribute: 'receiver_state',
				name: '省份',
				unit: '',
				type: 'select',
				isInListMode: true
			}, {
				attribute: 'receiver_city',
				name: '城市',
				unit: '',
				type: 'select',
				isInListMode: true
			}, {
				attribute: 'receiver_district',
				name: '区县',
				unit: '',
				type: 'select',
				isInListMode: true
			}, {
				attribute: 'receiver_address',
				type: 'text',
				unit: '',
				validate: ['/^\\w{1, 50}$/']
			}, {
				attribute: 'receiver_zip',
				type: 'text',
				unit: '',
				validate: ['/^\\d{1, 6}$/']
			}]
		}]
	}
		/* 自定义属性，暂不提供
		, {
		title: '更多个人信息',
		name: 'personal',
		attributeList: [{
		 attribute: 'job',
		 name: '职业',
		 defaultValue: '自由职业',
		 editable: true,
		 type: 'text',
		 validate: ['/^\\w{1, 50}$/'],
		 isInListMode: true
		 }, {
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
			unit: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: '',
			name: '客户类型',
			defaultValue: '无',
			unit: '',
			editable: false,
			isInListMode: false
		}, {
			attribute: 'vip_info',
			name: '淘宝全站等级',
			defaultValue: '无',
			unit: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'buyer_credit_lev',
			name: '信用等级',
			defaultValue: '无',
			unit: '',
			editable: false
		}, {
			attribute: '',
			name: '买家好评率',
			defaultValue: '无',
			unit: '',
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
			defaultValue: '无',
			unit: '',
			editable: false
		}, {
			attribute: 'trade_first_amount',
			name: '第一次购买金额',
			defaultValue: '0 元',
			unit: ' 元',
			currency: true,
			editable: false
		}, {
			attribute: 'trade_first_interval',
			name: '第一次购买间隔',
			defaultValue: '0 天',
			unit: ' 天',
			editable: false
		}, {
			attribute: 'trade_last_time',
			name: '最后一次购买时间',
			defaultValue: '无',
			unit: '',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'trade_last_amount',
			name: '最后一次购买金额',
			defaultValue: '0.00 元',
			unit: ' 元',
			currency: true,
			editable: false,
			isInListMode: true
		}, {
			attribute: 'trade_last_interval',
			name: '最后一次购买间隔',
			defaultValue: '0 天',
			unit: ' 天',
			editable: false
		}, {
			attribute: 'trade_tidcount',
			name: '累计购买订单数',
			defaultValue: '0 单',
			unit: ' 单',
			editable: false
		}, {
			attribute: 'trade_count',
			name: '累计购买次数',
			defaultValue: '0 次',
			unit: ' 次',
			editable: false
		}, {
			attribute: 'trade_amount',
			name: '累计购买金额',
			defaultValue: '0.00 元',
			unit: ' 元',
			currency: true,
			editable: false,
			isInListMode: true
		}, {
			attribute: 'trade_item_num',
			name: '累计购买件数',
			defaultValue: '0 件',
			unit: ' 件',
			editable: false
		}, {
			attribute: 'trade_avg_amount',
			name: '平均每次购买金额',
			defaultValue: '0.00 元',
			unit: ' 元',
			currency: true,
			editable: false,
			isInListMode: true
		}, {
			attribute: 'trade_avg_item_num',
			name: '平均每次购买件数',
			defaultValue: '0 件',
			unit: ' 件',
			editable: false
		}, {
			attribute: 'trade_avg_buy_interval',
			name: '平均每次购买间隔',
			defaultValue: '0 天',
			unit: ' 天',
			editable: false
		}, {
			attribute: 'trade_refund_count',
			name: '退款次数',
			defaultValue: '0 次',
			unit: ' 次',
			editable: false
		}, {
			attribute: 'trade_refund_amount',
			name: '退款金额',
			defaultValue: '0.00 元',
			unit: ' 元',
			currency: true,
			editable: false
		}, {
			attribute: 'trade_avg_confirm_interval',
			name: '平均发货到确认收货间隔',
			defaultValue: '0 天',
			unit: ' 天',
			editable: false
		}, {
			attribute: 'trade_max_amount',
			name: '最大单笔订单购买金额',
			defaultValue: '0.00 元',
			unit: ' 元',
			currency: true,
			editable: false
		}, {
			attribute: 'trade_order_discount_fee',
			name: '订单级优惠费用',
			defaultValue: '0.00 元',
			unit: ' 元',
			currency: true,
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
			attribute: 'cardGrade',
			name: '会员等级',
			defaultValue: '未开通',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'effectTime',
			name: '等级生效日期',
			defaultValue: '无',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'expireTime',
			name: '等级失效日期',
			defaultValue: '无',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'currentPoint',
			name: '当前积分',
			defaultValue: '0',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'totalGet',
			name: '历史积分',
			defaultValue: '0',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'signCount',
			name: '签到次数',
			defaultValue: '0',
			editable: false,
			isInListMode: true
		}, {
			attribute: 'exchangeCount',
			name: '兑换次数',
			defaultValue: '0',
			editable: false,
			isInListMode: true
		}]
	}, {
		title: '社交绑定',
		name: 'social',
		attributeList: [{
			attribute: 'wechatNick',
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

export const TagsMapping = {
	'male': '男性用户',
	'female': '女性用户',
	'family': '家庭用户',
	// 'sex_unknown': '性别未识别', // don't display negative label
	'school': '学校人员',
	'company_employ': '公司白领',
	'gov_institute': '政府机构人员',
	'hospital': '医护人员',
	'mall': '商场职员',
	'finance_institute': '金融机构职员',
	// 'job_unknown': '职业未识别', // don't display negative label
	'yemaozi': '夜猫子',
	'wanjiangou': '晚间购',
	'shangbangou': '上班时段购',
	'zaochengou': '早晨购',
	// 'time_unknown': '购物时段偏好未识别', // don't display negative label
	'pingshigou': '平时购',
	'zhoumogou': '周末购',
	// 'date_unknown': '购物日期偏好未识别', // don't display negative label
	'sportman': '运动达人',
	'nbnm': '奶爸奶妈',
	'jyet': '家有儿童',
	'houseman': '居家能手',
	'ccc': '3C数码控',
	'bfm': '白富美',
	'foodlover': '美食家',
	// 'life_unknown': '生活方式未识别', // don't display negative label
	'shouji': '手机购',
	// 'non_shouji': '非手机购', // don't display negative label
	'jhs': '聚划算购',
	// 'non_jhs': '非聚划算购', // don't display negative label
	'discount_sense1': '打折敏感度指数1',
	'discount_sense2': '打折敏感度指数2',
	'discount_sense3': '打折敏感度指数3',
	'discount_sense4': '打折敏感度指数4',
	'discount_sense5': '打折敏感度指数5'
};

export const RfmLabel = {
	1: '最近30天',
	2: '最近60天',
	3: '最近90天',
	4: '最近180天',
	5: '最近360天',
	6: '时间不限'
};

export default CustomerAttributeSetting;
