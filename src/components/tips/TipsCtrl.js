/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-03-28
 */
import {Inject} from 'angular-es-utils';

import {isContentOverflow} from '../../common/utils/style-helper';

@Inject('$element')
export default class TipsCtrl {

	isContentOverflow(content) {
		return isContentOverflow(this._$element[0].querySelector('p'), content);
	}

}
