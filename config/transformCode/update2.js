const scanAndProcessFiles = require('./scanAndProcessFiles');

const directoryToScan = '../../src/mutations/all';
const regex = /mutation update(\w+)Mutation\(\$id: (\w+)_pk_columns_input!, \$_set: (\w+)_set_input!\) {\s*update_(\w+)_by_pk\(pk_columns: \$id, _set: \$_set\) {\s*id\s*}\s*}/s;

// const regex = /mutation update\w+Mutation(\$id: w+_pk_columns_input!, \$_set: w+_set_input!) {\s*update_w+_by_pk(pk_columns: \$id, _set: \$_set) {\s*id\s*}}\s*`;?/s;
scanAndProcessFiles(directoryToScan, regex, "update");