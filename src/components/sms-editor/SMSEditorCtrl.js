/**
 * Created by AshZhang on 2016/1/18.
 */

import angular from 'angular';
import { Inject } from 'angular-es-utils';
import { escapeRegExp } from '../../common/bases/common';

const regUrlBase = '((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[.\\!\\/\\\\w]*))?)';

const REG_URL = new RegExp(regUrlBase);
const REG_URL_HASH = new RegExp(regUrlBase + '#');
const DEFAULT_TYPE_NAME = 'default';
const BRACKET_REG = /[【】]/g;


@Inject('$scope', '$element', '$timeout')
export default class SMSEditorCtrl {
	constructor($scope, $element) {
		this.showTips = false;
		this.createInput = this.createInput.bind(this);
		this.parseHTML = this.parseHTML.bind(this);
		this.insertKeyword = this.insertKeyword.bind(this);
		this.reFocus = this.reFocus.bind(this);
		this.rememberFocus = this.rememberFocus.bind(this);
		this.onChange = this.onChange.bind(this);
		this.checkoutShortLink = this.checkoutShortLink.bind(this);

		this.EMO_BASE_URL = '../src/components/sms-editor/emo/';

		// 表情图标
		// this.emoIcons = ['emo-1', 'emo-2', 'emo-3', 'emo-4', 'emo-5'];

		// 初始化编辑框及显示
		this.opts || (this.opts = {});
		this.keywordPrefix = this.opts.keywordPrefix || '$$';
		this.keywordSuffix = this.opts.keywordSuffix || '$$';
		// 是否支持图片
		this.isSupportImage = angular.isDefined(this.opts.isSupportImage) ? this.opts.isSupportImage : true;
		this.trimContent = angular.isDefined(this.opts.trimContent) ? this.opts.trimContent : true;

		this._content = $element[0].querySelector('[data-content]');
		this._tempHolder = $element[0].querySelector('.sms-temp');
		this.initKeywords();
		this.initContent(this.opts.content);

		this._content.addEventListener('input', this.onChange, false);

		// 异步加载
		$scope.$watch('ctrl.opts.keywords', (newVal, oldVal) => {
			if (!(newVal && newVal.length === 0 && oldVal && oldVal.length === 0)) {
				this.initKeywords();
				this.initContent(this.opts.content || '');
			}
		});

		$scope.$watch('ctrl.opts.content', newVal => {
			this.initContent(newVal || '');
			this.reFocus();
		});

		// 对外暴露短信编辑器 API
		this.opts.api = {
			insertContent: this.insertContent.bind(this),
			insertKeyword: this.insertKeyword.bind(this)
		};
	}


	/**
	 * 构造标签的预览文本
	 * - 如果标签有默认值, 则显示默认值; 否则显示 #标签名#
	 * @param {Array} keywords - 标签列表
	 * @param {string} text - 标签名
	 * @param {string|undefined} type - 标签类型
	 * @returns {string}
	 */
	static createTagPreview(keywords, text, type = '') {
		(type === DEFAULT_TYPE_NAME) && (type = undefined);

		const matchedTag = keywords.filter(item => {
			return item.type === type && item.text === text;
		})[0];

		return matchedTag ? (matchedTag.defaultValue ? `%${matchedTag.defaultValue}%` : `%#${matchedTag.text}#%`) : `%#${text}#%`;
	}


	/**
	 * 将包含 html 的字符串转为文本
	 * e.g. < => &lt;  &nbsp; => &amp;nbsp;
	 * @param text
	 * @returns {string}
	 */
	static flatCode(text = '', trimContent = true) {
		// 待重构
		if (trimContent) {
			return text.replace(/(&nbsp;?)|(&lt;?)|(&gt;?)|(&amp;?)/g, result => {
				return '&amp;' + result.slice(1);
			}).replace(/</g, '&lt;');
		} else {
			// 针对文本前后空格不 trim 的设置, 将空格转成 &nbsp; 因为 html 不显示文本的前后空格
			return text.replace(/(&nbsp;?)|(&lt;?)|(&gt;?)|(&amp;?)/g, result => {
				return '&amp;' + result.slice(1);
			}).replace(/</g, '&lt;').replace(/\s/g, '&nbsp;');
		}
	}

