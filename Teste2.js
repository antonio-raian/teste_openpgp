const openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp
const fs = require('fs');

const encryptDecryptFunction = async (pubkey, privkey) => {
	console.log('1');
	const privKeyObj = (await openpgp.key.readArmored(privkey)).keys[0];
	await privKeyObj.decrypt('LINKAPI_VINDI)(@');

	const publicKeys = (await openpgp.key.readArmored(pubkey)).keys;
	console.log({ privKeyObj, publicKeys });

	// let options = {
	// 	message: openpgp.message.fromBinary(fs.createReadStream('teste.csv')), // input as Message object
	// 	publicKeys, // for encryption
	// 	privateKeys: [privKeyObj], // for signing (optional)
	// };

	// openpgp
	// 	.encrypt(options)
	// 	.then((ciphertext) => {
	// 		encrypted = ciphertext.data; // '-----BEGIN PGP MESSAGE ... END PGP MESSAGE-----'
	// 		return encrypted;
	// 	})
	// 	.then(async (encrypted) => {
	// 		const chunks = [];
	// 		console.log('Arquivou');
	// 		let enen = await new Promise((resolve, reject) => {
	// 			encrypted.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
	// 			encrypted.on('error', (err) => reject(err));
	// 			encrypted.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
	// 		});
	// 		fs.writeFileSync('teste.csv.gpg', enen);
	// 	})
	// 	.then((res) => {
	const options = {
		message: openpgp.message.fromBinary(fs.createReadStream('teste.csv.gpg')),
		// message: await openpgp.message.readArmored(encrypted),
		publicKeys, // for verification (optional)
		privateKeys: [privKeyObj], // for decryption
		format: 'binary',
	};
	console.log('2');

	openpgp.decrypt(options).then(async (plaintext) => {
		const chunks = [];

		let decripted = await new Promise((resolve, reject) => {
			plaintext.data.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
			plaintext.data.on('error', (err) => reject(err));
			plaintext.data.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
		});

		console.log({ decripted });
		return; // 'Hello, World!'
		// });
	});
};

(async () => {
	await openpgp.initWorker({ path: 'openpgp.worker.js' }); // set the relative web worker path
	// put keys in backtick (``) to avoid errors caused by spaces or tabs
	// const keys = await openpgp.generateKey({
	// 	curve: 'ed25519',
	// 	userIds: [{ name: 'Test', email: 'teste@gmail.com' }],
	// });

	// let privkey = keys.privateKeyArmored;
	// let pubkey = keys.publicKeyArmored;

	// encryptDecryptFunction(pubkey, privkey);
	const publicKeyArmored = fs.readFileSync('./public.pgp', { encoding: 'utf8' });
	const privateKeyArmored = fs.readFileSync('./private.pgp', {
		encoding: 'utf8',
	});

	// console.log({ privateKeyArmored });

	encryptDecryptFunction(publicKeyArmored, privateKeyArmored);
})();
