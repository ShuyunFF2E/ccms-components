import Inject from 'angular-es-utils/decorators/Inject';
import { Node } from './Node';

@Inject('$ccTips', '$ccModal')
export default class TreeCtrl {

	contextStyle = {};
	contextMenuItems = [];

	constructor() {
		console.log(this);
	}

	$onInit() {

		this.documentListener = document.addEventListener('click', () => {
			this.hideContextMenu();
		}, true);

	}

	initData(data) {
		this.root = new Node(data);
	}

	get selectedNode() {
		return this.root.findChildByParam && this.root.findChildByParam('isSelected', true);
	}

	get selectedId() {
		return this.selectedNode && this.selectedNode.id;
	}

	selectNode = nodeId => {
		if (this.selectedId !== nodeId) {
			if (this.selectedNode) {
				this.selectedNode.update({ isSelected: false });
			}
			this.root.findChild(nodeId).update({ isSelected: true });
		}
	};

	clickNode = (nodeId, nodeName) => {
		console.log(this);
		this.selectNode(nodeId, nodeName);
		if (this.onClickAction) {
			this.onClickAction(nodeId, nodeName);
		}
	};

	onOpenMenu = (node, $event) => {
		this.selectNode(node.id);
		this.showContextMenu(node, $event);
	};

	checkSameName(name) {
		return new Promise((reslove, reject) => {
			const sameNameNode = this.root.findChildByParam('name', name);
			if (!sameNameNode) {
				reslove();
			} else {
				reject();
			}
		});
	}

	addNode = name => {
		return this.checkSameName(name).then(() => {

			const node = this.root.findChild();
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
			const node = this.root.findChild(nodeId);

			return this.onRenameAction(nodeId, name).then(() => {
				node.update({ name, isEditing: false });
			});

		}, () => {
			throw new Error('该分类名已存在!');
		});
	};

	removeNode = nodeId => {
		const confirmModal = this._$ccModal.confirm('你确定删除此分类吗？');
		const node = this.root.findChild(nodeId);
		const { pId } = node;
		const parent = this.root.findChild(pId);

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

	addBlankNode = pId => {

		// 新增的节点，无id
		const blankNode = new Node({name: '', pId: this.root.id, isEditing: true, menuItems: ['add', 'remove', 'rename']});

		if (!pId) {
			this.root.addChild(blankNode);
		} else {
			const parentNode = this.root.findChild(pId);

			blankNode.update({ pId });
			parentNode.addChild(blankNode);
			parentNode.update({ isClosed: false });
		}
	};

	editNode = nodeId => {
		this.root.findChild(nodeId).update({ isEditing: true });
	};

	updateNodeStatus = (nodeId, status) => {
		const node = this.root.findChild(nodeId);
		node.update(status);
	};

	showContextMenu = (node, $event) => {
		console.log(node);
		this.contextStyle = {
			display: 'block',
			left: `${$event.pageX}px`,
			top: `${$event.pageY + 10}px`
		};

		this.contextMenuItems = this.getContextMenuItems(node.menuItems, node.id);

		$event.stopPropagation();
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
		this.contextStyle = { display: 'none' };
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
