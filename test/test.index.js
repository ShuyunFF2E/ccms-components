/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-04-21
 */

import angular from 'angular';
import 'angular-mocks';

// init injector
document.body.innerHTML = '<body ng-app></body>';
angular.bootstrap(document.body);

const context = require.context('../src', true, /\/__tests__\/test-.*\.js$/);
context.keys().forEach(context);
