 
 *  data: Object
    * id: number
    * name: string
    * children: Object[]
    * isClosed?: bool //是否开关状态, defalut: true
    * isEditing?: bool //是否正在编辑, defalut: false
    * isSelected?: bool //是否处于被选中状态, defalut: false
    * type?: string // 节点类型：['floder', 'checkbox', 'list string'], default: 'floder'
    * contextAction?: string[] // 右键事件：'add', 'remove', 'rename', defualt: []
    * questionStr?: string // 问号icon, defualt: ''


```
[
	{
		id: 121,
		name: 'miaomiaozhu0620',
		pId: 12,
		isClosed: false,
		isEditing: false,
		children: []
	}
]
```

# 参数
- data: 渲染所需数据 `Array`
```
const data = [
	{
		id: 1,
		name: 'name',
		children: [],
		isClosed: false,  // 是否为闭合状态
		isSelected: false   // 是否处于被选中状态
	}
];
```
- isRadioModel: 是否为单选模试 `Boolean`
- supportSearch: 是否支持搜索功能 `Boolean`
- supportCheckbox: 是否支持选择功能 `Boolean`
- onClickAction: 节点点击事件 `Function`

- onRemoveAction: 节点删除事件, 需要返回promise `Function` `右键菜单事件`
- onAddAction: 新增节点事件, 需要返回promise `Function` `右键菜单事件`
- onRenameAction: 节点重命名事件, 需要返回promise `Function` `右键菜单事件`


右健菜单事件，未配置的项将不在菜单中展示。如果所有项都有配置，则无右键菜单功能。

