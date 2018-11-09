 
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

# 回调函数
onClickAction: 节点点击事件
onRemoveAction: 节点删除事件, 需要返回promise
onAddAction: 新增节点事件, 需要返回promise
onRenameAction: 节点重命名事件, 需要返回promise
