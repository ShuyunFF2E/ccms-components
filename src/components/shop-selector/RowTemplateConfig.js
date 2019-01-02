import defaultRowTemplate from './tpls/row.tpl.html';
import disabledRowTemplate from './tpls/disabled-row.tpl.html';
import highLightRowTemplate from './tpls/high-light-row.tpl.html';

/**
 * 表格行模板,可配置
 * @warning 业务系统可配置自定义模板
 */
export default {
	DEFAULT_ROW: defaultRowTemplate,
	DISABLED_ROW: disabledRowTemplate,
	HIGH_LIGHT_ROW: highLightRowTemplate
};
