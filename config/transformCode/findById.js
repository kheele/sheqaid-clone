const scanAndProcessFiles = require('./scanAndProcessFiles');

const directoryToScan = '../../src/mutations/all';
// const regex = /export default async \(\w+: \w+\) => {\s*const findById = sockets\.of\('([^"]+)'\)\.fn\("findById"\);\s*return findById\(\w+\);\s*};?/s;
const regex = /export default async \(\w+: \w+\) => {\s*const findById = sockets\.of\('([^"]+)'\)\.fn\('findById'\);\s*return findById\(\w+\);\s*};?/s;
scanAndProcessFiles(directoryToScan, regex);