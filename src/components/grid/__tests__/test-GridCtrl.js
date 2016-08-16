/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-07-14
 */

import GridCtrl from '../GridCtrl';
import GRID_TEMPLATES from '../Constant';
import rowCellTemplate from '../tpls/row-cell.tpl.html';

import {assert} from 'chai';

describe('GridCtrl', () => {

	let gridCtrl;

	before(() => {

		gridCtrl = new GridCtrl();
		gridCtrl.opts = {
			response: null,
			queryParams: {
				pageNum: 2
			},
			columnsDef: [
				{
					cellTemplate: '<span style="color:blue" ng-bind="entity.name" ng-click="app.click()" tooltip="entity.name" tooltip-append-to-body="true"></span>',
					displayName: '姓名',
					align: 'center',
					width: '100px',
					sort: 'name'
				},
				{field: 'age', displayName: '年龄', align: 'center', sort: true},
				{field: 'gender', displayName: '性别', align: 'right'}
			],
			transformer: {
				pageNum: 'currentPage'
			},
			onRefresh: () => {
				assert.isTrue(true);
			}
		};

		gridCtrl.$onInit();
	});

	it('$onInit', done => {

		const type = 'default'.toUpperCase();

		Promise.all([gridCtrl.headerTemplate, gridCtrl.emptyTipsTemplate])
			.then(tpls => {
				assert.equal(tpls[0], GRID_TEMPLATES[type][0]);
				assert.equal(tpls[1], GRID_TEMPLATES[type][2]);

				const bodyTpl = rowCellTemplate.replace('{::cell-placeholder}', GRID_TEMPLATES[type][1]);
				assert.equal(gridCtrl.bodyTemplate, bodyTpl);

				done();
			});
	});

	it('switchSelectAll', () => {
		gridCtrl.switchSelectAll(true, [{name: 'kuitos'}, {age: 20}]);
		assert.deepEqual(gridCtrl.selectedItems, [{name: 'kuitos'}, {age: 20}]);

		gridCtrl.switchSelectAll(false, [{age: 20}]);
		assert.deepEqual(gridCtrl.selectedItems, [{name: 'kuitos'}]);
	});

	it('switchSelectItem', () => {

		gridCtrl.switchSelectItem(true, {gender: 'xx'});
		assert.deepEqual(gridCtrl.selectedItems, [{name: 'kuitos'}, {gender: 'xx'}]);

		gridCtrl.switchSelectItem(false, {gender: 'xx'});
		assert.deepEqual(gridCtrl.selectedItems, [{name: 'kuitos'}]);
	});

	it('isEntitySelected', () => {

		assert.isTrue(gridCtrl.isEntitySelected({name: 'kuitos'}));
		assert.isFalse(gridCtrl.isEntitySelected({name: 'kuitosx'}));
	});

	it('$allSelected should auto change', () => {

		gridCtrl.opts.data = [{name: 'kuitos'}];
		assert.isTrue(gridCtrl.$allSelected);

		gridCtrl.opts.data = [{name: 'kuitos'}, {age: 10}];
		assert.isFalse(gridCtrl.$allSelected);
	});

	it('updateColumns', () => {

		gridCtrl.opts.hiddenColumns = false;
		gridCtrl.updateColumns();
		assert.equal(gridCtrl.columns.length, gridCtrl.opts.columnsDef.length, 'columns length is equal');

		gridCtrl.opts.hiddenColumns = ['性别'];
		gridCtrl.updateColumns();
		const index = gridCtrl.columns.findIndex(col => {
			return col.displayName === '性别';
		});
		assert.isTrue(index === -1, 'gender columns is hidden');
	});

	it('toggleColumn', () => {

		let displayName = '性别';
		gridCtrl.toggleColumn(displayName);
		assert.isTrue(gridCtrl.columns.indexOf(displayName) === -1, 'gender is hidden');

		displayName = '年龄';
		gridCtrl.toggleColumn(displayName);
		assert.isTrue(gridCtrl.columns.indexOf(displayName) === -1, 'age is hidden');
	});

	it('createSortConfig', () => {

		gridCtrl.columns = gridCtrl.opts.columnsDef;
		gridCtrl.createSortConfig(gridCtrl.columns);
		assert.isArray(gridCtrl.sortConfig, 'sortConfig is Array');
		assert.isNull(gridCtrl.sortConfig[2], 'sortConfig[2] is null');
	});

	it('updateSortConfigState', () => {

		let displayName = '年龄';
		const index = gridCtrl.sortConfig.findIndex(config => {
			return config && config.displayName === displayName;
		});

		if (index >= 0) {

			gridCtrl.updateSortConfigState(displayName);
			assert.equal(gridCtrl.sortConfig[index].type, 'asc', displayName + 'is sort asc');

			gridCtrl.updateSortConfigState(displayName);
			assert.equal(gridCtrl.sortConfig[index].type, 'desc', displayName + 'is desc');

			gridCtrl.updateSortConfigState(displayName);
			assert.equal(gridCtrl.sortConfig[index].type, 'default', displayName + 'is default');

		} else {

			assert.isTrue(false, 'sort column is not exist');
		}
	});

	it('getSortQueryParam', () => {

		const queryParam = gridCtrl.getSortQueryParam([
			{prop: 'age', type: 'asc', displayName: '年龄'},
			{prop: 'gander', type: 'default', displayName: '性别'},
			{prop: 'name', type: 'desc', displayName: '姓名'}]);
		assert.deepEqual(queryParam, {sortOrder: 'asc,desc', sortProp: 'age,name', pageNum: 1});
	});

	it('runColumnSorting', () => {
		gridCtrl.runColumnSorting('姓名');
	});
});


