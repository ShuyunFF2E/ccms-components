/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-08-15 14:36
 */

import angular from 'angular';
import { assert } from 'chai';
import injector from 'angular-es-utils/injector';
import sinon from 'sinon';

import CustomerProfileBoardService, {$ccCustomerProfileBoard} from '../CustomerProfileBoardService.js';

describe('CustomerProfileBoard', () => {
	const scope = injector.get('$rootScope').$new();
	let sandbox;

	beforeEach(() => {
		angular.mock.module('app');
		angular.mock.inject($injector => {
			sandbox = sinon.sandbox.create();
			sandbox.stub(injector, 'get', service => $injector.get(service));
		});
	});

	afterEach(() => {
		sandbox.restore();
	});

	describe('$ccCustomerProfileBoard', () => {
		const ccCustomerProfileBoard = new $ccCustomerProfileBoard();

		it('popProfileBoardModal', () => {
			ccCustomerProfileBoard.$get().popProfileBoardModal();
			scope.$$postDigest(() => {
				assert.isNotNull(document.querySelector('.ccms-modal[data-uid="customer-profile-board"]'));
			});
		});

		after(() => {
			document.body.removeChild(document.querySelector('.ccms-modal'));
		});
	});

	describe('CustomerProfileBoardService', () => {
		it('queryCustomerProfileData', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			assert.isFunction(customerProfileBoardService.queryCustomerProfileData().then);
			assert.isFunction(customerProfileBoardService.queryCustomerProfileData({nickName: 'a', shopId: 'b', platName: 'c'}).then);
		});

		it('getCustomerDefinedAttributeData', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			assert.isFunction(customerProfileBoardService.getCustomerDefinedAttributeData().then);
			assert.isFunction(customerProfileBoardService.getCustomerDefinedAttributeData({nickName: 'a', tenantId: 'b', platName: 'c'}).then);
		});

		it('saveCustomerDefinedAttribute', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			assert.isFunction(customerProfileBoardService.saveCustomerDefinedAttribute().then);
			assert.isFunction(customerProfileBoardService.saveCustomerDefinedAttribute({}).then);
		});

		it('updateCustomerDefinedAttributeData', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			assert.isFunction(customerProfileBoardService.updateCustomerDefinedAttributeData().then);
			assert.isFunction(customerProfileBoardService.updateCustomerDefinedAttributeData({}).then);
		});

		it('queryCustomerDefinedPlatformAttribute', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			assert.isFunction(customerProfileBoardService.queryCustomerDefinedPlatformAttribute().then);
			assert.isFunction(customerProfileBoardService.queryCustomerDefinedPlatformAttribute('a').then);
		});

		it('saveCustomerDefinedPlatformAttribute', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			assert.isFunction(customerProfileBoardService.saveCustomerDefinedPlatformAttribute().then);
		});

		it('generateCustomerData', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			const data = {
				customer: {
					data: {
						data: [{
							customer: {
								name: 'jack'
							}
						}]
					}
				},
				trade: {
					data: {
						data: [{
							trade: {
								id: '123'
							}
						}]
					}
				},
				rfm: {
					data: {
						data: [{
							period: 6
						}]
					}
				},
				tags: {
					data: {
						result: {}
					}
				},
				memberInfo: {
					member1: {
						member1: 'member1'
					},
					member2: {
						member2: 'member2'
					}
				},
				log: {
					a: 'a'
				}
			};

			const rfm = [{
				period: 6,
				period_label: '时间不限'
			}, {
				period: 1,
				period_label: '最近30天'
			}, {
				period: 2,
				period_label: '最近60天'
			}, {
				period: 3,
				period_label: '最近90天'
			}, {
				period: 4,
				period_label: '最近180天'
			}, {
				period: 5,
				period_label: '最近360天'
			}];

			const result = {
				customer: {
					name: 'jack'
				},
				trade: {
					id: '123'
				},
				period: 6,
				period_label: '时间不限',
				rfm,
				tags: [],
				member1: 'member1',
				member2: 'member2',
				marketingResponsivities: 1,
				a: 'a'
			};
			assert.deepEqual(customerProfileBoardService.generateCustomerData(data), result);
		});

		it('concatCustomerAddressZip', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			assert.deepEqual(customerProfileBoardService.concatCustomerAddressZip(), {});

			const data = {
				receiver_state: 'a',
				receiver_city: 'b',
				receiver_district: 'c',
				receiver_address: 'd',
				receiver_zip: 'e'
			};
			const result = {
				...data,
				address_zip: 'abcd e'
			};
			assert.deepEqual(customerProfileBoardService.concatCustomerAddressZip(data), result);
		});

		it('getTagsList', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			assert.deepEqual(customerProfileBoardService.getTagsList({}), []);

			const data = {
				male: 1,
				female: 0,
				family: '1',
				aa: 1
			};
			const result = ['男性用户', '家庭用户'];
			assert.deepEqual(customerProfileBoardService.getTagsList(data), result);
		});

		it('getLastRfmItem', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			assert.deepEqual(customerProfileBoardService.getLastRfmItem([]), {});

			const data = [{
				period: 3
			}, {
				period: 2
			}, {
				period: 6
			}];
			const result = {period: 6};
			assert.deepEqual(customerProfileBoardService.getLastRfmItem(data), result);
		});

		it('setRfmLabel', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			const data = [{
				period: 3
			}, {
				period: 2
			}, {
				period: 6
			}];
			const rfm = [{
				period: 6,
				period_label: '时间不限'
			}, {
				period: 1,
				period_label: '最近30天'
			}, {
				period: 2,
				period_label: '最近60天'
			}, {
				period: 3,
				period_label: '最近90天'
			}, {
				period: 4,
				period_label: '最近180天'
			}, {
				period: 5,
				period_label: '最近360天'
			}];
			assert.deepEqual(customerProfileBoardService.setRfmLabel(data), rfm);
			assert.deepEqual(customerProfileBoardService.setRfmLabel([]), rfm);
		});

		it('mappingDataIntoAttributeBlock', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			const block = {
				title: '社交绑定',
				name: 'social',
				attributeList: [{
					attribute: 'wechatNick',
					name: '微信昵称',
					defaultValue: '未开通',
					unit: '',
					editable: false,
					isInListMode: false
				}, {
					attribute: 'sinawbUserId',
					name: '微博账号',
					defaultValue: '未开通',
					unit: '',
					editable: false,
					isInListMode: false
				}]
			};
			const data = {
				wechatNick: 'aaa',
				sinawbUserId: 'bbb'
			};
			const result = {
				title: '社交绑定',
				name: 'social',
				attributeList: [{
					attribute: 'wechatNick',
					name: '微信昵称',
					defaultValue: '未开通',
					displayValue: 'aaa',
					unit: '',
					editable: false,
					isInListMode: false
				}, {
					attribute: 'sinawbUserId',
					name: '微博账号',
					defaultValue: '未开通',
					displayValue: 'bbb',
					unit: '',
					editable: false,
					isInListMode: false
				}]
			};
			customerProfileBoardService.mappingDataIntoAttributeBlock(block, data);
			assert.deepEqual(block, result);
		});

		it('mappingDataIntoAttributeSetting', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();

			const list = [{
				attribute: 'wechatNick',
				name: '微信昵称',
				defaultValue: '未开通',
				unit: '',
				editable: false,
				isInListMode: false
			}, {
				attribute: 'sinawbUserId',
				name: '微博账号',
				defaultValue: '未开通',
				unit: '',
				editable: false,
				isInListMode: false
			}];
			const data = {
				wechatNick: 'aaa',
				sinawbUserId: 'bbb'
			};
			const result = [{
				attribute: 'wechatNick',
				name: '微信昵称',
				defaultValue: '未开通',
				displayValue: 'aaa',
				unit: '',
				editable: false,
				isInListMode: false
			}, {
				attribute: 'sinawbUserId',
				name: '微博账号',
				defaultValue: '未开通',
				displayValue: 'bbb',
				unit: '',
				editable: false,
				isInListMode: false
			}];
			customerProfileBoardService.mappingDataIntoAttributeSetting(list, data);
			assert.deepEqual(list, result);
		});

		it('getAttributeList', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();

			const result = ['full_name', 'sex', 'birthday', 'age', 'mobile', 'buyer_email', 'address_zip', 'platName',
				'vip_info', 'buyer_credit_lev', '', 'trade_first_time', 'trade_first_amount', 'trade_first_interval',
				'trade_last_time', 'trade_last_amount', 'trade_last_interval', 'trade_tidcount', 'trade_count',
				'trade_amount', 'trade_item_num', 'trade_avg_amount', 'trade_avg_item_num', 'trade_avg_buy_interval',
				'trade_refund_count', 'trade_refund_amount', 'trade_avg_confirm_interval', 'trade_max_amount',
				'trade_order_discount_fee', 'cardGrade', 'effectTime', 'expireTime', 'currentPoint', 'totalGet',
				'signCount', 'exchangeCount', 'wechatNick', 'sinawbUserName'];

			assert.deepEqual(customerProfileBoardService.getAttributeList(), result);
		});

		it('getAttributeValue', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();

			const attribute = {
				attribute: 'trade_last_amount',
				name: '最后一次购买金额',
				defaultValue: '0.00 元',
				unit: ' 元',
				fixed: 2,
				editable: false,
				isInListMode: true
			};
			const data = {
				trade_last_amount: 1.5
			};
			const result = '1.50 元';
			assert.deepEqual(customerProfileBoardService.getAttributeValue(attribute, data), result);
			assert.deepEqual(customerProfileBoardService.getAttributeValue(attribute, {}), attribute.defaultValue);

			const attribute2 = {
				attribute: 'sex',
				name: '性别',
				defaultValue: '',
				unit: '',
				editable: false,
				type: 'radio',
				valueMap: {
					m: '男',
					f: '女',
					'': '未知'
				},
				validate: [],
				isInListMode: true
			};
			const data2 = {
				sex: 'f'
			};
			const result2 = '女';
			assert.deepEqual(customerProfileBoardService.getAttributeValue(attribute2, data2), result2);
			assert.deepEqual(customerProfileBoardService.getAttributeValue(attribute2, {}), attribute2.valueMap[attribute2.defaultValue]);
		});

		it('formatNumber', () => {
			const customerProfileBoardService = new CustomerProfileBoardService();
			assert.strictEqual(customerProfileBoardService.formatNumber('a'), '0.00');
			assert.strictEqual(customerProfileBoardService.formatNumber('0'), '0.00');
			assert.strictEqual(customerProfileBoardService.formatNumber(0), '0.00');
			assert.strictEqual(customerProfileBoardService.formatNumber(11.1), '11.10');
			assert.strictEqual(customerProfileBoardService.formatNumber(123.456), '123.46');
		});
	});
});
