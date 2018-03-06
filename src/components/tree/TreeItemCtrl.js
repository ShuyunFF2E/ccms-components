export default class TreeItemCtrl {
	constructor() {
		this.showChildren = true;
		// this.data.checked = false;
		// this.data.partial = true;
		// this.data.parentId = this.parentId;
	}

	isLeaf(treeItem) {
		return !treeItem.children || treeItem.children.length === 0;
	}
}
