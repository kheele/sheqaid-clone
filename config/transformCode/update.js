const scanAndProcessFiles = require('./scanAndProcessFiles');

const directoryToScan = '../../src/mutations/all';
const regex = /export default async \(\w+: \w+\) => {\s*const update = sockets\.of\("([^"]+)"\)\.fn\("update"\);\s*return update\(\w+\);\s*};?/s;
scanAndProcessFiles(directoryToScan, regex, "update");