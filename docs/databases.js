/**
 * Indexed Databaseのラッパー。
 * @module databases
 */

/**
 * キーにデータベース名を持つ接続したデータベースの連想配列。
 * @type {object.<IDBDatabase>}
 */
const dbs = {};

/**
 * {@link IDBRequest} を {@link Promise} へ変換します。
 * @param {IDBRequest} request
 * @returns {Promise.<*>}
 */
function promise(request)
{
	return new Promise(function (resolve, reject) {
		request.addEventListener('success', function (event) {
			resolve(event.target.result);
		});
		request.addEventListener('error', function (event) {
			reject(event.target.error);
		});
	});
}

/**
 * 保管庫を取得します。
 *
 * 指定された名前の保管庫が存在しなければ作成します。
 * @param {string} dbName - データベース名。
 * @param {string} storeName - 保管庫名。
 * @param {IDBTransactionMode} mode - 文字列「readonly」「readwrite」のいずれか。
 * @returns {Promise.<IDBObjectStore>}
 */
async function objectStore(dbName, storeName, mode = 'readonly')
{
	if (!dbs[dbName]) {
		const request = indexedDB.open(dbName, 1);
		request.addEventListener('upgradeneeded', function (event) {
			event.target.result.createObjectStore(storeName);
		});
		dbs[dbName] = await promise(request);
	}

	return dbs[dbName].transaction(storeName, mode).objectStore(storeName);
}

/**
 * データベースへ値を保存します。
 *
 * すでに同じキーが存在する場合は上書きします。
 * @param {string} dbName - データベース名。
 * @param {string} storeName - 保管庫名。
 * @param {string} value 値。
 * @param {string} key キー。
 * @returns {Promise.<void>}
 */
export async function put(dbName, storeName, value, key)
{
	await promise((await objectStore(dbName, storeName, 'readwrite')).put(value, key));
}

/**
 * 指定したキーの値を取得します。
 * @param {string} dbName - データベース名。
 * @param {string} storeName - 保管庫名。
 * @param {*} key
 * @returns {Promise.<*>}
 */
export async function get(dbName, storeName, key)
{
	return promise((await objectStore(dbName, storeName)).get(key));
}
