/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-25
 */

import GridHelper from '../GridHelper';

import { assert } from 'chai';

describe('GridHelper', () => {

	it('fillOpts', () => {

		const opts = {
			resource: 'A',
			columnsDef: [
				{filed: 'name'}
			],
			showPagination: false
		};
		const filledOpts = GridHelper.fillOpts(opts);

		assert.equal(filledOpts, opts);
		assert.equal(filledOpts.resource, 'A');
		assert.deepEqual(filledOpts.columnsDef, [{filed: 'name'}]);
		assert.includeMembers(Object.keys(filledOpts), [
			'resource',
			'response',
			'queryParams',
			'columnsDef',
			'externalData',
			'showPagination',
			'headerTpl',
			'rowTpl',
			'transformer',
			'emptyTipTpl',
			'pager'
		]);
	});

});
