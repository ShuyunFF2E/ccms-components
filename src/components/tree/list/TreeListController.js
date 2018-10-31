import bind from 'lodash-decorators/bind';

export default class TreeCtrl {

	constructor() {
		this.level = this.level ? this.level : 1;
		this.filter = '';
	}

	hasChildren(node) {
		return node.children && node.children.length;
	}

	@bind()
	filterHandler(node) {
		const test = this._filterHandler(node, this.filter);
		return test;
	}

	_filterHandler(node, filterStr) {
		if (!filterStr) {
			return true;
		}
		if (node.name.includes(filterStr)) {
			return true;
		}
		if (node.children && node.children.length) {
			return node.children.some(child => this._filterHandler(child, filterStr));
		}
		return false;
	}

	@bind()
	rightClick(nodeId, event) {
		this.onRightClickAction(nodeId, event);
	}

}
