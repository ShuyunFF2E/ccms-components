/**
 * 全局记录打开的 dropdown 实例，处理自动关闭行为
 * 以单例模式使用
 */
class DropdownService {
	constructor() {
		this.lastDropdownCtrl = null;

		// 用于自动关闭 dropdown 的回调
		this.autoCloseFn = null;
	}

	open(dropdownCtrl) {
		// 关闭之前的下拉
		if (this.lastDropdownCtrl) {
			this.autoCloseFn();
		}

		// 为需要自动关闭的下拉注册处理事件
		if (dropdownCtrl.autoClose) {
			// 点击下拉自身内容阻止触发自动关闭
			let element = dropdownCtrl.getElement();
			let avoidAutoCloseFn = event => {
				event.stopPropagation();
			};
			element.addEventListener('click', avoidAutoCloseFn);

			this.lastDropdownCtrl = dropdownCtrl;
			this.autoCloseFn = () => {
				element.removeEventListener('click', avoidAutoCloseFn);
				this.lastDropdownCtrl.close();
			};
			document.addEventListener('click', this.autoCloseFn, true);
		}
	}

	close(dropdownCtrl) {
		if (dropdownCtrl.autoClose) {
			document.removeEventListener('click', this.autoCloseFn, true);
			this.lastDropdownCtrl = null;
			this.autoCloseFn = null;
		}
	}
}

export default new DropdownService();

