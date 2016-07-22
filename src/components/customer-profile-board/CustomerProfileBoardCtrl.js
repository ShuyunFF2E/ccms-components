/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-07 17:36
 */

import { Inject } from 'angular-es-utils';

@Inject('$element')
export default class CheckboxController {
	constructor() {
		this.test = {
			'customerId': 1,
			'customerName': 'Hugo BOSS',
			'customerAttr': [
				{
					'name': '基本属性',
					'type': 'base',
					'icon-font': '',
					'attr': [{
						'name': '姓名',
						'value': '雨果',
						'editable': true,
						'type': 'text',
						'validate': ['/\\w{1, 50}/']
					}, {
						'name': '性别',
						'value': '男',
						'editable': true,
						'type': 'radio',
						'enum': ['男', '女'],
						'validate': ''
					}, {
						'name': '出生日期',
						'value': '2015-03-05',
						'editable': true,
						'type': 'date'
					}, {
						'name': '年龄',
						'value': 1,
						'editable': false
					}, {
						'name': '职业',
						'value': '高级训狗师',
						'editable': true,
						'type': 'text',
						'validate': ['/\\w{1, 50}/']
					}, {
						'name': '出生日期',
						'value': '2015-03-05',
						'editable': true,
						'type': 'date'
					}, {
						'name': '常用手机',
						'value': '15618695612',
						'editable': true,
						'type': 'text',
						'validate': ['/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]){1}\\d{8}$/']
					}, {
						'name': '支付手机',
						'value': '15618695612',
						'editable': false
					}, {
						'name': '收货手机',
						'value': '15618695612',
						'editable': false
					}, {
						'name': 'email邮箱',
						'value': '',
						'editable': true,
						'type': 'text',
						'validate': ['.{1, 50}', '/@.+(.com|.cn)$/']
					}]
				}, {
					'name': '消费属性',
					'type': 'consumer',
					'icon-font': '',
					'attr': [{
						'name': '姓名',
						'value': '雨果',
						'editable': true,
						'type': 'text',
						'validate': ['/\\w{1, 50}/']
					}, {
						'name': '性别',
						'value': '男',
						'editable': true,
						'type': 'radio',
						'enum': ['男', '女'],
						'validate': ''
					}, {
						'name': '出生日期',
						'value': '2015-03-05',
						'editable': true,
						'type': 'date'
					}, {
						'name': '年龄',
						'value': 1,
						'editable': false
					}, {
						'name': '职业',
						'value': '高级训狗师',
						'editable': true,
						'type': 'text',
						'validate': ['/\\w{1, 50}/']
					}, {
						'name': '出生日期',
						'value': '2015-03-05',
						'editable': true,
						'type': 'date'
					}, {
						'name': '常用手机',
						'value': '15618695612',
						'editable': true,
						'type': 'text',
						'validate': ['/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]){1}\\d{8}$/']
					}, {
						'name': '支付手机',
						'value': '15618695612',
						'editable': false
					}, {
						'name': '收货手机',
						'value': '15618695612',
						'editable': false
					}, {
						'name': 'email邮箱',
						'value': '',
						'editable': true,
						'type': 'text',
						'validate': ['.{1, 50}', '/@.+(.com|.cn)$/']
					}]
				}, {
					'name': '互动属性',
					'type': 'social',
					'icon-font': '',
					'attr': [{
						'name': '姓名',
						'value': '雨果',
						'editable': true,
						'type': 'text',
						'validate': ['/\\w{1, 50}/']
					}, {
						'name': '性别',
						'value': '男',
						'editable': true,
						'type': 'radio',
						'enum': ['男', '女'],
						'validate': ''
					}, {
						'name': '出生日期',
						'value': '2015-03-05',
						'editable': true,
						'type': 'date'
					}, {
						'name': '年龄',
						'value': 1,
						'editable': false
					}, {
						'name': '职业',
						'value': '高级训狗师',
						'editable': true,
						'type': 'text',
						'validate': ['/\\w{1, 50}/']
					}, {
						'name': '出生日期',
						'value': '2015-03-05',
						'editable': true,
						'type': 'date'
					}, {
						'name': '常用手机',
						'value': '15618695612',
						'editable': true,
						'type': 'text',
						'validate': ['/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9]){1}\\d{8}$/']
					}, {
						'name': '支付手机',
						'value': '15618695612',
						'editable': false
					}, {
						'name': '收货手机',
						'value': '15618695612',
						'editable': false
					}, {
						'name': 'email邮箱',
						'value': '',
						'editable': true,
						'type': 'text',
						'validate': ['.{1, 50}', '/@.+(.com|.cn)$/']
					}]
				}
			],
			'labels': ['夜猫子', '男性用户', '40-49岁', '上班狗', '喵酱', '旺棍'],
			'viewType': 'list'
		};
	}

	/**
	 * @name $onInit
	 * controller init method, init true, false values
	 */
	$onInit() {
		this.viewMode = true;
	}

	changeToViewMode() {
		this.viewMode = true;
	}

	changeToListMode() {
		this.viewMode = false;
	}

	changeToSpecificAttributeBlock(name = '') {
		let index = 0;

		this.changeToListMode();

		for (let attr of this.test.customerAttr) {
			if (attr.name === name) break;
			index++;
		}
		index = index >= this.test.customerAttr.length ? 0 : index;
		this.scrollToAttributeBlock(index);
	}

	scrollToAttributeBlock(index = 0) {
		this._$element.ready(() => {
			this._$element[0].querySelectorAll('customer-attribute-editor')[index].scrollIntoView();
		});
	}
}
