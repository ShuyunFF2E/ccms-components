# cc-tree
## 配置项
### 配置项列表
- data: 渲染所需数据 `Array`
```
const data = [
	{
		id: 1,
		pId: 0,
		name: 'name',
		children: [],
		checked: false,   // 是否处于被选中状态 `非必填项`
		isClosed: false,  // 是否为闭合状态  `非必填项`
		disableAdd: false, // 该节点禁止新增功能 `非必填项`
		disableRemove: false, // 该节点禁止删除功能 `非必填项`
		disableRename: false, // 该节点禁止重命名功能 `非必填项`
	}
];
```
- searchPlaceholder: 搜索区域为空提示 `String`
- searchMaxLen: 搜索区域最大字符数 `Number`
- maxLevel: 最大可新增层级，只有小于该数值的节点才可以新增节点 `Number`
- supportMenu: 是否支持右键菜单功能 `Boolean`
- supportSearch: 是否支持搜索功能 `Boolean`
- supportCheckbox: 是否支持选择功能 `Boolean`
- isRadioModel: 是否为单选模试, 仅在supportCheckbox为true时生效 `Boolean`
- hideRadioModel: 单选时是否隐藏单选icon `Boolean`
- addToPosition: 新节点添加后所在的位置 `String` 1.`after`, 2.`before` 默认值`after`
- nodeMaxLen: 节点名称最大长度 `String` 默认值`20`

### 事件列表

- onSelectedAction: 节点选中事件 `Function` 
```
/**
 * 节点点击事件
 * @param node: 当前选择的节点对象
 * @param selectedList: 当前选中的节点列表
 */
this.onSelectedAction = function(node, selectedList) {
	console.log(node, selectedList);
};
```

- onDoubleClickAction: 节点双击事件 `Function` 
```
/**
 * 节点双击事件
 * @param node: 当前选择的节点对象
 */
this.onDoubleClickAction = function(node) {
	console.log(node);
};
```

- onAddAction: 新增节点事件, 需要返回promise `Function` `右键菜单事件`
```
/**
 * 节点新增事件
 * @param pId: 父节点
 * @param name: 新增的节点名称
 * @param node: 将要删除的节点对象
 * @returns promise: resolve中需要返回包含id字段的对象
 */
this.onAddAction = function(pId, name) {
	return new Promise((resolve, reject) => {
		resolve({id: Math.random()});
	});
};
```

- onRemoveAction: 节点删除事件, 需要返回promise `Function` `右键菜单事件`
```
/**
 * 节点删除事件
 * @param node: 将要删除的节点对象
 * @returns promise
 */
this.onRemoveAction = function(node) {
	return new Promise((resolve, reject) => {
		resolve();
		// reject('该节点不允许删除');
	});
};
```

- onRenameAction: 节点重命名事件, 需要返回promise `Function` `右键菜单事件`
```
/**
 * 节点重命名事件
 * @param node: 将要重命名的节点对象
 * @param newName: 变更的名称
 * @returns promise
 */
this.onRenameAction = function(node, newName) {
	return new Promise((resolve, reject) => {
		resolve();
		// reject('重命名失败了');
	});
};
```



### 关于右键菜单
使用右键菜单需要配置参数`supportMenu`，右键菜单相对应的事件名称：
- 新增: `onAddAction`
- 删除: `onRemoveAction`
- 重命名: `onRemoveAction`

需要注意的是: 右健菜单事件，未配置的项将不在菜单中展示。且所有项都未配置，则右键菜单将不显示。

