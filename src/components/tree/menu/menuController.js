import Inject from 'angular-es-utils/decorators/Inject';

@Inject('$ccTips', '$ccModal', '$scope', '$element', '$timeout')
export default class menuCtrl {
	// 右键菜单样式
	contextMenuStyle = {};

	// 存储右键菜单项
	contextMenuItems = null;
	$onInit() {
		this.setDefaultValue();

		this._$scope.$watch('$ctrl.menuHash', newVal => {
			newVal && this.onOpenMenu(this.activeNode, window.event);
		});

		this.documentListener = document.addEventListener('click', () => {
			this.hideContextMenu();
		}, true);
	}

	/**
	 * 设置默认值
	 */
	setDefaultValue() {
		// 新节点添加后所在的位置，默认值为after
		this.addToPosition = this.addToPosition || 'after';

		// 最大节点长度
		this.nodeMaxLen = this.nodeMaxLen || 20;
	}

	/**
	 * 隐藏右键菜单
	 */
	hideContextMenu() {
		this._$timeout(() => {
			this.contextMenuStyle = { display: 'none' };
		});
	}

	/**
	 * 事件：打开右键菜单
	 * @param node
	 * @param $event
	 */
	onOpenMenu(node, $event) {
		this.treeMap.store.updateActiveNode(node);
		this.contextMenuStyle = {
			display: 'block',
			left: `${$event.pageX}px`,
			top: `${$event.pageY + 10}px`
		};

		// 菜单项
		this.contextMenuItems = this.getContextMenus(node);
		$event.stopPropagation();
	}

	/**
	 * 删除节点
	 * @param node
	 */
	removeNode(node) {
		const confirmModal = this._$ccModal.confirm('你确定删除此目录吗？');

		confirmModal.open().result.then(() => {
			if (node.children && node.children.length) {
				this._$ccTips.error('该目录含有子目录，无法删除！ ');
			} else {
				this.treeMap.handler.onRemoveAction && this.treeMap.handler.onRemoveAction(node).then(() => {
					this.treeMap.store.removeChild(node);
					this._$timeout(() => {
						this._$scope.$digest();
					});
				})
				.catch(msg => {
					this._$ccTips.error(msg || '删除失败');
				});
			}
		});
	}

	/**
	 * 获取菜单项
	 * @param node
	 */
	getContextMenus(node) {
		const menuList = [];
		this.treeMap.handler.onAddAction && menuList.push({
			name: '新增',
			click: node => {
				this.addBlankNode(node, this.addToPosition);
			},
			disabled: node.disableAdd
		});

		this.treeMap.handler.onRemoveAction && menuList.push({
			name: '删除',
			click: node => {
				this.removeNode(node);
			},
			disabled: node.disableRemove
		});

		this.treeMap.handler.onRenameAction && menuList.push({
			name: '重命名',
			click: node => {
				this.upateNodeEditing(node);
			},
			disabled: node.disableRename
		});
		return menuList;
	}

	/**
	 * 将节点变更为编辑状态
	 * @param node
	 */
	upateNodeEditing(node) {
		this.clearAllEditingState();
		this.treeMap.store.updateById(node.id, { isEditing: true });
		this.focusEditingNode();
	}


	/**
	 * 清除全部节点的编辑状态
	 */
	clearAllEditingState() {
		const editingNode = this.treeMap.store.findNodeByParam('isEditing', true);

		// 清除新增节点
		if (editingNode && !editingNode.id) {
			this.treeMap.store.removeChild(editingNode);
		}

		// 清除编辑节点
		if (editingNode && editingNode.id) {
			this.treeMap.store.updateById(editingNode.id, { isEditing: false });
		}
	}

	/**
	 * 触焦正在编辑的节点
	 */
	focusEditingNode() {
		this._$timeout(() => {
			this._$element[0].parentNode.querySelector('.cc-tree-node.editing input').focus();
		});
	}

	/**
	 * 增加一个输入节点
	 * @param parentNode: 父节点
	 * @param addToPosition: 新节点添加后所在的位置
	 */
	addBlankNode(parentNode, addToPosition) {
		this.clearAllEditingState();
		const { maxLevel } = this;

		// 新增的节点，无id
		const blankNode = {name: '', pId: parentNode.id, level: parentNode.level + 1, isEditing: true};

		// 超过最大层级的节点将不允许新增节点
		if (maxLevel && blankNode.level >= maxLevel) {
			blankNode.disableAdd = true;
		}
		this.treeMap.store.addChild(parentNode.id, blankNode, addToPosition);

		// 强制展开父级节点
		parentNode.isClosed = false;
		this.focusEditingNode();
	}

	$onDestory() {
		document.removeEventListener('click', this.documentListener);
	}
}
