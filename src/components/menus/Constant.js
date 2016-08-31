/**
 * Created with Constant.js.js
 * @Author: maxsmu
 * @Homepage: https://github.com/maxsmu
 * @Date: 2016-08-31 3:30 PM
 */

/**
 * CURRENT - 当前选中平台信息
 * @type {{CURRENT : {}}}
 * @type {{menuChangeTopics : []}}
 * @type {{shopChangeStartTopics : []}}
 * @type {{shopChangeTopics: []}}
 */
export default {
	CURRENT: {},

	menuChangeTopics: [],

	shopChangeStartTopics: [],

	shopChangeTopics: [],

	onListenerHelper(topic, listener, isReset = false) {
		if (typeof listener === 'function') {
			this[topic + 'Topics'].push(listener);
		} else {
			console.error(topic + '注册callback不是函数类型!');
		}

		// -是否需要返回销毁函数
		if (isReset) {
			return this.offListenerHelper.bind(this, topic);
		}
	},

	dispatchListenerHelper(topic, ...args) {
		this[topic + 'Topics'].forEach(listener => {
			listener.apply(null, args);
		});
	},

	offListenerHelper(topic) {
		this[topic + 'Topics'] = [];
	},

	isOnListenerHelper(topic) {
		return this[topic + 'Topics'].length > 0;
	}
};
