export default class TreeSearchController {
	searchText = '';
	constructor() {
		this.searchMaxLen = this.searchMaxLen || 100;
		console.log(this.searchMaxLen);
	}

	/**
	 * 搜索事件
	 */
	onSearch() {
		this.onDone({searchText: this.searchText});
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
