/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-01-19
 */
import angular from 'angular';

import { version } from '../package.json';

import LogicComponents from './common/utils';
import UIComponents from './components';

const ccmsComponents = angular.module('ccms.components', [
	UIComponents,
	LogicComponents
]);

ccmsComponents.version = version;

export default ccmsComponents.name;

