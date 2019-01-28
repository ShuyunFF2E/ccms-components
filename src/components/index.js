/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */

import angular from 'angular';

import altSrc from './alt-src';
import calendar from './calendar';
import captureEvent from './capture-event';
import checkbox from './checkbox';
import datePicker from './date-picker';
import dateRange from './date-range';
import dropdown from './dropdown';
import dropdownMultiselect from './dropdown/dropdown-multiselect';
import dropdownSelect from './dropdown/dropdown-select';
import form from './form';
import grid from './grid';
import instantSearch from './instant-search';
import loading from './loading';
import menuBar from './menus';
import modal from './modal';
import ngEnter from './ng-enter';
import niceScroll from './nice-scroll';
import pagination from './pagination';
import radio from './radio';
import tabset from './tabset';
import tips from './tips';
import toggle from './toggle';
import tooltip from './tooltip';
import tree from './tree';

export default angular
	.module('ccms.components.ui', [
		altSrc,
		calendar,
		captureEvent,
		checkbox,
		datePicker,
		dateRange,
		dropdown,
		dropdownMultiselect,
		dropdownSelect,
		form,
		grid,
		instantSearch,
		loading,
		menuBar,
		modal,
		ngEnter,
		niceScroll,
		pagination,
		radio,
		tabset,
		tips,
		toggle,
		tooltip,
		tree
	])
	.name;

