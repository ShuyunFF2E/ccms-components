/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-18
 */

export default class IndeterminateDirective {

	constructor() {
		this.restrict = 'A';
		this.scope = {
			indeterminate: '<'
		};
	}

	link(scope, element) {

		scope.$watch('indeterminate', value => {
			element[0].indeterminate = value;
		});

	}

}
