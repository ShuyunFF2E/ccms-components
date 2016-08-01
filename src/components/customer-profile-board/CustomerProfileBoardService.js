/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-18 11:39
 */

import { Inject } from 'angular-es-utils';

import controller from './CustomerProfileBoardCtrl.js';
import template from './customer-profile-board.html';

import generatorQueryString from './queryStringSchema.js';
const MODALTITLESTRING = '客户基本信息';
const APIADDRESS = 'http://172.18.21.113:8888/fullView';

@Inject('ModalService')
export default class CustomerProfileBoardService {
	constructor() {}

	popProfileBoardModal(scope, customerInformation = {}) {
		const modalOptions = {
			scope,
			bindings: {
				customerInformation
			},
			title: MODALTITLESTRING,
			style: {width: '640px', height: '520px', 'min-width': '640px', 'min-height': '520px', 'padding': 0},
			__body: template,
			controller: controller,
			hasFooter: false,
			uid: 'customer-profile-board'
		};
		this._ModalService.modal(modalOptions).open();
	}

	queryCustomerProfileData(buyerNick = '米粒星期天', platCustNo = '123', platId = 'taobao', platShopId = '100094062') {
		console.log(generatorQueryString(buyerNick, platCustNo, platId, platShopId));
		return fetch(
			APIADDRESS,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/graphql'
				},
				body: generatorQueryString(buyerNick, platCustNo, platId, platShopId)
			})
			.then(data => data.json());
	}

	generateAttributeDataMap(data) {
		return Object.keys(data)
			.map(key => data[key])
			.reduce((pre, curr) => ({...pre, ...curr}), {});
	}
}
