/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-04
 */

import angular from 'angular';

import grid from './grid';
import pagination from './pagination';
import smsEditor from './sms-editor';
import smsPreview from './sms-preview';
import tooltip from './tooltip';
import ngEnter from './ng-enter';
import loading from './loading';
import modal from './modal';
import menuBar from './menus';
import datePicker from './date-picker';
import dateRange from './date-range';
import calendar from './calendar';
import tips from './tips';
import form from './form';
import checkbox from './checkbox';
import instantSearch from './instant-search';
import dropdown from './dropdown';
import dropdownSelect from './dropdown/dropdown-select';
import dropdownMultiselect from './dropdown/dropdown-multiselect';
import tabset from './tabset';
import radio from './radio';
import switchButton from './switch';
import customerProfileBoard from './customer-profile-board';

export default angular
	.module('ccms.components.ui', [
		dropdown,
		dropdownSelect,
		dropdownMultiselect,
		instantSearch,
		checkbox,
		form,
		grid,
		pagination,
		smsEditor,
		smsPreview,
		tooltip,
		ngEnter,
		loading,
		menuBar,
		modal,
		tips,
		datePicker,
		dateRange,
		calendar,
		tabset,
		radio,
		switchButton,
		customerProfileBoard
	])
	.name;

