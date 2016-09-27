/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-05-06
 */

import defaultHeaderTpl from './tpls/default-header.tpl.html';
import defaultCellTpl from './tpls/default-cell.tpl.html';
import checkboxHeaderTpl from './tpls/checkbox-header.tpl.html';
import checkboxCellTpl from './tpls/checkbox-cell.tpl.html';
import radioHeaderTpl from './tpls/radio-header.tpl.html';
import radioCellTpl from './tpls/radio-cell.tpl.html';
import emptyGridTipTpl from './tpls/empty-grid-tip.tpl.html';

/**
 * 表格模板,可配置
 * @warning 业务系统如果要配置自定义模板,请以系统名为前缀避免冲突,如 NEWBI_SORTABLE_TEMPLATE
 */
export default {
	DEFAULT: [defaultHeaderTpl, defaultCellTpl, emptyGridTipTpl],
	SINGLE: [radioHeaderTpl, radioCellTpl, emptyGridTipTpl],
	SELECTABLE: [checkboxHeaderTpl, checkboxCellTpl, emptyGridTipTpl]
};
