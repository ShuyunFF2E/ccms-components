/**
 * Created by AshZhang on 2016/1/18.
 */


import { Inject } from 'angular-es-utils';

const regUrlBase = '((([A-Za-z]{3,9}:(?:\\/\\/)?)(?:[-;:&=\\+\\$,\\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\\+\\$,\\w]+@)[A-Za-z0-9.-]+)((?:\\/[\\+~%\\/.\\w-_]*)?\\??(?:[-\\+=&;%@.\\w_]*)#?(?:[.\\!\\/\\\\w]*))?)';

const REG_URL = new RegExp(regUrlBase);
const REG_URL_HASH = new RegExp(regUrlBase + '#');
const DEFAULT_TYPE_NAME = 'default';
const BRACKET_REG = /[【】]/g;


@Inject('$scope', '$element')
export default class SMSEditorCtrl {

	constructor($scope, $element) {
		this.createInput = this.createInput.bind(this);
		this.parseHTML = this.parseHTML.bind(this);
		this.insertKeyword = this.insertKeyword.bind(this);
		this.reFocus = this.reFocus.bind(this);
		this.rememberFocus = this.rememberFocus.bind(this);
		this.onChange = this.onChange.bind(this);

		this.EMO_BASE_URL = '../src/components/sms-editor/emo/';

		// 表情图标
		// this.emoIcons = ['emo-1', 'emo-2', 'emo-3', 'emo-4', 'emo-5'];

		// 初始化编辑框及显示
		this.opts || (this.opts = {});

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
	static flatCode(text = '') {
		return text.replace(/(&nbsp;?)|(&lt;?)|(&gt;?)|(&amp;?)/g, result => {
			return '&amp;' + result.slice(1);
		})
		.replace(/</g, '&lt;');
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
		this._content.innerHTML = this.parseImage(this.parseTag(content));
		this.checkEmpty();
		this.parseHTML();
	}


	/**
	 * 构造插入到文本编辑器的 input 标签
	 * @param {string} text - 标签名
	 * @param {string} type - 标签类型
	 * @returns {string}
	 */
	createInput(text, type = DEFAULT_TYPE_NAME) {
		// 暂时不需要
		// const padding = (this.keywordTypes.length < 1 || !type) ? 0 : 1.5;

		// return `&nbsp;<input class="sms-keyword-inserted ${padding ? type : DEFAULT_TYPE_NAME}" value="${text}" style="width: ${padding + text.length}em" disabled>&nbsp;`;
		return `<input class="sms-keyword-inserted ${type}" value="${text}" style="width: ${text.length}em" disabled>`;
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
		return SMSEditorCtrl.flatCode(text).replace(/\$\$_(?:\[(\S*?)])?(.+?)_\$\$/g, (result, $1, $2) => {
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
	 * 解析富文本编辑器中的 HTML, 生成预览文本和最终存到服务器的文本
	 */
	parseHTML() {
		const parsed = this._content.innerHTML.trim()
			.replace(/disabled(="[^"]*")?/i, '')
			.replace(/style="[^"]+"/i, '')
			.trim();

		const inputReg = /<input\s+class="sms-keyword-inserted\s*([^"]*)"\s+value="([^"]+)"[^>]*>/ig;

		const imgReg = /<img\s+data-emo-name="([^"]+)"\s+src="([^"]+)"\s?\/?>/ig;

		this._tempHolder.innerHTML = parsed
			.replace(inputReg, (result, $1, $2) => {
				return SMSEditorCtrl.createTagPreview(this.opts.keywords, $2, $1);
			})
			.replace(imgReg, (result, $1, $2) => {
				return `{{${$2}}}`;
			});

		// 图片, 关键字高亮, URL 及电话号码下划线
		this.opts.preview = SMSEditorCtrl.flatCode(this._tempHolder.textContent
				.trim())
				.replace(/\{\{([^}]+)}}/g, (result, $1) => {
					return `<img src="${$1}">`;
				})
				.replace(/%([^%]+)%/g, (result, $1) => {
					return `<span class="sms-tag-preview">${$1.trim()}</span>`;
				})
				.replace(REG_URL_HASH, result => {
					return `<a href="javascript: void(0);">${result.slice(0, result.length - 1)}</a>#`;
				})
				.replace(/((\D|\b)1[3-9]\d-?\d{4}-?\d{4}(\D|\b))|((\D)([08][1-9]\d{1,2}-?)?[2-9]\d{6,7}(\D))/g, (result, $1, $2, $3) => {
					return `${$2}<a href="javascript: void(0);">${result.slice(1, result.length - 1)}</a>${$3}`;
				});

		this.opts.text = parsed
			.replace(inputReg, (result, $1, $2) => {
				if ($1 === DEFAULT_TYPE_NAME) {
					return `$$_${this.keywordTextNameConvert($2)}_$$`;
				}
				return `$$_[${$1}]${this.keywordTextNameConvert($2)}_$$`;
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
			})
			.trim();
	}


	/**
	 * 往富文本编辑器中插入标签
	 * @param {string} text - 标签名
	 * @param {string} type - 标签类型
	 */
	insertKeyword(text, type) {
		this.reFocus();
		document.execCommand('insertHTML', false, this.createInput(text, type));
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
	 * 重新定位光标
	 * - 如果记忆了光标位置, 返回
	 * - 如果之前没有操作过, 则定位到文本框最后
	 */
	reFocus() {

		if (this._range) {
			const selection = window.getSelection();

			selection.removeAllRanges();
			selection.addRange(this._range);
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
	 * 不许贴图片和乱七八糟的 html, 也不许贴【 和 】
	 * - 这条代码如果在 firefox 里跑通了, 晚上就去吃大餐 by AshZhang@2016.3.29
	 * @param e
	 */
	onPaste(e) {
		const event = e.originalEvent || e,
			htmlContent = event.clipboardData.getData('text/html');

		if (htmlContent.indexOf('sms-keyword-inserted') > -1 || htmlContent.indexOf('data-emo-name') > -1) return;

		const textContent = event.clipboardData.getData('text/plain');

		e.preventDefault();
		this._hasInvalidStr = BRACKET_REG.test(textContent);
		this._invalidStrClosed = !this._hasInvalidStr;
		document.execCommand('insertHTML', false, textContent.replace(BRACKET_REG, ''));
	}
}
