export default class TabsCtrl {
	constructor() {
		this.panes = [];
	}

	select(nextPane) {
		let currentPane = {};
		for (let i = 0; i < this.panes.length; i++) {
			if (this.panes[i].selected) {
				currentPane = this.panes[i];
				break;
			}
		}
		if (currentPane.text !== nextPane.text) {
			nextPane.tabClick && nextPane.tabClick({text: nextPane.text});
			nextPane.selected = true;
			currentPane.selected = false;
		}

	}

	addPane(pane) {
		this.panes.push(pane);
		if (this.panes.length === 1) {
			pane.selected = true;
		}
	}
}
