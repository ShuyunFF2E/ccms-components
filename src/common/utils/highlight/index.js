export default function highlight() {
	return function(content, hiText) {
		return content.replace(new RegExp(hiText, 'gi'), '<span class="highlight">$&</span>');
	};
}
