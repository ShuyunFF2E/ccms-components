import angular from 'angular';

export default class TabsCtrl {
	constructor() {
		this.panes = [];
	}

	select(pane) {
		angular.forEach(this.panes, p => {
			p.selected = false;
		});
		pane.selected = true;
	}

	addPane(pane) {
		if (this.panes.length === 0) {
			this.select(pane);
		}
		this.panes.push(pane);
	}
}
