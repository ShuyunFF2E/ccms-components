/**
 * 从外部传入的回调事件
 */
class Handler {
	// 事件存储map
	eventMap = {};

	getCallback(name) {
		return this.eventMap[name];
	}

	setEvent(name, callback) {
		this.eventMap[name] = callback;
	}

	run(name, ...params) {
		const callback = this.getCallback(name);
		return typeof callback === 'function' && callback(...params);
	}
}

export default new Handler();
