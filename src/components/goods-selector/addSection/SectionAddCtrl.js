import { Inject } from 'angular-es-utils/decorators';

@Inject('modalInstance', '$ccValidator', 'isQiake')
export default class SectionAddCtrl {
	$onInit() {
		this.isQiake = this._isQiake;
		this.addSectionForm = {
			textAreaModel: null
		};
		// 批量添加
		this.radio = {
			value: 'id',
			setting: ['id', 'number', 'skuNumber'],
			disabled: false
		};

		// 校验
		this.validators = {
			pattern: {
				msg: '只能输入字母数字和换行符',
				fn: (modelValue, viewValue) => {
					let value = modelValue || viewValue;
					return !(/[^\r\n0-9A-Za-z]/g).test(value);
				}
			},
			maxInputNumber: {
				msg: '最多允许输入198条数据',
				fn: (modelValue, viewValue) => {
					let value = modelValue || viewValue;
					let arr = [];
					if (value) {
						arr = value.split('\n').filter(item => {
							return item || item === 0;
						});
					}
					return arr.length <= 198;
				}
			}
		};
	}

	// 点击确定按钮
	ok() {
		this._$ccValidator.validate(this.addSectionForm).then(() => {
			const obj = {};
			obj.inputKey = this.radio.value;
			obj.inputValue = this.addSectionForm.textAreaModel.split('\n').filter(item => {
				return item || item === 0;
			});
			this._modalInstance.ok(obj);
		}, () => {});
	}
}
