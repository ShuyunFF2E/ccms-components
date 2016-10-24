/**
 * Created by AshZhang on 2016-3-4.
 */


import './_date-range.scss';
import template from './date-range.tpl.html';
import DateRangeCtrl from './DateRangeCtrl';


export default {

	bindToController: true,
	controller: DateRangeCtrl,
	controllerAs: 'ctrl',
	replace: true,
	restrict: 'E',
	scope: {
		opts: '='
	},
	template
};
