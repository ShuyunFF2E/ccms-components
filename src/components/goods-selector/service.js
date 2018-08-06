import genResource from 'angular-es-utils/rs-generator';
import { apiPrefix } from './constant';

export default {
	// 获取商品自自定义类目数据
	getShopCategories(serverName, platform, shopId) {
		return genResource(`${ serverName }${ apiPrefix }/shop_categories?platform=${ platform }&shopId=${ shopId }`);
	},

	// 获取商品标准类目列表
	getCategories(serverName, platform, shopId) {
		return genResource(`${ serverName }${ apiPrefix }/categories?platform=${platform}&shopId=${ shopId }`);
	},

	// 获取商品品牌
	getBrands(serverName, platform, shopId) {
		return genResource(`${ serverName }${ apiPrefix }/brands?platform=${ platform }&shopId=${ shopId }`);
	},

	// 获取商品标签
	getTags(serverName, platform, tenantId) {
		return genResource(`${ serverName }${ apiPrefix }/tagSearch?platform=${ platform }&tenantId=${ tenantId }&status=1`);
	},

	// 获取商品属性
	getProperties(serverName, platform, shopId, itemId) {
		return genResource(`${ serverName }${ apiPrefix }/categories/${ itemId }/properties?platform=${ platform }&shopId=${ shopId }`);
	},

	// 获取批量导入数据的结果（导入总数、导入失败数据列表）
	getBatchImportResult(serverName) {
		return genResource(`${ serverName }${ apiPrefix }/items/batchImport/result`);
	},

	// 获取批量导入数据后返回的表格数据
	getBatchImportIds(serverName) {
		return genResource(`${ serverName }${ apiPrefix }/items/batchImportIds`);
	},

	// 获取表格数据
	getGridItems(serverName, pageNum, pageSize, paramStr) {
		return genResource(`${ serverName }${ apiPrefix }/items?pageNum=${ pageNum }&pageSize=${ pageSize }&${ paramStr }`);
	},

	// 批量添加操作下获取表格数据
	getGridBatchItems(serverName, pageNum, pageSize) {
		return genResource(`${ serverName }${ apiPrefix }/items/batchImportIds?pageNum=${ pageNum }&pageSize=${ pageSize }`);
	}
};
