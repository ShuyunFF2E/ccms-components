/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

import './_area-selector.scss';

import ModalService from '../modal/ModalService';
import bodyTemplate from './area-seletor-body.tpl.html';
import AreaSelectorController from './AreaSelectorCtrl';


const noop = () => {
};

/**
 * modal服务
 */
const AreaSelectorService = {

	areaSelector({scope, title = '地区选择', style = {'max-width': '680px', 'min-height': '420px'}, fullscreen = false, hasFooter = true, body, uid, __body = bodyTemplate, footer, locals, controller = AreaSelectorController, controllerAs = '$ctrl', bindings, onClose = noop}) {
		return ModalService.modal({ scope, title, style, fullscreen, hasFooter, body, uid, __body, footer, locals, controller, controllerAs, bindings, onClose });
	},

	confirm(message, onClose = noop) {
		return ModalService.confirm(message, onClose = noop);
	}
};

export default AreaSelectorService;
