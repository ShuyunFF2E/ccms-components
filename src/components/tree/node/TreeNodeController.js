import '../index.scss';
import Inject from 'angular-es-utils/decorators/Inject';

@Inject('$ccTips', '$scope', '$timeout')
export default class TreeNodeController {
	constructor() {
		// 正在与后端进行通迅(新增、修改中)
		this.connecting = false;

		// 节点类型
		// 1.radio: 单选; 2.checkbox: 多选; 3.text 文本;
		this.nodeType = this.supportCheckbox ? (this.isRadioModel ? 'radio' : 'checkbox') : 'text';

		// 当更改为编辑状态时，重置名称
		this._$scope.$watch('$ctrl.node.isEditing', newVlaue => {
			if (newVlaue) {
				this.name = this.node.name;
			}
		});
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
	 * 更新正在通信状态
	 * @param connecting
	 */
	updateConnecting(connecting) {
		this._$timeout(() => {
			this.connecting = connecting;
		});
	}
	/**
	 *  切换子节点折叠状态
	 */
	toggleExpandHandler(e) {
		e.stopPropagation();
		this.treeMap.store.updateById(this.node.id, { isClosed: !this.node.isClosed });
	}

	/**
	 * 事件: 选择事件
	 * @param type
	 */
	onChangeChecked(type) {
		this.treeMap.store.updateActiveNode(this.node);

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
				!this.connecting && this.onEditorNode();
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
	 * 检查节点名称是否可用
	 * @param name
	 * @param nowId: 仅在编辑时传入，存在时验证时增加条件 sameNameNode.id === nowId
	 * @returns promise
	 */
	checkName(name, nowId) {
		return new Promise((reslove, reject) => {
			name = name.trim();
			if (!name) {
				reject('名称不能为空!');
			}

			// 验证特殊字符
			if (!/^[a-zA-Z0-9_\u4e00-\u9fa5]+$/.test(name)) {
				reject('名称中存在特殊字符!');
			}

			// 验证长度
			if (name.length > this.nodeMaxLen) {
				reject(`名称的最大长度为${this.nodeMaxLen}!`);
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
		return this.checkName(name).then(() => {
			this.updateConnecting(true);
			const parentNode = this.treeMap.store.activeNode;
			this.treeMap.handler.onAddAction && this.treeMap.handler.onAddAction(parentNode.id, name)
				.then(({id}) => {
					// 后端返回id后将id赋值给当前Node
					this.treeMap.store.updateByEditing({ id, name, isEditing: false });
					this.updateConnecting(false);
				})
				.catch(msg => {
					this._$ccTips.error(msg || '新增失败，请重试');
					this.updateConnecting(false);
				});
		}, msg => {
			this._$ccTips.error(msg);
		});
	};

	/**
	 * 更新节点
	 * @param newName
	 * @returns {*}
	 */
	updateHandler = newName => {
		const { id } = this.node;
		return this.checkName(newName, id).then(() => {
			this.updateConnecting(true);
			this.treeMap.handler.onRenameAction && this.treeMap.handler.onRenameAction(this.node, newName)
				.then(() => {
					// 更新成功后，清除正在编辑状态
					this.treeMap.store.updateByEditing({ name: newName, isEditing: false });
					this.updateConnecting(false);
				})
				.catch(msg => {
					this._$ccTips.error(msg || '重命名失败，请重试');
					this.updateConnecting(false);
				});
		}, msg => {
			this._$ccTips.error(msg);
		});
	};

	/**
	 * 退出编辑状态
	 */
	exitEditing() {
		this.treeMap.store.updateById(this.node.id, { isEditing: false });
	}
}
