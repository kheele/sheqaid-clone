const path = require('path');
const fs = require('fs-extra');

const args = process.argv.slice(2);
const project = args.pop();

const srcDir = path.join(__dirname, 'fn/callables');
const destDir = path.join(__dirname, `../${project}/functions/fn/callables`);

console.log(srcDir);
console.log(destDir);
fs.copySync(srcDir, destDir, {overwrite: true}, function (err) {
    if (err) {
        console.error(destDir, err);
    } else {
        console.log(destDir, "success!");
    }
});

