---
layout: docs
title: Date Picker
group: components
redirect_from: "/components/"
---

## 输入单个日期

指令：date-picker

参数说明：

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| ng-model | 日期值 | Date | |
| min-date | 在此日期之后 | Date | |
| max-date | 在此日期之前 | Date | |
| date-only | 为 true 时仅能输入日期，不能填写时间 | Boolean | false |
| required | 是否为必填 | Boolean | false |
| disabled | 是否为禁用 | Boolean | false |

{% highlight html %}
<date-picker ng-model="dateValue"
             min-date="minDate"
             max-date="maxDate"
             date-only="false"
             required="true"
             disabled="false"></date-picker>
{% endhighlight %}

### 选择日期范围

指令：date-range

参数说明：

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| start | 开始时间 | Date | |
| end | 结束时间 | Date | |
| minDate | 开始时间必须在此日期之后 | Date | |
| maxDate | 结束时间在此日期之前 | Date | |
| dateOnly | 为 true 时仅能输入日期，不能填写时间 | Boolean | false |
| required | 是否为必填 | Boolean | false |
| disabled | 是否为禁用 | Boolean | false |

{% highlight html %}
<date-range opts="dateRange"></date-range>
{% endhighlight %}

{% highlight javascript %}
$scope.dateRange = {
  start: new Date(2016, 2, 10),
  end: new Date(2016, 2, 20),

  minDate: new Date(2016, 2, 1),
  maxDate: new Date(2016, 2, 31),

  // 是否禁用 (false)
  disabled: false,

  // 是否显示时间 (true)
  dateOnly: false
};
{% endhighlight %}


### examples

基础表格:

<iframe width="100%" height="300" src="//jsfiddle.net/Corvine/b8z1wnb7/embedded/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
