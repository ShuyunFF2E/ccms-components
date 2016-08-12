/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-02-25
 */

import angular from 'angular';
import bindHtml from '../bind-html';

import ModalService from './ModalService';

export default angular
	.module('ccms.components.modal', [bindHtml])
	// .deprecatedValue('ModalService', ModalService, 'ModalService 服务将在下一版本废弃,请使用 $ccModal 服务代替!')
	.value('ModalService', ModalService)
	.value('$ccModal', ModalService)
	.name;
