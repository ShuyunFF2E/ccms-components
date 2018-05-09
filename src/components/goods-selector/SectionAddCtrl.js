export default class SectionAddCtrl {
	$onInit() {
		// 批量添加
		this.radio = {
			value: 'id',
			setting: ['id', 'number', 'skuNumber'],
			disabled: false
		};
	}
}
