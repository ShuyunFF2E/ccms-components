import Store from './Store';
import Handler from './Handler';

export default class TreeCtrl {
	// 搜索词
	searchText = '';

	// 存储树所需要的数据和事件
	treeMap = {};

	// 菜单hash值，用于在menu中监听菜单项的事件
	menuHash = 0;

	/**
	 * 事件：打开右键菜单
	 * @param node
	 */
	onOpenMenu = node => {
		this.activeNode = node;
		this.menuHash++;
	};

	/**
	 * 更新搜索词
	 * @param searchText
	 */
	updateSearchText(searchText) {
		this.treeMap.searchText	= searchText;
	}

	/**
	 * 初始化数据
	 * @param treeData
	 */
	initData(treeData, maxLevel) {
		this.treeMap.handler = new Handler(this);
		this.treeMap.store = new Store(treeData, maxLevel);
		this.treeData = this.treeMap.store.treeData;
	}

	$onChanges(changeObj) {
		const {data, maxLevel = {currentValue: undefined}} = changeObj;
		if (data && data.currentValue) {
			this.initData(data.currentValue, maxLevel.currentValue);
		}
	}
}
