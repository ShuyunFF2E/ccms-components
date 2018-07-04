import { Inject } from 'angular-es-utils/decorators';

@Inject('modalInstance')
export default class SectionAddCtrl {
	$onInit() {
		this.textAreaModel = null;
		// 批量添加
		this.radio = {
			value: 'id',
			setting: ['id', 'number', 'skuNumber'],
			disabled: false
		};
	}

	// 点击确定按钮
	ok() {
		const obj = {};
		obj.inputKey = this.radio.value;
		obj.inputValue = this.textAreaModel.split('\n');
		this._modalInstance.ok(obj);
	}
}
