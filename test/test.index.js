/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-04-21
 */

import angular from 'angular';
import ngResource from 'angular-resource';
import 'angular-mocks';
import components from '../src';
// init injector
document.body.innerHTML = '<body ng-app="app"></body>';
angular.module('app', [components, ngResource]);
angular.bootstrap(document.body);

const context = require.context('../src', true, /\/__tests__\/test-.*\.js$/);
context.keys().forEach(context);

// require all `src/**/index.js`
const appContext = require.context('../src', true, /[A-Z]+.*\.js$/);
appContext.keys().forEach(appContext);
