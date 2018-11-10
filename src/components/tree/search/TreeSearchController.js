import Store from '../Store';
export default class TreeSearchController {
	searchText = '';

	/**
	 * 搜索事件
	 */
	onSearch() {
		Store.filterText = this.searchText;
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
