import angular from 'angular';

export default class TreeCtrl {
	constructor() {
		// 存储所有 tree Items 上的 scope
		this.scopes = [];
	}

	// 清除已选 tree Items
	clearSelected() {
		this.scopes.forEach(scope => {
			scope.$ctrl.selected = false;
		});
	}

	clickTreeItem($event) {
		const target = $event.target;
		const treeItemScope = angular.element(target).scope();
		if (target.classList.contains('treeLabel')) {
			if (!this.hasCheckbox) {
				this.clearSelected();
				treeItemScope.$ctrl.selected = true;
				this.onSelected && this.onSelected({item: treeItemScope.$ctrl.data});
			} else {
				this.handleTreeCheckbox(treeItemScope.$parent.$parent.$ctrl.data);
				this.onSelected && this.onSelected({item: treeItemScope.$parent.$parent.$ctrl.data});
			}
		}

		if (target.classList.contains('cc-checkbox-input')) {
			this.handleTreeCheckbox(treeItemScope.$parent.$ctrl.data);
			this.onSelected && this.onSelected({item: treeItemScope.$parent.$ctrl.data});
		}

		if (target.classList.contains('treeArrow')) {
			treeItemScope.$ctrl.showChildren = !treeItemScope.$ctrl.showChildren;
		}
	}

	// 处理树上 checkbox 的状态
	handleTreeCheckbox(treeItemData) {
		const treeItemChecked = treeItemData.checked;
		// 处理 child items
		this.checkChildItems(treeItemData, treeItemChecked);
		// 处理 parent items
		this.checkParentItems(this.data, treeItemData.parentId);
	}

	// 递归 child item, 对相应的节点 checkbox 状态赋值
	checkChildItems(treeItemData, checked) {
		treeItemData.children && treeItemData.children.forEach(child => {
			child.checked = checked;
			child.partial = false;
			this.checkChildItems(child, checked);
		});
	}

	// 递归 查找 parent items, 根据 child items 的状态判断 parent item checkbox 状态
	checkParentItems(data, parentId) {
		data && data.forEach(treeItemData => {
			if (treeItemData.id === parentId) {
				treeItemData.checked = this.isAllChildrenChecked(treeItemData.children);
				if (!treeItemData.checked) {
					treeItemData.partial = this.isSomeChildrenChecked(treeItemData.children);
				} else {
					treeItemData.partial = false;
				}
				this.checkParentItems(this.data, treeItemData.parentId);
			} else {
				this.checkParentItems(treeItemData.children, parentId);
			}
		});
	}

	isAllChildrenChecked(children) {
		return children && children.every(child => {
			return child.checked;
		});
	}

	isSomeChildrenChecked(children) {
		return children && children.some(child => {
			return child.checked || child.partial;
		});
	}
}
