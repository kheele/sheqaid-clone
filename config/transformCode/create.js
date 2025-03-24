const scanAndProcessFiles = require('./scanAndProcessFiles');

const directoryToScan = '../../src/mutations/all';
const regex = /export default async \(\w+: \w+\) => {\s*const create = sockets\.of\("([^"]+)"\)\.fn\("create"\);\s*return create\(\w+\);\s*};?/s;
scanAndProcessFiles(directoryToScan, regex);