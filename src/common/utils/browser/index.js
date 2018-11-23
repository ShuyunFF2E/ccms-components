/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-08-15
 */

const browser = (function() {
	const ua = navigator.userAgent;

	let OSName = 'Unknown OS';
	if (navigator.appVersion.indexOf('Win') !== -1) OSName = 'Windows';
	if (navigator.appVersion.indexOf('Mac') !== -1) OSName = 'MacOS';
	if (navigator.appVersion.indexOf('X11') !== -1) OSName = 'UNIX';
	if (navigator.appVersion.indexOf('Linux') !== -1) OSName = 'Linux';

	let tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if (/trident/i.test(M[1])) {
		tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
		return {
			name: 'IE',
			version: (tem[1] || ''),
			os: OSName
		};
	}
	if (M[1] === 'Chrome') {
		tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
		if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	}
	M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
	if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
	return {
		name: M[0],
		version: M[1],
		os: OSName
	};
}());

export default browser;
