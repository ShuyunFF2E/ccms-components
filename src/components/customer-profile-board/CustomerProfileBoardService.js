/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-18 11:39
 */

import { Inject } from 'angular-es-utils';

import controller from './CustomerProfileBoardCtrl.js';
import template from './customer-profile-board.html';
import generatorQueryString from './queryStringSchema.js';
import { TagsMapping, RfmLabel } from './CustomerAttributeSetting.js';

const MODALTITLESTRING = '客户基本信息';
const APIADDRESS = 'http://172.18.21.113:8887/fullView';

@Inject('ModalService')
export default class CustomerProfileBoardService {
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

	queryCustomerProfileData(nickName = '2010ydaiqiong', tenantId = '65879458', shopId = '100094062', platName = 'taobao') {
		return fetch(
			APIADDRESS,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/graphql'
				},
				body: generatorQueryString(nickName, tenantId, shopId, platName)
			})
			.then(data => data.json());
	}

	generateCustomerData(data = {}) {
		console.log(data);
		console.log(Object.keys(data)
			.map(key => {
				switch (key) {
					case 'customer':
					case 'trade':
						return data[key].data.data[0];
					case 'rfm':
						return { rfm: this.setRfmLabel(data[key].data.data) };
					case 'tags':
						return { tags: this.getTagsList(data[key].result) };
					default:
						return data[key];
				}
			})
			.reduce((pre, curr) => ({...pre, ...curr}), {}));
		return Object.keys(data)
			.map(key => {
				switch (key) {
					case 'customer':
					case 'trade':
						return data[key].data.data[0];
					case 'rfm':
						return Object.assign({ rfm: this.setRfmLabel(data[key].data.data) }, this.getLastRfmItem(data[key].data.data));
					case 'tags':
						return { tags: this.getTagsList(data[key].result) };
					default:
						return data[key];
				}
			})
			.reduce((pre, curr) => ({...pre, ...curr}), {});
	}

	getTagsList(tagObj = {}) {
		return Object.keys(tagObj)
			.filter(key => +tagObj[key])
			.map(key => TagsMapping[key]);
	}

	getLastRfmItem(rfmList = []) {
		return rfmList.length ? rfmList.sort((prev, next) => prev.period > next.period ? -1 : 1)[rfmList.length - 1] : {};
	}

	setRfmLabel(rfmList = []) {
		return rfmList.map(rfm => ({...rfm, period_label: RfmLabel[rfm.period]}));
	}
}
