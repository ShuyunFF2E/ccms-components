/**
 * 事件回调处理器
 */
class Handler {
	constructor(treeObject) {
		this.init(treeObject);
	}
	/**
	 * 配置事件回调
	 * @param name
	 * @param callback
	 */
	init(treeObject) {
		// 选中事件
		this.onSelectedAction = treeObject.onSelectedAction;

		// 右键事件: 新增节点事件
		this.onAddAction = treeObject.onAddAction;

		// 右键事件: 节点删除事件
		this.onRemoveAction = treeObject.onRemoveAction;

		// 右键事件: 节点重命名事件
		this.onRenameAction = treeObject.onRenameAction;
	}
}

export default Handler;
