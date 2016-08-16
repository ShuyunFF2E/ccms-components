/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-19 15:11
 */

import { Inject } from 'angular-es-utils';

@Inject('$scope')
export default class CustomerAttributeEditorCtrl {
	constructor() {
		this.rfmSelectorFieldsMap = {
			valueField: 'period',
			displayField: 'period_label'
		};
	}

	/**
	 * @name $postLink
	 * set default rfm item & add watch on current selected rfm item
	 */
	$postLink() {
		this.attributeSetting.attributeBlock.forEach(block => {
			if (block.type === 'List' && block.listData && block.listData.length) {
				this.selectedRfm = block.listData[0];
				this.selectedRfmPeriod = this.selectedRfm.period;

				this._$scope.$watch('$ctrl.selectedRfmPeriod', period => (this.selectedRfm = block.listData.filter(rfm => rfm.period === period)[0]));
			}
		});
	}
}
