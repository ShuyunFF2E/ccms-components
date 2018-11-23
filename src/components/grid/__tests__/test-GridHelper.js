/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-25
 */

import angular from 'angular';

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

	describe('refresh', () => {

		let $resource, $httpBackend, result, $q, opts, queryParams;

		describe('grid with resource query', () => {

			beforeEach(() => {
				angular.module('ppap', ['ngResource']);

				angular.mock.module('ppap');
				angular.mock.inject((_$resource_, _$httpBackend_, _$q_) => {
					$resource = _$resource_;
					$httpBackend = _$httpBackend_;
					$q = _$q_;

					result = {
						'currentPage': 2,
						'totalCount': 140,
						'pageSize': 40,
						'list': [
							{
								'name': '旗木卡卡西xx',
								'age': 25,
								'gender': '男'
							}
						]
					};

					$httpBackend.whenGET('/grid?pageNum=2&pageSize=40').respond(200, result);

					opts = {
						resource: $resource('/grid')
					};

					queryParams = {
						pageNum: 2,
						pageSize: 40
					};
				});

			});

			it('with filed mapping transformer', () => {

				opts.transformer = {
					pageNum: 'currentPage',
					totals: 'totalCount'
				};

				GridHelper
					.refresh(opts, queryParams)
					.then(gridOptions => {
						assert.deepEqual(gridOptions.data, result.list);
						assert.equal(gridOptions.pager.pageNum, result.currentPage, 'pageNum');
						assert.equal(gridOptions.pager.pageSize, result.pageSize, 'pageSize');
						assert.equal(gridOptions.pager.totalPages, Math.ceil((result.totalCount || 0) / result.pageSize), 'totalPages');
					});

				$httpBackend.flush();
			});

			it('with functional transformer', () => {

				opts.transformer = response => {
					response.pageNum = response.currentPage;
					response.totals = response.totalCount;
					delete response.currentPage;
					delete response.totalCount;
					return response;
				};

				GridHelper
					.refresh(opts, queryParams)
					.then(gridOptions => {
						assert.deepEqual(gridOptions.data, result.list);
						assert.equal(gridOptions.pager.pageNum, result.currentPage, 'pageNum');
						assert.equal(gridOptions.pager.pageSize, result.pageSize, 'pageSize');
						assert.equal(gridOptions.pager.totalPages, Math.ceil((result.totalCount || 0) / result.pageSize), 'totalPages');
					});

				$httpBackend.flush();
			});

			it('with promise-like external data', angular.mock.inject($rootScope => {

				opts.externalData = $q.resolve(result.list);

				GridHelper
					.refresh(opts, queryParams)
					.then(gridOptions => {
						assert.deepEqual(gridOptions.data, result.list);
					});

				$rootScope.$apply();
			}));

		});

	});

});
