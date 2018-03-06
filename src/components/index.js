/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */

import angular from 'angular';

import altSrc from './alt-src';
import areaSelector from './area-selector';
import calendar from './calendar';
import checkbox from './checkbox';
import customerProfileBoard from './customer-profile-board';
import datePicker from './date-picker';
import dateRange from './date-range';
import dropdown from './dropdown';
import dropdownMultiselect from './dropdown/dropdown-multiselect';
import dropdownSelect from './dropdown/dropdown-select';
import form from './form';
import grid from './grid';
import goodsSelector from './goods-selector';
import instantSearch from './instant-search';
import loading from './loading';
import menuBar from './menus';
import modal from './modal';
import ngEnter from './ng-enter';
import niceScroll from './nice-scroll';
import pagination from './pagination';
import radio from './radio';
import smsEditor from './sms-editor';
import smsPreview from './sms-preview';
import tabset from './tabset';
import tips from './tips';
import toggle from './toggle';
import tooltip from './tooltip';
import tree from './tree';

export default angular
	.module('ccms.components.ui', [
		altSrc,
		areaSelector,
		calendar,
		checkbox,
		customerProfileBoard,
		datePicker,
		dateRange,
		dropdown,
		dropdownMultiselect,
		dropdownSelect,
		form,
		grid,
		goodsSelector,
		instantSearch,
		loading,
		menuBar,
		modal,
		ngEnter,
		niceScroll,
		pagination,
		radio,
		smsEditor,
		smsPreview,
		tabset,
		tips,
		toggle,
		tooltip,
		tree
	])
	.name;

