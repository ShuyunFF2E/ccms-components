---
layout: docs
title: Modal
group: components
---

{% callout warning %}
这篇文档的细节须要补充。
{% endcallout %}

## Contents

* Will be replaced with the ToC, excluding the "Contents" header
{:toc}

## Examples

<script src="{{ site.baseurl }}/demos/modal/modal.js"></script>

<div ng-app="demos.modal" ng-controller="ctrl as Ctrl">

{% example html%}
<button type="button" ng-click="openBase()">open base modal</button>
<button type="button" ng-click="open()">open modal</button>
<button type="button" ng-click="confirm()">confirm</button>
{% endexample %}

</div>
