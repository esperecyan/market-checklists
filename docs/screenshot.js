import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas@1.3.3/dist/html2canvas.esm.js';
import dialogPolyfill from 'https://cdn.jsdelivr.net/npm/dialog-polyfill@0.5.6/dist/dialog-polyfill.esm.js';

const { screenshots } = await (await fetch('data.json')).json();
document.head.insertAdjacentHTML('beforeend', `
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/dialog-polyfill@0.5.6/dist/dialog-polyfill.css">
	<style>
		dialog.screenshot[open] {
			width: 90vw;
			height: 90vh;
			display: grid;
			overflow: hidden;
		}
		dialog.screenshot [name="close"] {
			justify-self: start;
		}
		dialog.screenshot dl {
			display: grid;
			grid-template-columns: ${new Array(screenshots.length).fill('1fr').join(' ')};
		}
		dialog.screenshot dt {
			grid-row: 1;
		}
		dialog.screenshot dd {
			margin-left: unset;
			overflow: hidden;
		}
		dialog.screenshot canvas {
			transform-origin: top left;
			transform: scale(${1 / screenshots.length});
		}
	</style>
`);

const isJa = navigator.language.toLowerCase().startsWith('ja');

document.body.insertAdjacentHTML(
	'afterbegin',
	`<button name="screenshot">${isJa ? 'チェックシートをダウンロード' : 'Download the checksheets'}</button>`,
);

document.body.insertAdjacentHTML('beforeend', `<dialog class="screenshot">
	<button name="close">Close</button>
	<dl>${screenshots.map(
		({ downloadLinkLavel: { en, ja } }) => `<dt><a>${isJa ? ja : en}</a></dt><dd><progress /></dd>`,
).join('')}</dl></dialog>`);
/** @type {HTMLDialogElement} */
const dialog = document.querySelector('dialog.screenshot');
dialogPolyfill.registerDialog(dialog);
const downloadLinks = dialog.getElementsByTagName('a');
const screenshotParents = dialog.getElementsByTagName('dd');

const main = document.getElementsByTagName('main')[0];

document.body.addEventListener('click', async function (event) {
	switch (event.target.name) {
		case 'screenshot':
			dialog.showModal();
			for (let i = 0; i < screenshots.length; i++) {
				/** @type {HTMLCanvasElement} */
				const canvas = await html2canvas(main, screenshots[i]);
				canvas.toBlob(function (blob) {
					downloadLinks[i].href = URL.createObjectURL(blob);
					const { en, ja } = screenshots[i].downloadFileName;
					downloadLinks[i].download = `${isJa ? ja : en} ${new Date().toLocaleString([ ], {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						weekday: 'short',
						hour: '2-digit',
						minute: '2-digit',
						second: '2-digit',
						timeZoneName: 'short',
					})}.png`;
				});
				screenshotParents[i].replaceChildren(canvas);
			}
			break;

		case 'close':
			dialog.close();
			for (const a of downloadLinks) {
				a.removeAttribute('download');
				if (a.href) {
					URL.revokeObjectURL(a.href);
					a.removeAttribute('href');
				}
			}
			for (const parent of screenshotParents) {
				parent.innerHTML = '<progress />';
			}
			break;
	}
});
