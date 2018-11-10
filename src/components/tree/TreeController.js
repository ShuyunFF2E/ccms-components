import Inject from 'angular-es-utils/decorators/Inject';
import Store from './Store';
import Handler from './Handler';

@Inject('$ccTips', '$ccModal', '$scope')
export default class TreeCtrl {

	// 右键菜单样式
	contextMenuStyle = {};

	// 存储右键菜单项
	contextMenuItems = null;

	$onInit() {
		this.initHandler();
		this.documentListener = document.addEventListener('click', () => {
			this.hideContextMenu();
		}, true);
	}

	/**
	 * 初始化数据
	 * @param treeData
	 */
	initData(treeData) {
		Store.initData(treeData);
		this.treeData = Store.treeData;
	}

	/**
	 * 初始化handner
	 */
	initHandler() {
		Handler.setEvent('onClickAction', this.onClickAction);
		Handler.setEvent('onRemoveAction', this.onRemoveAction);
		Handler.setEvent('onAddAction', this.onAddAction);
		Handler.setEvent('onRenameAction', this.onRenameAction);
	}

	/**
	 * 当前选中的节点
	 * @returns {*|string}
	 */
	get selectedNode() {
		return Store.selectedNode;
	}

	/**
	 * 当前选中的节点ID
	 * @returns {*|string}
	 */
	get selectedId() {
		return Store.selectedNode && Store.selectedNode.id;
	}

	/**
	 * 事件：打开右键菜单
	 * @param node
	 * @param $event
	 */
	onOpenMenu = (node, $event) => {
		Store.updateSelectedNode(node);
		this.contextMenuStyle = {
			display: 'block',
			left: `${$event.pageX}px`,
			top: `${$event.pageY + 10}px`
		};

		// 已经存在右键菜单数据
		if (this.contextMenuItems) {
			return;
		}

		// 菜单项
		this.contextMenuItems = this.getContextMenuItems(node);

		$event.stopPropagation();
	};

	/**
	 * 删除节点
	 * @param node
	 */
	removeNode = node => {
		const confirmModal = this._$ccModal.confirm('你确定删除此分类吗？');

		confirmModal.open().result.then(() => {
			if (node.children && node.children.length) {
				this._$ccTips.error('该节点含有子节点，无法删除！');
			} else {
				Handler.run('onRemoveAction', node).then(() => {
					Store.removeChild(node);
					this._$scope.$apply();
				})
				.catch(msg => {
					this._$ccTips.error(msg || '节点删除失败');
				});
			}
		});
	};

	/**
	 * 编辑
	 * @param node
	 */
	editNode = node => {
		Store.updateById(node.id, { isEditing: true });
	};

	/**
	 * 增加一个输入节点
	 * @param parentNode: 父节点
	 */
	addBlankNode = parentNode => {
		// 新增的节点，无id
		const blankNode = {name: '', pId: parentNode.id, level: parentNode.level + 1, isEditing: true};

		Store.addChild(parentNode.id, blankNode);
	};

	/**
	 * 获取菜单项
	 */
	getContextMenuItems() {
		const menuItemMap = {
			'add': { name: '新增分类', click: node => {
				this.addBlankNode(node);
			} },
			'remove': { name: '删除分类', click: node => {
				this.removeNode(node);
			} },
			'rename': { name: '重命名', click: node => {
				this.editNode(node);
			} }
		};
		return menuItemMap;
	}

	/**
	 * 隐藏右键菜单
	 */
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