	static wrap(keyword, arg = {}) {
		const obj = Object.assign({prefix: '', suffix: ''}, arg);
		return `${obj.prefix}${keyword}${obj.suffix}`;
	}

	/**
	 * 整理关键词数据, 确定默认显示的关键词分类
	 */
	initKeywords() {
		!this.opts.keywords && (this.opts.keywords = []);

		this.keywordTypes = this.opts.keywords.reduce((types, keyword) => {
			if (keyword.type && types.indexOf(keyword.type) === -1) {
				types.push(keyword.type);
			}
			return types;
		}, []);

		this.setKeywordType(this.keywordTypes[0]);
	}


	/**
	 * 设置需要显示的变量类型
	 * @param type
	 */
	setKeywordType(type) {
		this.keywordTypeDisplay = type;

		this.opts.keywords.forEach(keyword => {
			keyword._display = (!type || !keyword.type || keyword.type === type);
		});
	}


	/**
	 * 判断是否要展示箭头
	 * @returns {boolean}
	 */
	testShowToggleOrNot() {
		const HASH_WIDTH = 7,
			PADDING = 20,
			MARGIN = 5,
			ARROW_PADDING = 45,
			keywordLength = this.opts.keywords.reduce((result, keyword) => {
				return result + (keyword._display
						? keyword.text.length * 12 + HASH_WIDTH + PADDING + MARGIN
						: 0);
			}, 0);

		return keywordLength > this._content.clientWidth - ARROW_PADDING;
	}


	/**
	 * 初始化内容
	 * @param {string} content - 初始文字
	 */
	initContent(content) {
		this._content.innerHTML = this.formatContent(this.parseTag(content));
		this.checkEmpty();
		this.parseHTML();
		if (this.opts.shortLinkTip) {
			this.initShortLink();
		}
	}
	/**
	 * 有手动输入的淘短链时，初始化淘短链tips框的显示
	 * @param {string} content - 初始文字
	 */
	initShortLink() {
		const shortLinkReg = new RegExp(/(?:c\.tb\.cn|vcrm\.me|t\.cn)[^<&\s\u4e00-\u9fa5]*/, 'g');
		if (shortLinkReg.test(this._content.innerHTML)) {
			this._content.innerHTML = this._content.innerHTML.replace(shortLinkReg, result => `<a class="shortLinkTips" href=" ">${result}</a>`);
			const shortLinkTags = document.getElementById('sms-content').querySelectorAll('.shortLinkTips');
			if (shortLinkTags.length > 0) {
				// 只让第一个逃短链在打开时候自动弹出提
				for (let i = 0; i < shortLinkTags.length; i++) {
					if (i === 0) {
						this.handleTooltip(shortLinkTags[i], true);
					} else {
						this.handleTooltip(shortLinkTags[i], false);
					}
				}
			}
		}
	}

	/**
	 * 构造插入到文本编辑器的 input 标签
	 * @param {string} text - 标签名
	 * @param {string} type - 标签类型
	 * @returns {string}
	 */
	createInput(text, type = DEFAULT_TYPE_NAME, prefix = '', suffix = '') {
		// 暂时不需要
		// const padding = (this.keywordTypes.length < 1 || !type) ? 0 : 1.5;

		// return `&nbsp;<input class="sms-keyword-inserted ${padding ? type : DEFAULT_TYPE_NAME}" value="${text}" style="width: ${padding + text.length}em" disabled>&nbsp;`;
		let width = this.getTextWidth(text);

		return `${prefix}<input class="sms-keyword-inserted ${type}" value="${text}" style="width: ${width + 2}px" disabled>${suffix}`;
	}

	getTextWidth(text) {
		let element = document.createElement('div');
		element.className = 'sms-content';
		element.style.display = 'inline-block';
		element.style.opacity = 0;
		element.innerHTML = text;
		document.body.appendChild(element);

		let width = window.getComputedStyle(element).width;

		document.body.removeChild(element);

		return parseInt(width, 10);
	}


