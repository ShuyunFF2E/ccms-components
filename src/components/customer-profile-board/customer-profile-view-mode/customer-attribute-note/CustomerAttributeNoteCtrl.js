/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-21 14:54
 */

export default class CustomerAttributeNote {
	$onInit() {
		this.displayAttributeList = this.getDisplayAttributeList(this.customerAttribute);
	}

	getDisplayAttributeList(customerAttribute = {}) {
		let attributeList = [];
		customerAttribute.attributeBlock.forEach(block => attributeList.push(this.expandAttributeList(block.attributeList)));
		return attributeList.reduce((pre, curr) => [...pre, ...curr], []).filter(attribute => attribute.isInListMode);
	}

	/**
	 * Recursion expand attribute list array
	 * @name expandAttributeList
	 * @param {Array} attributeList
	 * @returns {Array}
	 */
	expandAttributeList(attributeList) {
		let tmpList = [];
		attributeList.forEach(attribute => (typeof attribute.attribute !== 'undefined') ? tmpList.push(attribute) : (tmpList = [...tmpList, ...this.expandAttributeList(attribute.attributes)]));
		return tmpList;
	}
}
