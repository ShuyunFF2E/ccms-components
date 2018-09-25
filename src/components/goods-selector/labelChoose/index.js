import angular from 'angular';
import LabelChooseService from './LabelChooseService';


export default angular.module('ccms.components.goodsSelector.labelChoose', [])
	.value('$labelChoose', LabelChooseService)
	.name;
