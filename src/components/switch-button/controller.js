/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-06-06 11:41
 */

export default class SwitchButtonController {
	constructor() {
		const DEFAULT_OPTIONS = {
			openText: '开',
			closeText: '关',
			state: false
		};

		this.state = typeof this.state === 'undefined' ? DEFAULT_OPTIONS.state : !!this.state;
		this.openText = typeof this.openText === 'undefined' ? DEFAULT_OPTIONS.openText : this.openText;
		this.closeText = typeof this.closeText === 'undefined' ? DEFAULT_OPTIONS.closeText : this.closeText;
	}
}
