
/**
 * XMLの特殊文字と文字参照の変換テーブル。
 * @constant {Object.<string>}
 */
const CHARACTER_REFERENCES_TRANSLATION_TABLE = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&apos;',
};

/**
 * テンプレート文字列のタグとして用いることで、式内にあるXMLの特殊文字を文字参照に置換します。
 * @example
 * // returns "<code>&lt;a href=&quot;https://example.com/&quot;link text&lt;/a&gt;</code>"
 * h`<code>${'<a href="https://example.com/">link text</a>'}</code>`;
 * @param {string[]} htmlTexts
 * @param {...string} plainText
 * @returns {string}
 */
export default function (htmlTexts, ...plainTexts) {
	return String.raw({ raw: htmlTexts }, ...plainTexts.map(plainText => String(plainText).replace(
		/[&<>"']/g,
		specialCharcter => CHARACTER_REFERENCES_TRANSLATION_TABLE[specialCharcter],
	)));
}
