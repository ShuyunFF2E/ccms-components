---
layout: docs
title: Form 表单校验组件
group: components
maintainer: kui.liu
---

## Contents

* toc
{:toc}

## 使用说明

表单校验组件基于angular的表单校验实现，validator／validators指令可以互相配合使用。

### 基本用法

form标签
{% highlight html %}
<form
    [validators="string"]
    [name="string"]
    [tooltip-type="string"]>

    <fieldset>
        <label for="...">xxx</label>
        <input
            ng-model="app.info"
            [validator="validator1,validator2"]
            [validator1-msg="string"]
            [validator2-msg="string"]>
    </fieldset>
    ...
</form>
{% endhighlight %}

非form标签
{% highlight html %}
<div
    validators="string"
    [ng-form="string"]
    [name="string"]
    [tooltip-type="string"]>

    <fieldset>
        <label for="...">xxx</label>
        <input
            ng-model="app.info"
            [validator="validator1,validator2"]
            [validator1-msg="string"]
            [validator2-msg="string"]>
    </fieldset>
    ...
</div>
{% endhighlight %}

### 参数说明

#### validators 指令

|参数|类型|说明|
|-------|--------|--------|
| validators|string|表单关联的校验器,为空则使用内置校验器(见下文)。当使用form标签作为表单时,此配置可选|
| name(可选)  |string|表单控制器名称,供手动校验表单时使用|
| ng-form(可选)  |string|ngForm指令|
| tooltip-type(可选)  |string|校验提示的展现形式。minor: 默认以tooltip的形式展示，应用于表单比较紧凑空间不足的场景;major: 空间足够则以输入框后追加文字提示信息的方式展示错误信息。 默认为minor|

{% callout info %}
当angular内置的校验器够用时，不需要在表单上使用`validators`指令声明，直接在输入控件上用`validator`即可，且validator不需要做任何初始化。
{% highlight html %}
<form>
    <!-- 对该输入同时开启email/required/minlength 校验 -->
    <input ng-model="app.userName" type="email" required minlength="3" validator>
</form>
{% endhighlight %}
{% endcallout %}

{% callout info %}
组件库会自动禁用浏览器自带的validate交互，即默认给表单设置了novalidate=true。
{% endcallout %}

#### validator 指令(require)

声明当前输入控件需要启用校验逻辑，可以配合validators实现自定义表单校验功能。

|参数|类型|说明|
|-------|--------|--------|
| validator|string|声明当前输入关联的校验器，与angular内置校验器互相配合使用(如required、minlength等)，可以为空。多个校验器之间以`,`隔开|
| `${validator}-msg`(可选)  |string|当前校验器的局部校验信息,格式为 校验器名 + '-msg', 如 required-msg="屌大的都会自觉填东西!" |

##### example
{% highlight html %}
<input ng-model="app.userName" type="text" validator="handsome, word" handsome-msg="不够帅啊同学!" word-msg="填单词啊同学!">
{% endhighlight %}

{% callout info %}
validator校验触发时机为 model 更新的时机,如果默认model更新时机(input)不能满足需求,可配合`ng-model-options`指令控制。如
{% highlight html %}
<input ng-model="app.userName" ng-model-options="{updateOn:'blur'}" required validator type="text">
{% endhighlight %}

{% endcallout %}

### Form配套服务

* $Validator(service)

    Methods

    * $Validator.validate(formCtrl)

	  手动校验表单

	  参数：formCtrl `Controller` 表单控制器，通过在表单上声明name绑定

		```
		$Validator.validate(formCtrl).then(() => console.log('校验成功！')).catch(() => console.log('校验失败！'));
		```

	  return `Promise` 校验通过触发resolve，失败触发reject

	* $Validator.setPristine(formCtrl)
	    清除当前表单校验状态
		参数：formCtrl `Controller` 表单控制器，通过在表单上声明name绑定

		```
		$Validator.setPristine(formCtrl);
		```

### 内置的校验器(对应angular内置的validator)
* required: '必填'
* email: '邮件格式不合法',
* max: '输入值过大',
* maxlength: '输入值太长',
* min: '输入值过小',
* minlength: '输入值太短',
* number: '不合法的数字',
* pattern: '不合法的格式',
* url: '不合法的url',
* date: '不合法的日期',
* datetimelocal: '不合法的本地日期',
* time: '不合法的时间',
* week: '不合法的星期值',
* month: '不合法的月份值'

## Examples

{% highlight html %}
<form class="form-wrapper" tooltip-type="major" name="app.formName">
    <fieldset>
        <label for="info">姓名(必填)</label><input type="text" id="info" ng-model="app.info" validator required placeholder="必填">
    </fieldset>
    <fieldset>
        <label for="info1">邮箱</label><input type="email" id="info1" ng-model="app.info1" required validator placeholder="邮箱格式">
    </fieldset>
    <fieldset>
        <label for="info2">禁用</label><input type="text" id="info2" disabled value="数云上海">
    </fieldset>

    <fieldset>
        <label for="info3">长度需大于3</label><input type="text" id="info3" class="error" validator ng-model="app.info3" minlength="3">
    </fieldset>

    <fieldset>
        <button type="submit" ng-click="app.reset()">重置</button>
    </fieldset>

</form>
{% endhighlight %}

<iframe width="100%" height="800" src="//jsfiddle.net/Kuitos/qthn7y6k/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>
