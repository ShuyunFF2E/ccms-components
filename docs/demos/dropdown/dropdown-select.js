angular
	.module('demos.dropdownSelect', ['ccms.components'])
	.controller('DemoCtrl', function($scope) {
		this.options = {
			placeholderText: '请选择',

			valueField: 'value',
			displayField: 'title',

			searchable: true,

			datalist: [
				{title: '北京', value: 'bj'},
				{title: '上海', value: 'sh'},
				{title: '深圳', value: 'sz'},
				{title: '广州', value: 'gz'}
			]

		};
	});

