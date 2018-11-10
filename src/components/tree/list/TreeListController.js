import Store from '../Store';
export default class TreeListCtrl {
	hasChildren(node) {
		return node.children && node.children.length;
	}

	/**
	 * 过滤器
	 * @param node
	 * @returns {*}
	 */
	filterHandler = node => {
		const test = this._filterHandler(node, Store.filterText);
		return test;
	};

	_filterHandler(node, filterStr) {
		if (!filterStr) {
			return true;
		}
		if (node.name.includes(filterStr)) {
			return true;
		}
		if (node.children && node.children.length) {
			return node.children.some(child => this._filterHandler(child, filterStr));
		}
		return false;
	}
}
