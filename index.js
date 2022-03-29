const openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp
const { readFile, writeFile } = require('fs/promises');

const DEFAULT_PASSPHRASE = 'LINKAPI_VINDI)(@_1235jhsd#EEO)';

const readFileFn = async (filepath) => (await readFile(filepath)).toString();

const decrypt = async (pubkey, privkey, encrypted) => {
	const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0];
	await privKeyObj.decrypt(DEFAULT_PASSPHRASE);

	const options = {
		message: await openpgp.message.readArmored(encrypted),
		publicKeys: (await openpgp.key.readArmored(pubkey)).keys,
		privateKeys: [privKeyObj],
	};

	openpgp
		.decrypt(options)
		.then((plaintext) => {
			console.log(plaintext.data);

			return plaintext.data;
		})
		.then(async (data) => {
			await writeFile('./arq_teste_vindi_unicef_2021_sem_chd.csv', data);
		});
};

(async () => {
	await openpgp.initWorker({ path: 'openpgp.worker.js' });

	let privkey = await readFileFn('./linkapiprivate.pgp');
	let pubkey = await readFileFn('./linkapipublic.pgp');

	let encryptedFile = await readFileFn('./arq_teste_vindi_unicef_2021_sem_chd.csv.asc');

	await decrypt(pubkey, privkey, encryptedFile);
})();
