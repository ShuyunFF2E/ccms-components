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
		// 搜索条件为空
		if (!filterText) {
			return node;
		}

		// 当前节点为编辑状态
		if (node.isEditing) {
			return node;
		}
		const _filter = node => {
			if (node.name.includes(filterText)) {
				// 如果存在父级，则展开父级
				if (node.pId) {
					this.treeMap.store.findNodeById(node.pId).isClosed = false;
				}
				return true;
			}
			if (node.children && node.children.length) {
				node.isClosed = false;
				return node.children.some(child => _filter(child));
			}
			return false;
		};
		return _filter(node);
	};
}
