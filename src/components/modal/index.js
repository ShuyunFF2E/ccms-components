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
	.service('ModalService', ModalService)
	.name;
