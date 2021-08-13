import h from './h.js';
import * as Databases from './databases.js';

const DB_NAME = 'market-checklists';
const STORE_NAME = 'market-checklists';

const key = location.pathname.replace(/\/(index\.html)?$/, '');

const checkboxes = document.getElementsByTagName('input');

fetch('locations.json').then(async function (response) {
	let html = '<dl>';
	for (const { group, locations } of await response.json()) {
		html += h`
			<dt>${group}</dt>
			<dd>
				<ul data-group="${group}">`;
		for (const location of locations) {
			const id = Math.random().toString();
			html += h`
				<li data-location="${location}">
					<input type="checkbox" name="${location}" id="${id}" />
					<label for="${id}">${location}</label>
				</li>
			`;
		}
		html += `</ul>
			</dd>`;
	}
	html += '</dl>';

	document.getElementsByTagName('main')[0].insertAdjacentHTML('beforeend', html);

	const checkedLocations = await Databases.get(DB_NAME, STORE_NAME, key);
	if (!checkedLocations) {
		return;
	}

	for (const checkbox of checkboxes) {
		if (checkedLocations.includes(checkbox.name)) {
			checkbox.checked = true;
		}
	}
});

addEventListener('change', function () {
	Databases.put(
		DB_NAME,
		STORE_NAME,
		Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.name),
		key,
	);
});
