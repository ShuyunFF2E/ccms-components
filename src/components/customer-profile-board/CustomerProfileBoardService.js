/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-18 11:39
 */

import { Inject } from 'angular-es-utils';

import controller from './CustomerProfileBoardCtrl.js';
import template from './customer-profile-board.html';

const MODALTITLESTRING = '客户基本信息';

@Inject('ModalService')
export default class CustomerProfileBoardService {
	constructor() {}

	popProfileBoardModal(scope) {
		const modalOptions = {
			scope,
			title: MODALTITLESTRING,
			style: {width: '640px', height: '460px', 'min-width': '640px', 'min-height': '460px', 'padding': 0},
			__body: template,
			controller: controller,
			hasFooter: false,
			uid: 'customer-profile-board'
		};
		this._ModalService.modal(modalOptions).open();
	}
}
