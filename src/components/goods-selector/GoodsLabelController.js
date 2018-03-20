import { Inject } from 'angular-es-utils/decorators';
@Inject('modalInstance')
export default class OpenGoodsLabelController {
	constructor() {
		this.sure = function() {
			console.log('sure');
			this._modalInstance.ok([]);
		};

		this.fuckOff = function() {
			console.log('fuck off');
			this._modalInstance.cancel();
		};
	}
}
