const scanAndProcessFiles = require('./scanAndProcessFiles');

const directoryToScan = '../../src/mutations/all';
const regex = /mutation insert(\w+)Mutation\(\$object: (\w+)_insert_input!\) {\s*insert_(\w+)_one\(\s*object: \$object\s*\) {\s*id\s*}\s*}/s;
scanAndProcessFiles(directoryToScan, regex, "create");