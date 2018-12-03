import Inject from 'angular-es-utils/decorators/Inject';

@Inject('$filter')
export default class TreeListCtrl {
	/**
	 * 过滤器
	 * @param node
	 * @returns {*}
	 */
	filterHandler = node => {
		const filterText = this.treeMap.searchText || '';
		const _filter = node => {
			if (node.name.includes(filterText)) {
				return true;
			}
			if (node.children && node.children.length) {
				return node.children.some(child => _filter(child));
			}
			return false;
		};
		return _filter(node);
	};
}
