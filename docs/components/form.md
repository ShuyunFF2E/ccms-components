---
layout: docs
title: Form 表单校验组件
group: components
redirect_from: "/components/"
---

## Contents

* toc
{:toc}

## 基本用法

```
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
```

## Examples
<iframe width="100%" height="600" src="//jsfiddle.net/Kuitos/qthn7y6k/embedded/js,html,result/" allowfullscreen="allowfullscreen" frameborder="0"></iframe>

## Form校验使用说明

表单校验组件基于angular的表单校验实现，validator／validators指令可以互相配合使用。

#### validator 输入校验指令(require)

声明当前输入需要启用校验逻辑，可以配合validators实现自定义表单校验功能。

* validator `String`(default:'') 声明当前输入关联的校验器，与angular内置校验器互相配合使用(如required、minlength等)，可以为空。多个校验器之间以`,`隔开。

> Note  
> 当angular内置的校验器够用时，不需要在表单上使用`validators`指令声明，直接用validator即可，且validator不需要做任何初始化。
>
```html
<form>
	<!-- 对该输入同时开启email/required/minlength 校验 -->
	<input ng-model="app.userName" type="email" required minlength="3" validator>
</form>
```

#### validators 表单校验声明指令
在表单区域使用validators声明，即可对该表单区域开启校验交互。表单可以是form标签／ngForm属性区域，也可以是简单的div(div推荐配合ngForm使用).**开启表单校验必须使用form/ngForm/validators三个中其中任意一个指令声明。**

* validators `Object`(default:内置校验器) 当前表单支持的校验器。为空则使用组件库默认的校验器，用户可以添加新的校验逻辑或复写已有校验逻辑。
* tooltip-type `String`(default: 'minor') 表单错误提示的展示类型
	minor: 默认以tooltip的形式展示，应用于表单比较紧凑空间不足的场景
	major: 空间足够则以输入框后追加文字提示信息的方式展示错误信息

> Note  
> 组件库会自动禁用浏览器自带的validate交互，即默认给表单设置了novalidate=true。


#### 内置的校验器(对应angular内置的validator)
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

### Form配套服务

* $Validator(service)
	* validate 手动校验表单 return`Promise` 校验通过触发resolve，失败触发reject
		
		参数：formCtrl `Controller` 表单控制器，通过在表单上声明name绑定
	
		```
		$Validator.validate(formCtrl).then(() => console.log('校验成功！')).catch(() => console.log('校验失败！'));
		```
		
	* setPristine 清除当前表单校验状态
		参数：formCtrl `Controller` 表单控制器，通过在表单上声明name绑定
		
		```
		$Validator.setPristine(formCtrl);
		```
