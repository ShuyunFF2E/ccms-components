/**
 * @author fengqiu.wu
 */

export default function tabTitleTranscludeLink($scope, $element, $attrs, $tab, $transcludeFn) {

	// 过滤没用节点
	let contents = [].slice.apply($transcludeFn()).filter(node => {
		return node.nodeType !== 3 || node.nodeType === 3 && !/^[\s\n]*$/.test(node.nodeValue);
	});

	if (contents.length) {
		$tab.contents = contents;
	}

	$tab.tabset.addTab($tab);

	// 设置 tab title
	window.requestAnimationFrame(function() {
		$tab.title && $element.html($tab.title);
	});

}
