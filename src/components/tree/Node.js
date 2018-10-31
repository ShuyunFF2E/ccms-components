export class Node {

	id;
	name;
	children;
	parent;

	constructor({ id, pId, name, children = [], ...option } = {}) {
		this.id = id;
		this.name = name;
		this.pId = pId;
		this.children = children.map(child => new Node(child));

		Object.assign(this, option);
	}

	get level() {
		let parentTmp = this.parent;
		let level = 1;
		while (parentTmp) {
			parentTmp = parentTmp.parent;
			level++;
		}
		return level;
	}

	findChild(id) {
		return this.findChildByParam('id', id);
	}

	findChildByParam(param, value) {
		if (this[param] === value) {
			return this;
		}

		let node = this.children.find(child => child[param] === value);
		if (!node) {
			this.children.some(childNode => node = childNode.findChildByParam(param, value));
		}
		return node;
	}

	addChild(node, index) {
		index = index || this.children.length;
		this.children.splice(index, 0, node);
	}

	removeChild(nodeId) {
		this.children.forEach((child, index) => {
			if (child.id === nodeId) {
				this.children.splice(index, 1);
			}
		});
	}

	update(updatePart) {
		Object.assign(this, updatePart);
	}
}
