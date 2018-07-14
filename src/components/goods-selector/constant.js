export const apiPrefix = '/shuyun-searchapi/1.0';
export const onceMaxSelectedNumber = 500;
export const getExceedSelectedNumberMsg = function(number) {
	return `<span>最多允许选择${number}条数据</span>`;
};
export const getNotFoundMsg = function(currentTime, value) {
	return `<span class="not-found-details" ng-click="$ctrl.checkNotFoundDetails(${currentTime})">查看未成功明细</span>
			<div class="details-wrap" ng-show="$ctrl.isShowNotFoundDetails${currentTime}">
				<div class="title">
					<p ng-if="$ctrl.isCopied${currentTime}">
						<i class="icon iconfont icon-right"></i>
						<span>已复制</span>
					</p>
					<p ng-if="!$ctrl.isCopied${currentTime}" ng-click="$ctrl.isCopied${currentTime} = true; $ctrl.copyToBoard(${currentTime})">复制所有${value}</p>
					<p ng-click="$ctrl.isShowNotFoundDetails${currentTime} = false">收起</p>
				</div>
				<ul>
					<li ng-repeat="item in $ctrl.addSectionFailedData${currentTime} track by $index">{{ item }}</li>
				</ul>
				<div class="angle"></div>
			</div>`;
};