	/**
	 * 构造插入到文本编辑器中的图片
	 * @param {string} name - 图片名称
	 * @returns {string}
	 */
	createImage(name) {
		return `<img data-emo-name="${name}" src="${this.EMO_BASE_URL}${name}.gif">`;
	}


	/**
	 * 将短信数据中的 tag 标签转化为 input
	 * @param {string} text - 短信数据
	 * @returns {string}
	 */
	parseTag(text = '') {
		const varReg = RegExp(`${escapeRegExp(this.keywordPrefix)}_(?:\\[(\\S*?)])?(.+?)_${escapeRegExp(this.keywordSuffix)}`, 'g');
		return SMSEditorCtrl.flatCode(text, this.trimContent)
			.replace(varReg, (result, $1, $2) => {
				return this.createInput(this.keywordTextNameConvert($2, false), $1);
			});
	}

	/**
	 * Keyword name 和 text 字段转换
	 * @param arg
	 * @param argIsText
	 * - true: 输入 text, 转出 name
	 * - false: 输入 name, 转出 text
	 * @returns {*}
	 */
	keywordTextNameConvert(arg, argIsText = true) {
		const keywords = this.opts.keywords;

		let matchedKeyword;

		if (keywords && keywords.length) {
			matchedKeyword = keywords.find(keyword => keyword[argIsText ? 'text' : 'name'] === arg);
		}

		return matchedKeyword ? matchedKeyword[argIsText ? 'name' : 'text'] : arg;
	}

	/**
	 * get keyword config
	 * @param arg
	 * @param argIsText
	 * - true: 通过 text, 获取 keyword
	 * - false: 通过 name, 获取 keyword
	 * */

	getKeywordConfig(arg, argIsText = true) {
		const keywords = this.opts.keywords;

		let matchedKeyword;

		if (keywords && keywords.length) {
			matchedKeyword = keywords.find(keyword => keyword[argIsText ? 'text' : 'name'] === arg);
		}

		return matchedKeyword;
	}

