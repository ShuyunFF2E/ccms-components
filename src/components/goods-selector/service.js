import genResource from 'angular-es-utils/rs-generator';

export default {
	// 获取商品自自定义类目数据
	getShopCategories(serverName, platform, shopId, apiPrefix, tenantId = null) {
		shopId = String(shopId).split(',').join('&shopId=');
		let paramStr = tenantId ? `?platform=${ platform }&shopId=${ shopId }&tenantId=${ tenantId }` : `?platform=${ platform }&shopId=${ shopId }`;
		return genResource(`${ serverName }${ apiPrefix }/shop_categories${ paramStr }`);
	},

	// 获取商品标准类目列表
	getCategories(serverName, platform, shopId, apiPrefix, tenantId = null) {
		shopId = String(shopId).split(',').join('&shopId=');
		let paramStr = tenantId ? `?platform=${platform}&shopId=${ shopId }&tenantId=${ tenantId }` : `?platform=${platform}&shopId=${ shopId }`;
		return genResource(`${ serverName }${ apiPrefix }/categories${ paramStr }`);
	},

	// 获取商品品牌
	getBrands(serverName, platform, shopId, apiPrefix, tenantId = null) {
		shopId = String(shopId).split(',').join('&shopId=');
		let paramStr = tenantId ? `?platform=${ platform }&shopId=${ shopId }&tenantId=${ tenantId }` : `?platform=${ platform }&shopId=${ shopId }`;
		return genResource(`${ serverName }${ apiPrefix }/brands${ paramStr }`);
	},

	// 获取商品标签
	getTags(serverName, platform, tenantId, apiPrefix) {
		let paramStr = tenantId ? `?platform=${ platform }&tenantId=${ tenantId }&status=1` : `?platform=${ platform }&status=1`;
		return genResource(`${ serverName }${ apiPrefix }/tagSearch${ paramStr }`);
	},

	// 获取商品属性
	getProperties(serverName, platform, shopId, itemId, apiPrefix, tenantId = null) {
		shopId = String(shopId).split(',').join('&shopId=');
		let paramStr = tenantId ? `?platform=${ platform }&shopId=${ shopId }&tenantId=${ tenantId }` : `?platform=${ platform }&shopId=${ shopId }`;
		return genResource(`${ serverName }${ apiPrefix }/categories/${ itemId }/properties${ paramStr }`);
	},

	// 获取批量导入数据的结果（导入总数、导入失败数据列表）
	getBatchImportResult(serverName, apiPrefix, tenantId = null) {
		let paramStr = tenantId ? `&tenantId=${ tenantId }` : '';
		return genResource(`${ serverName }${ apiPrefix }/items/batchImport/result${ paramStr }`);
	},

	// 获取批量导入数据后返回的表格数据
	getBatchImportIds(serverName, apiPrefix, tenantId = null) {
		let paramStr = tenantId ? `&tenantId=${ tenantId }` : '';
		return genResource(`${ serverName }${ apiPrefix }/items/batchImportIds${ paramStr }`);
	},

	// 获取表格数据
	getGridItems(serverName, pageNum, pageSize, paramStr, apiPrefix, tenantId = null) {
		let str = tenantId ? `?pageNum=${ pageNum }&pageSize=${ pageSize }&${ paramStr }&tenantId=${ tenantId }` : `?pageNum=${ pageNum }&pageSize=${ pageSize }&${ paramStr }`;
		return genResource(`${ serverName }${ apiPrefix }/items${ str }`);
	},

	// 批量添加操作下获取表格数据
	getGridBatchItems(serverName, pageNum, pageSize, apiPrefix, tenantId = null) {
		let paramStr = tenantId ? `?pageNum=${ pageNum }&pageSize=${ pageSize }&tenantId=${ tenantId }` : `?pageNum=${ pageNum }&pageSize=${ pageSize }`;
		return genResource(`${ serverName }${ apiPrefix }/items/batchImportIds${ paramStr }`);
	},

	// 获取所有表格数据
	getSelectedItemsAll(serverName, plat, shopId, apiPrefix, tenantId = null) {
		let shopIdStr = shopId;
		if (Array.isArray(shopId)) {
			shopIdStr = shopId.join('&shopId=');
		}
		let paramStr = tenantId ? `?platform=${ plat }&shopId=${ shopIdStr }&tenantId=${ tenantId }` : `?platform=${ plat }&shopId=${ shopIdStr }`;
		return genResource(`${ serverName }${ apiPrefix }/items${ paramStr }`);
	}
};
