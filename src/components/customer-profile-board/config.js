/**
 * @author jianzhe.ding
 * @homepage https://github.com/discipled/
 * @since 2016-09-12 10:22
 */

let API_ADDRESS;

if (process.env.NODE_ENV === 'production') {
	API_ADDRESS = '//qa-ual.fenxibao.com';
} else {
	API_ADDRESS = '//qa-ual.fenxibao.com';
}

export { API_ADDRESS };
