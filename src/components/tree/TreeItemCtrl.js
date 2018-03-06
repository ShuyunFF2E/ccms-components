export default class TreeItemCtrl {
	constructor() {
		this.showChildren = true;
		this.data.partial = false;
		this.data.checked = false;
		this.data.parentId = this.parentId;
	}

	isLeaf(treeItem) {
		return !treeItem.children || treeItem.children.length === 0;
	}
}
