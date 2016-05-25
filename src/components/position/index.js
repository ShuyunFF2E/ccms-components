/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-16
 */

import angular from 'angular';
import PositionService from './PositionService';

export default angular
	.module('ccms.components.position', [])
	.constant('Position', PositionService)
	.name;
