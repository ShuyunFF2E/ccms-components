/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */

angular.module('componentsApp', ['ccms.components'])

	.controller('ctrl', function ($timeout) {

		var self = this;

		/*
			0: 短信 + 【自定义签名】
			1: 短信 + 备案签名 + 【自定义签名】
			2: 【自定义签名】 + 短信
			3: 【自定义签名】 + 短信 + 备案签名
		*/
		self.channelInfo = [
			{
				name: 'GatewayType 0',
				gatewayType: 0,
				keywordPrefix: '?', // default $$
				keywordSuffix: '】', // default $$
				keywords: [
					// {
					// 	name: 'XBL',
					// 	text: '小变量',
					// 	defaultValue: '小变量'
					// },
					// {
					// 	name: 'DBL',
					// 	text: '大变量',
					// 	defaultValue: '大变量'
					// },
					{
						type: 'taobao',
						name: 'QZ',
						text: '前缀测试',
						prefix: '前缀-',
						defaultValue: '前缀测试'
					},
					{
						type: 'taobao',
						name: 'HZ',
						text: '后缀测试',
						suffix: '-后缀',
						defaultValue: '后缀测试'
					},
					{
						type: 'taobao',
						name: 'XMTB',
						text: '姓名淘宝',
						prefix: 'HH',
						suffix: 'HH',
						defaultValue: '西凉少女Ash'
					},
					{
						type: 'taobao',
						name: 'XMJDWMRZ',
						text: '姓名京东无默认值',
						disabled: true
					},
					{
						type: 'taobao',
						name: 'shortlink',
						text: '淘短链AAAAAAAAAA111111111',
						prefix: '&nbsp;',
						suffix: '&nbsp;',
						defaultValue: 'c.tb.cn/c.0zYeW#'
					},
					{
						type: 'taobao',
						name: 'DDBH',
						text: '订单编号',
						defaultValue: '6666666666',
						disabled: true
					},
					{
						type: 'taobao',
						name: 'LXDH',
						text: '联系电话',
						defaultValue: '180-0000-0000'
					},
					{
						type: 'taobao',
						name: 'YBD_1',
						text: '用不到 1',
						defaultValue: '用不到 1'
					},
					{
						type: 'taobao',
						name: 'YBD_2',
						text: '用不到 2',
						defaultValue: '用不到 2'
					},
					{
						type: 'taobao',
						name: 'YBD_2',
						text: '用不到 2',
						defaultValue: '用不到 2'
					},
					{
						type: 'taobao',
						name: 'YBD_2',
						text: '用不到 2',
						defaultValue: '用不到 2'
					},
					{
						type: 'taobao',
						name: 'YBD_2',
						text: '用不到 2',
						defaultValue: '用不到 2'
					}
				],
				unsubscribeText: '退订回复TD',
				//useUnsubscribe: true,
				/*
				 * 配置淘短链tips
				 */
				shortLinkTip: '系统判断该短链为手动添加，为保证短链顺利打开请末尾加#号，前后分别加一个空格，例： c.tb.cn/c.2cmrV# 共18字。',
				// content: '亲爱t.cn的?_[taobao]XMTB_】 / $$_[taobao]XMJDWMRZ_$$, 您的订单$$_[taobao]DDBH_$$t.cn$$_[taobao]DDBH_$$正在派送.  c.tb.cn($$ $ $$) 签名: $$_XBL_$$ http://www.taobao.com# {emo-5}',
				content: '如果地区选择器要使用#_enter_##_enter_#后端数据, 请配置 ual 参数 ?_[taobao]shortlink_】?_[taobao]XMTB_】',
				// trimContent: false, // 是否 trim content 两边的空格, 默认是 true, 注意 目前标准版是 trim 的. B 版不期望处理, 没办法你懂得, 真心不期望这样做, 期望产品经理可以统一行为
				signature: '[通道签名 1]',
				disabled: false,
				smsChargeTips: '自定义短信规则提示, <br/> 哈哈哈 <br/> 心情好啊!'
			},
			{
				name: 'GatewayType 1',
				gatewayType: 1,
				keywords: [
					{
						type: 'taobao',
						name: 'YBD_1',
						text: '用不到 1',
						defaultValue: '用不到 1'
					},
					{
						type: 'taobao',
						name: 'YBD_2',
						text: '用不到 2',
						defaultValue: '用不到 2'
					}
				],
				content: '<span id="normal_1000" class="iframeButton 1000">淘宝昵称</span> &nbsp;'
			},
			{
				name: 'GatewayType 2',
				gatewayType: 2,
				signature: '[通道签名 2]',
				content: '  1  1  '
			},
			{
				name: 'GatewayType 3',
				gatewayType: 3,
				signature: '[通道签名 3]',
				content: '1$$_[taobao]XMTB_$$1'
			}
		];

		self.channel = self.channelInfo[0];

		// $timeout(function () {
		// 	self.channel.keywords = [
		// 		{
		// 			type: 'taobao',
		// 			name: 'YBD_1',
		// 			text: '用不到 1',
		// 			defaultValue: '用不到 1'
		// 		},
		// 		{
		// 			type: 'taobao',
		// 			name: 'YBD_2',
		// 			text: '用不到 2',
		// 			defaultValue: '用不到 2'
		// 		}
		// 	];
		// }, 2000);

		self.insertContent = function () {
			self.channel.api.insertContent(self.smscontent);
		}

		self.insertKeyword = function () {
			self.channel.api.insertKeyword('淘短链AAAAAAAAAA111111111', 'taobao');
		}
	});
