import Inject from 'angular-es-utils/decorators/Inject';
import Store from './Store';

@Inject('$ccTips', '$ccModal')
export default class TreeCtrl {

	// 右键菜单样式
	contextMenuStyle = {};

	// 存储右键菜单项
	contextMenuItems = null;

	$onInit() {
		this.documentListener = document.addEventListener('click', () => {
			this.hideContextMenu();
		}, true);
	}

	initData(treeData) {
		Store.initData(treeData);
		this.treeData = Store.treeData;
	}

	get selectedNode() {
		return this.findNodeByParam && this.findNodeByParam('isSelected', true);
	}

	get selectedId() {
		return this.selectedNode && this.selectedNode.id;
	}

	selectNode = nodeId => {
		if (this.selectedId !== nodeId) {
			Store.updateSelectedState(nodeId);
		}
	};

	clickNode = (nodeId, nodeName) => {
		this.selectNode(nodeId, nodeName);
		if (this.onClickAction) {
			this.onClickAction(nodeId, nodeName);
		}
	};

	/**
	 * 事件：打开右键菜单
	 * @param node
	 * @param $event
	 */
	onOpenMenu = (node, $event) => {
		this.selectNode(node.id);
		this.contextMenuStyle = {
			display: 'block',
			left: `${$event.pageX}px`,
			top: `${$event.pageY + 10}px`
		};

		// 已经存在右键菜单数据
		if (this.contextMenuItems) {
			return;
		}

		this.contextMenuItems = this.getContextMenuItems(node.menuItems, node.id);

		$event.stopPropagation();
	};

	checkSameName(name) {
		return new Promise((reslove, reject) => {
			const sameNameNode = this.root.findNodeByParam('name', name);
			if (!sameNameNode) {
				reslove();
			} else {
				reject();
			}
		});
	}

	/**
	 * 新增节点
	 * @param name
	 * @returns {*}
	 */
	addNode = name => {
		console.log(name);
		return this.checkSameName(name).then(() => {

			const node = this.root.findNodeById();
			this.onAddAction(node.parent.id, name).then(({ id }) => {
				// 后端返回id后将id赋值给当前Node
				node.update({ id, name, isEditing: false });
			});
		}, () => {
			throw new Error('该分类名已存在!');
		});
	};

	renameNode = (nodeId, name) => {

		return this.checkSameName(name).then(() => {
			const node = Store.findNodeById(nodeId);

			return this.onRenameAction(nodeId, name).then(() => {
				node.update({ name, isEditing: false });
			});

		}, () => {
			throw new Error('该分类名已存在!');
		});
	};

	removeNode = nodeId => {
		const confirmModal = this._$ccModal.confirm('你确定删除此分类吗？');
		const node = Store.findNodeById(nodeId);
		const { pId } = node;
		const parent = Store.findNodeById(pId);

		confirmModal.open().result.then(() => {
			if (node.children.length) {
				this._$ccTips.error('该节点含有子节点，无法删除！');
			} else {
				this.onRemoveAction(nodeId).then(() => {
					parent.removeChild(nodeId);
				});
			}
		});
	};

	/**
	 * 增加一个输入节点
	 * @param pId
	 */
	addBlankNode = pId => {
		console.log('addBlankNode addBlankNode=>', pId, this.root.id);
		// 新增的节点，无id
		const blankNode = new Store({name: '', pId: this.root.id, isEditing: true, menuItems: ['add', 'remove', 'rename']});

		if (!pId) {
			this.root.addChild(blankNode);
		} else {
			const parentNode = Store.findNodeById(pId);

			blankNode.update({ pId });
			parentNode.addChild(blankNode);
			parentNode.update({ isClosed: false });
		}
	};

	editNode = nodeId => {
		Store.findNodeById(nodeId).update({ isEditing: true });
	};

	/**
	 * 更新节点打开关闭状态
	 * @param nodeId
	 * @param status
	 */
	onUpdateExpandState = (nodeId, status) => {
		console.log('onUpdateExpandState');
		Store.update(nodeId, status);
	};

	getContextMenuItems(itemTypes, nodeId) {
		const menuItemMap = {
			'add': { name: '新增分类', click: () => {
				this.addBlankNode(nodeId);
			} },
			'remove': { name: '删除分类', click: () => {
				this.removeNode(nodeId);
			} },
			'rename': { name: '重命名', click: () => {
				this.editNode(nodeId);
			} }
		};

		return itemTypes ? itemTypes.map(itemType => menuItemMap[itemType]) : menuItemMap;

	}

	hideContextMenu() {
		this.contextMenuStyle = { display: 'none' };
	}

	$onChanges(changeObj) {
		const {data: { currentValue: treeData } = {}} = changeObj;
		if (treeData) {
			this.initData(treeData);
		}
	}

	$onDestory() {
		document.removeEventListener('click', this.documentListener);
	}
}
