/**
 * Created with test-MenusNodeCtrl.js.js
 * @Author: maxsmu
 * @Homepage: https://github.com/maxsmu
 * @Date: 2016-09-01 10:06 AM
 */
"use strict";

import {assert} from 'chai';
import angular from 'angular';


describe('MenuNode Component', () => {

	const bindings = {
		list: [],
		toggle: true,
		level: 0,
		ngIf: true
	};

	let $componentController;

	beforeEach(angular.mock.module('app'));

	beforeEach(angular.mock.inject((_$componentController_) => {
		$componentController = _$componentController_;
	}));


});
