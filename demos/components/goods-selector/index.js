;(function(angular) {

	'use strict';

	angular.module('app', ['ccms.components', 'topService', 'josService', 'qkService'])

		.controller('ctrl', function($scope, $ccGoodsSelector, topFactory, josFactory, qkFactory) {

			$scope.isSupportedAddCondition = false;
			$scope.isSupportedBatchAddition = false;
			$scope.isTotalChannel = false;

			// top + sku 维度 + 店铺选择
			$scope.openTopWithShopList = function() {
				topFactory.openTopWithShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// jos + sku 维度 + 店铺选择
			$scope.openJosWithShopList = function() {
				josFactory.openJosWithShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// top + sku 维度 + 单店铺
			$scope.openTopWithoutShopList = function() {
				topFactory.openTopWithoutShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// jos + sku 维度 + 单店铺
			$scope.openJosWithoutShopList = function() {
				josFactory.openJosWithoutShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// qiakr + sku 维度 + 店铺选择（单选）
			$scope.openQkSingleSelectShopList = function() {
				qkFactory.openQkSingleSelectShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// qiakr + sku 维度 + 店铺选择（多选）
			$scope.openQkMultipleSelectShopList = function() {
				qkFactory.openQkMultipleSelectShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// top + 商品维度 + 店铺选择
			$scope.openTopWithoutSkuWithShopList = function() {
				topFactory.openTopWithoutSkuWithShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// jos + 商品维度 + 店铺选择
			$scope.openJosWithoutSkuWithShopList = function() {
				josFactory.openJosWithoutSkuWithShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// top + 商品维度 + 单店铺
			$scope.openTopWithoutSkuWithoutShopList = function() {
				topFactory.openTopWithoutSkuWithoutShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// jos + 商品维度 + 单店铺
			$scope.openJosWithoutSkuWithoutShopList = function() {
				josFactory.openJosWithoutSkuWithoutShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// top + 商品维度 + 店铺选择 + 单选（微信CRM）
			$scope.openTopSingleSelectWithShopList = function() {
				topFactory.openTopSingleSelectWithShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// jos + 商品维度 + 店铺选择 + 单选（微信CRM）
			$scope.openJosSingleSelectWithShopList = function() {
				josFactory.openJosSingleSelectWithShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// top + 商品维度 + 单店铺 + 单选（微信CRM）
			$scope.openTopSingleSelectWithoutShopList = function() {
				topFactory.openTopSingleSelectWithoutShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// top + 商品维度 + 单店铺 + 单选（微信CRM）
			$scope.openJosSingleSelectWithoutShopList = function() {
				josFactory.openJosSingleSelectWithoutShopList($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// qiakr + 商品维度 + 店铺选择（单选）
			$scope.openQkSingleSelectShopListWithoutSku = function() {
				qkFactory.openQkSingleSelectShopListWithoutSku($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};

			// qiakr + 商品维度 + 店铺选择（多选）
			$scope.openQkMultipleSelectShopListWithoutSku = function() {
				qkFactory.openQkMultipleSelectShopListWithoutSku($scope, $ccGoodsSelector, $scope.isSupportedAddCondition, $scope.isSupportedBatchAddition, $scope.isTotalChannel);
			};
		});

})(window.angular);
