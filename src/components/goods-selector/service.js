import genResource from 'angular-es-utils/rs-generator';

export default {
	// 获取商品自自定义类目数据
	getShopCategories({ serverName, platform, shopId, apiPrefix, isTotalChannel = false, tenant = null }) {
		shopId = String(shopId).split(',').join('&shopId=');
		let paramStr = `?platform=${ platform }&shopId=${ shopId }`;
		if (isTotalChannel) {
			paramStr = `${paramStr}&tenant=${ tenant }`;
		}
		return genResource(`${ serverName }${ apiPrefix }/shop_categories${ paramStr }`);
	},

	// 获取商品标准类目列表
	getCategories({ serverName, platform, shopId, apiPrefix, isTotalChannel = false, tenant = null }) {
		shopId = String(shopId).split(',').join('&shopId=');
		let paramStr = `?platform=${ platform }&shopId=${ shopId }`;
		if (isTotalChannel) {
			paramStr = `${paramStr}&tenant=${ tenant }`;
		}
		return genResource(`${ serverName }${ apiPrefix }/categories${ paramStr }`);
	},

	// 获取商品品牌
	getBrands({ serverName, platform, shopId, apiPrefix, isTotalChannel = false, tenant = null }) {
		shopId = String(shopId).split(',').join('&shopId=');
		let paramStr = `?platform=${ platform }&shopId=${ shopId }`;
		if (isTotalChannel) {
			paramStr = `${paramStr}&tenant=${ tenant }`;
		}
		return genResource(`${ serverName }${ apiPrefix }/brands${ paramStr }`);
	},

	// 获取商品标签
	getTags({ serverName, platform, tenant, apiPrefix, isTotalChannel = false }) {
		let paramStr = `?platform=${ platform }&status=1&tenantId=${ tenant }`;
		if (isTotalChannel) {
			paramStr = `${paramStr}&tenant=${ tenant }`;
		}
		return genResource(`${ serverName }${ apiPrefix }/tagSearch${ paramStr }`);
	},

	// 获取商品属性
	getProperties({ serverName, platform, shopId, itemId, apiPrefix, isTotalChannel = false, tenant = null }) {
		shopId = String(shopId).split(',').join('&shopId=');
		let paramStr = `?platform=${ platform }&shopId=${ shopId }`;
		if (isTotalChannel) {
			paramStr = `${paramStr}&tenant=${ tenant }`;
		}
		return genResource(`${ serverName }${ apiPrefix }/categories/${ itemId }/properties${ paramStr }`);
	},

	// 获取批量导入数据的结果（导入总数、导入失败数据列表）
	getBatchImportResult({ serverName, apiPrefix, platform, isTotalChannel = false, tenant = null }) {
		let paramStr = isTotalChannel ? `?tenant=${ tenant }` : '';
		return genResource(`${ serverName }${ apiPrefix }/items/batchImport/result${ paramStr }`);
	},

	// 获取批量导入数据后返回的表格数据
	getBatchImportIds({ serverName, apiPrefix, platform, isTotalChannel = false, tenant = null }) {
		let paramStr = isTotalChannel ? `?tenant=${ tenant }` : '';
		return genResource(`${ serverName }${ apiPrefix }/items/batchImportIds${ paramStr }`);
	},

	// 获取表格数据
	getGridItems({ serverName, pageNum, pageSize, paramStr, apiPrefix, platform, isTotalChannel = false, tenant = null }) {
		let str = `?pageNum=${ pageNum }&pageSize=${ pageSize }&${ paramStr }`;
		if (isTotalChannel) {
			str = `${str}&tenant=${ tenant }`;
		}
		return genResource(`${ serverName }${ apiPrefix }/items${ str }`);
	},

	// 批量添加操作下获取表格数据
	getGridBatchItems({ serverName, pageNum, pageSize, apiPrefix, platform, isTotalChannel = false, tenant = null }) {
		let paramStr = `?pageNum=${ pageNum }&pageSize=${ pageSize }`;
		if (isTotalChannel) {
			paramStr = `${paramStr}&tenant=${ tenant }`;
		}
		return genResource(`${ serverName }${ apiPrefix }/items/batchImportIds${ paramStr }`);
	},

	// 获取所有表格数据
	getGoodsItemsAll({ serverName, platform, shopId, apiPrefix, isTotalChannel = false, tenant = null }) {
		let shopIdStr = shopId;
		if (Array.isArray(shopId)) {
			shopIdStr = shopId.join('&shopId=');
		}
		let paramStr = `?platform=${ platform }&shopId=${ shopIdStr }`;
		if (isTotalChannel) {
			paramStr = `${paramStr}&tenant=${ tenant }`;
		}
		return genResource(`${ serverName }${ apiPrefix }/items${ paramStr }`);
	}
};
