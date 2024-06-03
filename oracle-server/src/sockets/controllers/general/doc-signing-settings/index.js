const jwt = require('jsonwebtoken');

const {DOCUSEAL_API_KEY} = process.env;

eventManager.on("doc-signing-settings/api/docuseal/builder_token", async (socket, data) => {
	if (!data) return;

	console.log('doc-signing-settings/api/docuseal/builder_token', data)

	const {
		plugin_key,
		module_key,
		doc,
		doc_name: name,
		// external_id,
	} = data;
	
	const folder_name = `${plugin_key}/${module_key}`;

	const token = jwt.sign({
		user_email: 'kheelet@gmail.com',
		// integration_email: 'saas-user@company.com',
		// external_id: 'TestForm123',
		name,
		folder_name,
		// document_urls: [url],
		document_urls: ['https://www.irs.gov/pub/irs-pdf/fw9.pdf'],
	}, DOCUSEAL_API_KEY);
	
	return token;
});
