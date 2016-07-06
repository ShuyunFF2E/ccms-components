/**
 * Created with index.js
 * @Description:
 * @Author: muchaoyang
 * @Date: 2016-06-01 10:34 AM
 * To change this template use File | Settings | File Templates.
 */
import angular from 'angular';
import TitleDirective from './TitleDirective';
export default angular
	.module('ccms.components.title', [])
	.component('navTitle', new TitleDirective())
	.name;
