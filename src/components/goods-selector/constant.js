export const apiPrefix = '/shuyun-searchapi/1.0';
export const onceMaxSelectedNumber = 500;
export const getExceedSelectedNumberMsg = function(number) {
	return `<span>最多允许选择${number}条数据</span>`;
};
