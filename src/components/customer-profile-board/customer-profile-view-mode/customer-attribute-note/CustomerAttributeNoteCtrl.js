/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-07-21 14:54
 */

export default class CustomerAttributeNote {
	$onInit() {
		this.displayAttributeList = this.getDisplayAttributeList(this.customerAttribute);
	}

	/**
	 * @name getDisplayAttributeList
	 * @param {Object} customerAttribute
	 * @returns {Array}
	 * According to customerAttribute object to generator a list that only includes attributes whose isInListMode value is true
	 */
	getDisplayAttributeList(customerAttribute = {}) {
		let attributeList = [];
		customerAttribute.attributeBlock.forEach(block => attributeList.push(this.expandAttributeList(block.attributeList)));
		return attributeList.reduce((pre, curr) => [...pre, ...curr], []).filter(attribute => attribute.isInListMode);
	}

	/**
	 * @name expandAttributeList
	 * @param {Array} attributeList
	 * @returns {Array}
	 * Recursion expand attribute list array
	 */
	expandAttributeList(attributeList) {
		let tmpList = [];
		attributeList.forEach(attribute => (typeof attribute.attributes === 'undefined') ? tmpList.push(attribute) : (tmpList = [...tmpList, ...this.expandAttributeList(attribute.attributes)]));
		return tmpList;
	}
}
