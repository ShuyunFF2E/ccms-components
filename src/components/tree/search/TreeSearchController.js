export default class TreeSearchController {
	searchText = '';

	/**
	 * 搜索事件
	 */
	onSearch() {
		this.treeMap.store.filterText = this.searchText;
	}

	/**
	 * 输入框输入事件
	 * @param event
	 */
	onInputChangeHandler(event) {
		// 回车事件
		if (event.keyCode === 13) {
			this.onSearch();
		}
	}

}
