---
layout: docs
title: Checkbox
group: components
maintainer: jianzhe.ding
---

## Contents

* toc
{:toc}

## Support Attribute

* ng-model `Any` [Ref Angular Doc](https://docs.angularjs.org)
* ng-checked `boolean` [Ref Angular Doc](https://docs.angularjs.org)
* ng-disabled `boolean` (default: false) [Ref Angular Doc](https://docs.angularjs.org)
* ng-true-value `Any` (default: true) [Ref Angular Doc](https://docs.angularjs.org)
* ng-false-value `Any` (default: false) [Ref Angular Doc](https://docs.angularjs.org)
* indeterminate `boolean` (default: false) 半选状态

## Note
* ng-checked should not use with ng-model.
* ng-checked is only used to display that will not be changed by clicking check box. if you want to get the status of checkbox, you should change ng-checked into ng-value.
* DO NOT use ng-bind.

## Examples

<iframe width="100%" height="400" src="//jsfiddle.net/Disciple_D/bcm0h2au/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
