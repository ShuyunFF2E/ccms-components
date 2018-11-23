import classes from '../index.scss';
import Inject from 'angular-es-utils/decorators/Inject';
import Store from '../Store';
import Handler from '../Handler';

@Inject('$ccTips', '$scope')
export default class TreeNodeController {

	classes = classes;

	constructor() {
		this.name = this.node.name;
	}

	/**
	 * 获取节点的padding-left值, 用于生成层级
	 * @returns {string}
	 */
	get paddingLeft() {
		const toggleIconWidth = 12;
		const levelWidth = 15;
		const paddingLeft = this.node.level * levelWidth;
		return `${paddingLeft + (this.node.children && this.node.children.length ? 0 : toggleIconWidth)}px`;
	}

	/**
	 *  切换子节点折叠状态
	 */
	toggleExpandHandler(e) {
		e.stopPropagation();
		this.updateStatus({ isClosed: !this.node.isClosed });
	}

	/**
	 * 节点点击事件
	 * @param $event
	 */
	onClick($event) {
		// this.onSelected(this.node, $event);
		Store.updateSelectedNode(this.node);

		// const node = Store.selectedNode;
		Handler.onClickAction && Handler.onClickAction(this.node);
	}

	/**
	 * 事件: 选择事件
	 */
	onChangeChecked() {
		const { checked, children, pId } = this.node;

		// 变更子项选中状态
		const changeChildren = children => {
			children.forEach(item => {
				item.checked = checked;
				const itemChildren = item.children;
				if (itemChildren && itemChildren.length > 0) {
					changeChildren(itemChildren);
				}
			});
		};

		// 变更父项选中状态
		const changeParent = parentId => {
			const parentNode = Store.findNodeById(parentId);
			if (!parentNode) {
				return;
			}
			let childrenCheckedNumber = 0;
			parentNode.children.forEach(item => {
				item.checked && childrenCheckedNumber++;
			});

			// 子项全部都未选中
			if (childrenCheckedNumber === 0) {
				parentNode.checked = false;
			} else if (childrenCheckedNumber === parentNode.children.length) {
				// 子选项全部选中
				parentNode.checked = true;
			} else {
				// 子选项部分选中
				parentNode.checked = 'indeterminate';
			}

			if (parentNode.pId) {
				changeParent(parentNode.pId);
			}
		};

		changeChildren(children || []);
		changeParent(pId);
	}

	/**
	 * 右键事件
	 * @param $event
	 */
	onRightClick($event) {
		this.onOpenMenu(this.node, $event);
	}

	/**
	 * 点击x之后，撤销更改。
	 */
	onExitIconClickHander() {
		// 如果是新增节点，则删除该空白节点
		if (!this.node.id) {
			Store.removeChild(this.node);
		} else {
			this.name = this.node.name;
			this.exitEditing();
		}
	}

	/**
	 * 输入框输入事件
	 * @param event
	 */
	onInputChangeHandler(event) {
		const isNewNode = !this.node.id;
		const enterHandler = isNewNode ? this.insertHandler : this.updateHandler;

		switch (event.keyCode) {
			// enter
			case 13:
				enterHandler(this.name);
				break;
			// esc
			case 27:
				this.exitEditing();
				break;
			default:
				break;
		}
	}

	/**
	 * 一系列内部方法
	 */
	updateStatus(status) {
		return Store.updateById(this.node.id, status);
	}

	/**
	 * 检查是否存在同名节点
	 * @param name
	 * @param nowId: 仅在编辑时传入，存在时验证时增加条件 sameNameNode.id === nowId
	 * @returns promise
	 */
	checkSameName(name, nowId) {
		return new Promise((reslove, reject) => {
			if (!name.trim()) {
				reject('名称不能为空!');
			}
			const sameNameNode = Store.findNodeByParam('name', name);
			if (!sameNameNode || sameNameNode.id === nowId) {
				reslove();
			} else {
				reject('名称已存在!');
			}
		});
	}

	/**
	 * 插入节点
	 * @param name
	 * @returns {*}
	 */
	insertHandler = name => {
		return this.checkSameName(name).then(() => {
			const parentNode = Store.selectedNode;
			Handler.onAddAction	&& Handler.onAddAction(parentNode.id, name)
				.then(({id}) => {
					// 后端返回id后将id赋值给当前Node
					Store.updateByEditing({ id, name, isEditing: false });
					this._$scope.$digest();
				})
				.catch(msg => {
					this._$ccTips.error(msg || '新增失败，请重试');
				});
		}, msg => {
			this._$ccTips.error(msg);
		});
	};

	/**
	 * 更新节点
	 * @param name
	 * @returns {*}
	 */
	updateHandler = name => {
		const { id } = this.node;
		this.checkSameName(name, id).then(() => {
			Handler.onRenameAction && Handler.onRenameAction(this.node)
				.then(() => {
					// 更新成功后，清除正在编辑状态
					Store.updateByEditing({ name, isEditing: false });
					this._$scope.$digest();
				})
				.catch(msg => {
					this._$ccTips.error(msg || '重命名失败，请重试');
				});
		}, msg => {
			this._$ccTips.error(msg);
		});
	};

	exitEditing = () => {
		this.updateStatus({ isEditing: false });
	};
}
