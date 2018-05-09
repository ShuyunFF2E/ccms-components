export default class TreeItemCtrl {
	constructor() {
		this.showChildren = true;
	}

	isLeaf(treeItem) {
		return !treeItem.children || treeItem.children.length === 0;
	}
}
