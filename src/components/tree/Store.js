/**
 * Tree 数据管理
 */
class Store {
	treeData = [];

	// 当前选中的节点
	selectedNode = null;

	/**
	 * 初始化数据
	 * @param treeData
	 * @returns {*}
	 */
	initData(treeData) {
		const format = (node, level) => {
			const { children } = node;

			// 层级
			node.level = level;

			if (!children || !children.length) {
				return;
			}
			children.forEach(item => {
				format(item, node.level + 1);
			});
			return node;
		};

		this.treeData = treeData.map(item => {
			return format(item, 0);
		});
	}

	/**
	 * 展开数据为map格式
	 * @param treeData
	 */
	// flatMap(treeData) {
	// 	const flatMap = {};
	// 	const install = (node, level) => {
	// 		const { id, pId, name, children, isClosed } = node;
	// 		flatMap['' + id] = {
	// 			id,
	// 			pId,
	// 			name,
	// 			isClosed,
	// 			level: level
	// 		};
	// 		if (!children || !children.length) {
	// 			return;
	// 		}
	// 		children.forEach(item => {
	// 			install(item, flatMap[item.pId].level + 1);
	// 		});
	// 	};
    //
	// 	treeData.forEach(item => {
	// 		install(item, 0);
	// 	});
	// 	return flatMap;
	// }

	/**
	 * 通过id获取节点
	 * @param id
	 * @returns {*}
	 */
	findNodeById(id) {
		return this.findNodeByParam('id', id);
	}

	/**
	 * 通过自定义键值获取节点
	 * @param param
	 * @param value
	 * @returns {*}
	 */
	findNodeByParam(param, value) {
		let node = null;

		const findFn = treeData => {
			treeData.some(item => {
				if (item[param] === value) {
					node = item;
					return true;
				}

				if (item.children && item.children.length) {
					return findFn(item.children);
				}

				return false;
			});
		};

		findFn(this.treeData);
		return node;
	}

	addChild(node, index) {
		index = index || this.children.length;
		this.children.splice(index, 0, node);
	}

	removeChild(nodeId) {
		this.children.forEach((child, index) => {
			if (child.id === nodeId) {
				this.children.splice(index, 1);
			}
		});
	}

	/**
	 * 更新节点选中状态
	 * @param id
	 */
	updateSelectedState(id) {
		this.selectedNode && this.update(this.selectedNode.id, { isSelected: false });
		this.selectedNode = this.update(id, { isSelected: true });
	}

	/**
	 * 更新节点数据
	 * @param id
	 * @param updatePart
	 * @returns {any}
	 */
	update(id, updatePart) {
		const node = this.findNodeById(id);
		return Object.assign(node, updatePart);
	}
}

export default new Store();
