import classes from '../index.scss';
import Inject from 'angular-es-utils/decorators/Inject';
import bind from 'lodash-decorators/bind';

@Inject('$ccTips')
export default class TreeNodeController {

	classes = classes;

	constructor() {
		this.name = this.node.name;
	}

	get paddingLeft() {
		const toggleIconWidth = 12;
		const levelWidth = 15;
		const paddingLeft = (this.node.level - 2) * levelWidth;
		return `${paddingLeft + (this.node.children.length ? 0 : toggleIconWidth)}px`;
	}

	/**
	 *  一系列handler
	 */
	toggleExpandHandler(e) {
		e.stopPropagation();
		this.updateStatus({ isClosed: !this.node.isClosed });
	}

	clickHandler() {
		this.onSelected(this.node.id, this.node.name);
	}

	rightClickHandler($event) {
		this.onRightClicked(this.node, $event);
	}

	exitIconClickHander() {
		// 点击x之后，撤销更改。
		// 如果是新增节点，则删除该空白节点
		if (!this.node.id) {
			this.node.remove();
		} else {
			this.name = this.node.name;
			this.exitEditing();
		}
	}

	inputChangeHandler(event) {
		const isNewNode = !this.node.id;
		const enterHandler = isNewNode ? this.add : this.rename;

		switch (event.keyCode) {
			// enter
			case 13:
				enterHandler(this.name)
					.then(() => this.exitEditing())
					.catch(err => this._$ccTips.error(err.message));
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
		return this.onStatusUpdated(this.node.id, status);
	}

	@bind()
	add(name) {
		return this.onAdded(name);
	}

	@bind()
	rename(name) {
		return this.onRenamed(this.node.id, name);
	}

	@bind()
	exitEditing() {
		this.updateStatus({ isEditing: false });
	}

}
