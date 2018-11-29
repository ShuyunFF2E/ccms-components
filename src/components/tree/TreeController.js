import Inject from 'angular-es-utils/decorators/Inject';
import Store from './Store';
import Handler from './Handler';

@Inject('$ccTips', '$ccModal', '$scope', '$timeout')
export default class TreeCtrl {
	// 右键菜单样式
	contextMenuStyle = {};

	// 存储右键菜单项
	contextMenuItems = null;

	// 存储树所需要的数据和事件
	treeMap = {};

	$onInit() {
		this.documentListener = document.addEventListener('click', () => {
			this.hideContextMenu();
		}, true);
	}

	/**
	 * 初始化数据
	 * @param treeData
	 */
	initData(treeData) {
		// TODO 这个map实例化后，还是同一个map。 与直接使用Handler和Store没什么区别
		this.treeMap.handler = new Handler(this);
		this.treeMap.store = new Store(treeData);
		this.treeData = this.treeMap.store.treeData;
	}

	/**
	 * 当前选中的节点
	 * @returns {*|string}
	 */
	get activeNode() {
		return this.treeMap.store.activeNode;
	}

	/**
	 * 当前选中的节点ID
	 * @returns {*|string}
	 */
	get selectedId() {
		return this.treeMap.store.activeNode && this.treeMap.store.activeNode.id;
	}

	/**
	 * 事件：打开右键菜单
	 * @param node
	 * @param $event
	 */
	onOpenMenu = (node, $event) => {
		this.treeMap.store.updateActiveNode(node);
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
		this.contextMenuItems = this.getContextMenus(node);

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
				this.treeMap.handler.onRemoveAction && this.treeMap.handler.onRemoveAction(node).then(() => {
					this._$timeout(() => {
						this.treeMap.store.removeChild(node);
					});
				})
				.catch(msg => {
					this._$ccTips.error(msg || '节点删除失败');
				});
			}
		});
	};

	/**
	 * 将节点变更为编辑状态
	 * @param node
	 */
	upateNodeEditing = node => {
		this.treeMap.store.updateById(node.id, { isEditing: true });
	};

	/**
	 * 增加一个输入节点
	 * @param parentNode: 父节点
	 */
	addBlankNode = parentNode => {
		// 新增的节点，无id
		const blankNode = {name: '', pId: parentNode.id, level: parentNode.level + 1, isEditing: true};

		this.treeMap.store.addChild(parentNode.id, blankNode);
	};

	/**
	 * 获取菜单项
	 */
	getContextMenus() {
		const menuList = [];
		this.treeMap.handler.onAddAction && menuList.push({
			name: '新增', click: node => {
				this.addBlankNode(node);
			}
		});

		this.treeMap.handler.onRemoveAction && menuList.push({
			name: '删除', click: node => {
				this.removeNode(node);
			}
		});

		this.treeMap.handler.onRenameAction && menuList.push({
			name: '重命名', click: node => {
				this.upateNodeEditing(node);
			}
		});
		return menuList;
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
