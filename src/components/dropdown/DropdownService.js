/**
 * 全局记录打开的 dropdown 实例，处理自动关闭行为
 * 以单例模式使用
 */
class DropdownService {
	constructor() {
		this.lastDropdownCtrl = null;
		this.closeFn = null;
	}

	open(dropdownCtrl) {
		let scope = dropdownCtrl.getScope();
		// 关闭之前的下拉
		if (this.lastDropdownCtrl) {
			this.closeFn();
		}

		// 为需要自动关闭的下拉注册处理事件
		if (dropdownCtrl.autoClose === 'enabled') {
			// 点击下拉自身内容阻止触发自动关闭
			let element = dropdownCtrl.getElement();
			let clickSelfFn = event => {
				event.stopPropagation();
			};
			element.addEventListener('click', clickSelfFn);

			this.lastDropdownCtrl = dropdownCtrl;
			this.closeFn = () => {
				element.removeEventListener('click', clickSelfFn);
				this.close(this.lastDropdownCtrl);
			};
			document.addEventListener('click', this.closeFn);
		}

		// 打开下拉
		dropdownCtrl.open();
		scope.$root.$$phase || scope.$apply();
	}

	close(dropdownCtrl) {
		let scope = dropdownCtrl.getScope();
		if (dropdownCtrl.autoClose === 'enabled') {
			document.removeEventListener('click', this.closeFn);
			this.lastDropdownCtrl = null;
			this.closeFn = null;
		}
		dropdownCtrl.close();
		scope.$root.$$phase || scope.$apply();
	}
}

export default new DropdownService();

