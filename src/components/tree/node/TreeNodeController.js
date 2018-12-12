import '../index.scss';
import Inject from 'angular-es-utils/decorators/Inject';

@Inject('$ccTips', '$scope', '$timeout')
export default class TreeNodeController {
	constructor() {
		this.name = this.node.name;

		// 节点类型
		// 1.radio: 单选; 2.checkbox: 多选; 3.text 文本;
		this.nodeType = this.supportCheckbox ? (this.isRadioModel ? 'radio' : 'checkbox') : 'text';
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
	 * 节点文本
	 * @returns {*}
	 */
	get nodeText() {
		const searchText = this.treeMap.searchText;
		return searchText ? this.name.replace(searchText, `<span class="hot-text">${searchText}</span>`) : this.node.name;
	}

	/**
	 *  切换子节点折叠状态
	 */
	toggleExpandHandler(e) {
		e.stopPropagation();
		this.updateStatus({ isClosed: !this.node.isClosed });
	}

	/**
	 * 事件: 选择事件
	 * @param type
	 */
	onChangeChecked(type) {
		const { nodeType } = this;
		switch (nodeType) {
			case 'checkbox': {
				this.changeForCheckbox();
				break;
			}
			case 'radio': {
				this.changeForRadio();
				break;
			}
			case 'text': {
				this.changeForRadio();
				break;
			}
			default: {
				this.changeForRadio();
				break;
			}
		}

		// 执行选中事件
		this.treeMap.handler.onSelectedAction && this.treeMap.handler.onSelectedAction(this.node, this.treeMap.store.selectedNodes);
	}

	/**
	 * 单选类型选中
	 */
	changeForRadio() {
		// 清除之前的选中状态
		this.treeMap.store.selectedNodes.forEach(item => {
			item.checked = false;
		});
		this.node.checked = true;
	}

	/**
	 * 多选类型选中
	 */
	changeForCheckbox() {
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
			const parentNode = this.treeMap.store.findNodeById(parentId);

			if (!parentNode) {
				return;
			}
			let childrenCheckedNumber = 0;
			parentNode.children.forEach(item => {
				// checked存在三种情况: true, false, 'indeterminate', 所以这里需要与true进行比较
				item.checked === true && childrenCheckedNumber++;
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
			this.treeMap.store.removeChild(this.node);
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
		switch (event.keyCode) {
			// enter
			case 13:
				this.onEditorNode();
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
	 * 节点编辑保存事件
	 */
	onEditorNode() {
		const isNewNode = !this.node.id;
		const enterHandler = isNewNode ? this.insertHandler : this.updateHandler;
		enterHandler(this.name);
	}

	/**
	 * 一系列内部方法
	 */
	updateStatus(status) {
		return this.treeMap.store.updateById(this.node.id, status);
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
			const sameNameNode = this.treeMap.store.findNodeByParam('name', name);
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
			const parentNode = this.treeMap.store.activeNode;
			this.treeMap.handler.onAddAction && this.treeMap.handler.onAddAction(parentNode.id, name)
				.then(({id}) => {
					// 后端返回id后将id赋值给当前Node
					this._$timeout(() => {
						this.treeMap.store.updateByEditing({ id, name, isEditing: false });
					});
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
	updateHandler = newName => {
		const { id } = this.node;
		this.checkSameName(newName, id).then(() => {
			this.treeMap.handler.onRenameAction && this.treeMap.handler.onRenameAction(this.node, newName)
				.then(() => {
					// 更新成功后，清除正在编辑状态
					this._$timeout(() => {
						this.treeMap.store.updateByEditing({ newName, isEditing: false });
					});
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
