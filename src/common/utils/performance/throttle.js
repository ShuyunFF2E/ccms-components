/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-02
 */

export default function throttle(func, delay, context = null) {
	let recent;
	return (...args) => {
		const now = Date.now();

		if (!recent || (now - recent > (delay || 10))) {
			func.apply(context, args);
			recent = now;
		}
	};
}