	/**
	 * 将短信数据中的表情转化为 img
	 * @param {string} text - 短信数据
	 * @returns {string}
	 */
	parseImage(text) {
		return text.replace(/\{([^}]+)}/g, (result, $1) => {
			return this.createImage($1);
		});
	}

	/**
	 * 格式化短信数据
	 * */
	formatContent(text) {
		const data = text.split('#_enter_#');
		const sms = [];
		for (let item of data) {
			const content = item.length ? `<div>${item}</div>` : '<div><br/></div>';
			sms.push(content);
		}

		let parsed = sms.join('');

		if (this.isSupportImage) {
			parsed = parsed.replace(/\{([^}]+)}/g, (result, $1) => {
				return this.createImage($1);
			});
		}
		return parsed;
	}


	/**
	 * 解析富文本编辑器中的 HTML, 生成预览文本和最终存到服务器的文本
	 */
	parseHTML() {
		let parsed = this._content.innerHTML.trim()
			.replace(/disabled(="[^"]*")?/i, '')
			.replace(/style="[^"]+"/i, '')
			.trim();

		const inputReg = /<input\s+class="sms-keyword-inserted\s*([^"]*)"\s+value="([^"]+)"[^>]*>/ig;

		const imgReg = /<img\s+data-emo-name="([^"]+)"\s+src="([^"]+)"\s?\/?>/ig;
		if (!parsed.startsWith('<div>')) {
			const parsedArr = parsed.split('<div>');
			const a = parsed.replace(parsedArr[0], '');
			parsed = `<div>${parsedArr[0]}</div>${a}`;
		}

		parsed = parsed.replace(/<\/div>/g, '')
			.replace(/<div>/g, '#_enter_#')
			.replace(/#_enter_#/, '');
		this._tempHolder.innerHTML = parsed
			.replace(inputReg, (result, $1, $2) => {
				return SMSEditorCtrl.createTagPreview(this.opts.keywords, $2, $1);
			})
			.replace(imgReg, (result, $1, $2) => {
				return `{{${$2}}}`;
			});

		// 稍后重构
		this.opts.text = parsed
			.replace(inputReg, (result, $1, $2) => {
				if ($1 === DEFAULT_TYPE_NAME) {
					return `${this.keywordPrefix}_${this.keywordTextNameConvert($2)}_${this.keywordSuffix}`;
				}
				return `${this.keywordPrefix}_[${$1}]${this.keywordTextNameConvert($2)}_${this.keywordSuffix}`;
			})
			.replace(imgReg, (result, $1) => {
				return `{${$1}}`;
			})
			.replace(/<[^>]+>/g, '')
			.replace(/(&nbsp;)|(&lt;)|(&gt;)|(&amp;)/g, result => {
				return {
					'&nbsp;': ' ',
					'&lt;': '<',
					'&gt;': '>',
					'&amp;': '&'
				}[result];
			});
		if (this.trimContent) {
			this.opts.text = this.opts.text.trim();
		}

		// 图片, 关键字高亮, URL, 手机及固话号码下划线
		this.opts.preview = SMSEditorCtrl.flatCode(this._tempHolder.textContent, this.trimContent)
			.replace(/\{\{([^}]+)}}/g, (result, $1) => {
				return `<img src="${$1}">`;
			})
			.replace(/%([^%]+)%/g, (result, $1) => {
				return `<span class="sms-tag-preview">${$1.trim()}</span>`;
			})
			.replace(REG_URL_HASH, result => {
				return `<a href="javascript: void(0);">${result.slice(0, result.length - 1)}</a>#`;
			})
			.replace(/(\D|\b)(1[3-9]\d-?\d{4}-?\d{4})(\D|\b)/g, (match, p1, p2, p3) => {
				return `${p1}<a href="javascript: void(0);">${p2}</a>${p3}`;
			})
			.replace(/(\D)((?:[08][1-9]\d{1,2}-?)?[2-9]\d{6,7})(\D)/g, (match, p1, p2, p3) => {
				return `${p1}<a href="javascript: void(0);">${p2}</a>${p3}`;
			});
	}


	/**
	 * 往富文本编辑器中插入标签
	 * @param {string} text - 标签名
	 * @param {string} type - 标签类型
	 * @param {boolean} disabled -标签是否禁用
	 * @param {string} prefix - 前缀
	 * @param {string} suffix - 后缀
	 */
	insertKeyword(text, type, disabled, prefix, suffix) {
		if (!disabled) {
			this.reFocus();
			document.execCommand('insertHTML', false, this.createInput(text, type, prefix, suffix));
		}
	}


	/**
	 * 往富文本编辑器中插入表情图片
	 * @param {string} emo - 图片名称
	 */
	insertEmo(emo) {
		this.reFocus();
		document.execCommand('insertHTML', false, this.createImage(emo));
	}

	/**
	 * 往富文本编辑器中插入文本内容
	 * @param {string} content - 文本内容
	 */
	insertContent(content) {
		this.reFocus();
		document.execCommand('insertHTML', false, content);
	}


	/**
	 * 重新定位光标
	 * - 如果记忆了光标位置, 返回
	 * - 如果之前没有操作过, 则定位到文本框最后
	 */
	reFocus() {

		if (this._range) {
			const selection = window.getSelection();
			selection.removeAllRanges();
			if (this._range.commonAncestorContainer.parentNode.nodeName === 'A') {
				const range = document.createRange();
				range.selectNodeContents(this._content);
				range.collapse(false);
				selection.removeAllRanges();
				selection.addRange(range);
			} else {
				selection.addRange(this._range);
			}
		} else {
			this._content.focus();

			const range = document.createRange();

			range.selectNodeContents(this._content);
			range.collapse(false);

			const selection = window.getSelection();

			selection.removeAllRanges();
			selection.addRange(range);
		}
	}


	/**
	 * 记住光标在编辑器中的位置
	 */
	rememberFocus() {
		const selection = window.getSelection();

		if (selection.rangeCount) {
			this._range = selection.getRangeAt(0);
		}
	}


	/**
	 * 如果文本编辑器为空, 为其添加 empty 样式
	 */
	checkEmpty() {
		this._content.parentNode.classList[this._content.innerHTML.length ? 'remove' : 'add']('empty');
	}


	/**
	 * 文本修改后, 重置预览文本和最终结果
	 * - !!! 输入时, 过滤【 和 】
	 */
	onChange() {
		this.rememberFocus();

		if (BRACKET_REG.test(this._content.innerHTML)) {

			// 记录初始光标
			const nodes = [].slice.call(this._content.childNodes),
				node = this._range.startContainer,
				inputContent = this._range.startContainer.textContent;

			let offset = this._range.startOffset - 1,
				caretNodeIndex = nodes.indexOf(node);

			if (/^[【】]/.test(inputContent)) {
				caretNodeIndex -= 1;
			}

			// 修改 HTML
			this._content.innerHTML = this._content.innerHTML.replace(BRACKET_REG, '');

			// 恢复光标
			const selection = window.getSelection(),
				range = document.createRange();

			selection.removeAllRanges();

			let newPosNode = this._content.childNodes[caretNodeIndex];

			if (!newPosNode) {

				// 输入位置在头部
				range.selectNode(this._content.firstChild);
				range.collapse(true);
			} else if (newPosNode.nodeType !== 3) {

				// 变量之后
				range.selectNode(newPosNode);
				range.collapse();
			} else {

				// 文字之间
				range.setStart(newPosNode, offset);
				range.setEnd(newPosNode, offset);
			}

			selection.addRange(range);
		} else {
			this.parseHTML();
			this.checkEmpty();
			this._hasUrl = REG_URL.test(this.opts.text) && !REG_URL_HASH.test(this.opts.text);
		}
	}
	/**
	 * 添加短链提示效果
	 * @param currentTag 包含当前复制内容的元素
	 */
	handleTooltip(currentTag, autoShow = true) {
		let showTip = null;
		// 计时
		if (autoShow) {
			this.setToolTip(currentTag, true);
			showTip = this._$timeout(() => {
				this._$timeout.cancel(showTip);
				this.setToolTip(currentTag, false);
			}, 10000);
		}

		// 鼠标划入显示
		currentTag.onmouseenter = () => {
			this._$timeout.cancel(showTip);
			this.setToolTip(currentTag, true);
		};
		// 鼠标划出不显示
		currentTag.onmouseleave = () => {
			this._$timeout.cancel(showTip);
			this.setToolTip(currentTag, false);
		};
	}
	/**
	 * 设置是否显示提示信息
	 * 初始化短信编辑器时，#sms-content已存在，但内容未渲染到页面上，定位不精准，$$phase存在，$apply无法更新dom。因此选用$timeout（）更新。
	 * @param tag 包含短链内容的元素
	 * @param showFlag 是否显示
	 */
	setToolTip(currentTag, showFlag) {
		const UI_SPACE_TOP = 6;
		const parentEle = document.getElementById('sms-content-holder').querySelector('#sms-content');
		const tip = document.getElementById('tip');
		const TIP_WIDTH = window.getComputedStyle(tip).getPropertyValue('width').split('px')[0] * 1 + window.getComputedStyle(tip).getPropertyValue('padding-right').split('px')[0] * 1;
		const TIP_HEIGHT = window.getComputedStyle(tip).getPropertyValue('height').split('px')[0] * 1 + window.getComputedStyle(tip).getPropertyValue('padding-top').split('px')[0] * 2 + UI_SPACE_TOP;
		const showTip = this._$timeout(() => {
			this._$timeout.cancel(showTip);
			this.showTips = showFlag;
			if (showFlag) {
				const tipPosition = this.positionCompute(currentTag, parentEle, TIP_WIDTH);
				this.tipsPosition = {
					left: tipPosition.newLeft + 'px',
					top: parentEle.scrollTop > 0 ? currentTag.offsetTop - parentEle.scrollTop - TIP_HEIGHT + 'px' : currentTag.offsetTop - TIP_HEIGHT + 'px'
				};
				this.angleStyle = {
					left: tipPosition.angleLeft + 'px'
				};
			}
		}, 0);
	}

	positionCompute(currentTag, parentEle, tipWidth) {
		const currentWidth = Math.ceil(currentTag.offsetWidth / 2);
		const parentEleWidth = parentEle.offsetWidth;
		const currentPositionLeft = currentTag.offsetLeft;
		const changeFlag = currentPositionLeft + tipWidth;
		const UI_SPACE_LEFT = 12;
		if (changeFlag > parentEleWidth) {
			const newLeft = currentTag.offsetLeft - UI_SPACE_LEFT - (currentPositionLeft + tipWidth - parentEleWidth);
			const angleLeft = currentPositionLeft - newLeft;
			return {
				newLeft,
				angleLeft
			};
		}
		return {
			newLeft: currentTag.offsetLeft - UI_SPACE_LEFT,
			angleLeft: currentWidth
		};
	}

	/**
	 * 不许贴图片和乱七八糟的 html, 也不许贴【 和 】
	 * - 这条代码如果在 firefox 里跑通了, 晚上就去吃大餐 by AshZhang@2016.3.29
	 * @param e
	 */
	onPaste(e) {
		const event = e.originalEvent || e,
			htmlContent = event.clipboardData.getData('text/html');
		if (htmlContent.indexOf('sms-keyword-inserted') > -1 || htmlContent.indexOf('data-emo-name') > -1) return;
		e.preventDefault();
		const textContent = event.clipboardData.getData('text/plain');
		const selection = document.getSelection();
		const shortLinkHead = this.includedShortLink(textContent);
		if (this.opts.shortLinkTip && shortLinkHead) {
			document.execCommand('insertHTML', false, `<span>${textContent}</span>`);
			const startSetOff = selection.focusNode.textContent.indexOf(shortLinkHead);
			this.transformToATag(selection, startSetOff, shortLinkHead.length);
		} else {
			this._hasInvalidStr = BRACKET_REG.test(textContent);
			this._invalidStrClosed = !this._hasInvalidStr;
			document.execCommand('insertText', false, textContent.replace(BRACKET_REG, ''));
		}
	}
	checkoutShortLink() {
		if (this.opts.shortLinkTip) {
			window.requestAnimationFrame(() => {
				if (!this.includedShortLink(this._content.innerHTML)) {
					this.showTips = false;
					if (this._$scope.$$phase) {
						this._$scope.$applyAsync();
					} else {
						this._$scope.$apply();
					}
					return;
				}
				const selection = document.getSelection();
				const shortLinkHead = this.includedShortLink(selection.focusNode.textContent);
				const startOffset = selection.focusNode.textContent.indexOf(shortLinkHead);
				if (startOffset === -1) {
					this.showTips = false;
					if (this._$scope.$$phase) {
						this._$scope.$applyAsync();
					} else {
						this._$scope.$apply();
					}
					return;
				}
				if (selection.focusNode.parentNode.nodeName.toUpperCase() === 'A' || selection.focusNode.className === 'sms-content') {
					return;
				}
				this.transformToATag(selection, startOffset, shortLinkHead.length);
			});
		}
	}

	transformToATag(selection, startOffset, contentLength) {
		const insertRange = document.createRange();
		insertRange.setStart(selection.focusNode, startOffset);
		insertRange.setEnd(selection.focusNode, startOffset + contentLength);
		selection.removeAllRanges();
		selection.addRange(insertRange);
		document.execCommand('CreateLink', false, ' ');
		const currentNode = selection.focusNode.parentNode;
		this.handleTooltip(currentNode);
		if (currentNode.nextSibling) {
			selection.collapse(currentNode.nextSibling, currentNode.nextSibling.length);
		} else {
			selection.collapse(selection.focusNode, selection.focusOffset);
		}
	}
	includedShortLink(string) {
		if (string.indexOf('c.tb.cn') > -1) {
			return 'c.tb.cn';
		}
		if (string.indexOf('vcrm.me') > -1) {
			return 'vcrm.me';
		}
		if (string.indexOf('t.cn') > -1) {
			return 't.cn';
		}
		return false;
	}
}
