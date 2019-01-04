/**
 * @author DuYing
 * @homepage https://github.com/Dale-/
 * @since 12/23/16
 */

const TB_COMMON_AREAS = [
	{
		'id': 1,
		'name': '江浙沪',
		'subArea': ['310000', '320000', '330000']
	},
	{
		'id': 2,
		'name': '珠三角',
		'subArea': ['440000,440100', '440000,440300', '440000,440600', '440000,441900', '440000,442000', '440000,440400', '440000,441300', '440000,440700', '440000,441200']
	},
	{
		'id': 3,
		'name': '京津翼',
		'subArea': ['110000', '120000', '130000']
	},
	{
		'id': 4,
		'name': '东三省',
		'subArea': ['210000', '220000', '230000']
	},
	{
		'id': 5,
		'name': '港澳台',
		'subArea': ['710000', '810000', '820000']
	},
	{
		'id': 6,
		'name': '江浙沪皖',
		'subArea': ['310000', '320000', '330000', '340000']
	}
];

const JD_COMMON_AREAS = [
	{
		'id': 1,
		'name': '江浙沪',
		'subArea': ['-12', '-15', '-2']
	},
	{
		'id': 2,
		'name': '珠三角',
		'subArea': ['-19,-1601', '-19,-1607', '-19,-1609', '-19,-1643', '-19,-1655', '-19,-1657', '-19,-1659', '-19,-1690', '-19,-1666']
	},
	{
		'id': 3,
		'name': '京津翼',
		'subArea': ['-1', '-3', '-5']
	},
	{
		'id': 4,
		'name': '东三省',
		'subArea': ['-10', '-8', '-9']
	},
	{
		'id': 5,
		'name': '港澳台',
		'subArea': ['-32', '-52993']
	},
	{
		'id': 6,
		'name': '江浙沪皖',
		'subArea': ['-12', '-15', '-2', '-14']
	}
];

export const COMMON_AREAS = {
	'tb': TB_COMMON_AREAS,
	'jd': JD_COMMON_AREAS
};

export const platforms = {
	'tb': 'top',
	'jd': 'jos',
	'unification': 'unification'
};

export const localStorageKeys = {
	'tb': 'TB_CCMS_COMPONENTS_AREA_SELECTOR_DATA',
	'jd': 'JD_CCMS_COMPONENTS_AREA_SELECTOR_DATA',
	'unification': 'UNIFICATION_CCMS_COMPONENTS_AREA_SELECTOR_DATA'
};

export const MARKETING_COMMON_AREAS = [
	{
		'id': '1',
		'name': '华东地区',
		'subArea': ['310000', '320000', '330000', '340000', '350000', '370000']
	},
	{
		'id': '2',
		'name': '华南地区',
		'subArea': ['440000', '450000', '460000']
	},
	{
		'id': '3',
		'name': '华中地区',
		'subArea': ['360000', '410000', '420000', '430000']
	},
	{
		'id': '4',
		'name': '华北地区',
		'subArea': ['110000', '120000', '130000', '140000', '150000']
	},
	{
		'id': '5',
		'name': '西北地区',
		'subArea': ['610000', '620000', '630000', '640000', '650000']
	},
	{
		'id': '6',
		'name': '西南地区',
		'subArea': ['500000', '510000', '520000', '530000', '540000']
	},
	{
		'id': '7',
		'name': '东北地区',
		'subArea': ['210000', '220000', '230000']
	},
	{
		'id': '8',
		'name': '台港澳地区',
		'subArea': ['710000', '810000', '820000']
	}
];
