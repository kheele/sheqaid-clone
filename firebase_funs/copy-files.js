const path = require('path');
const fs = require('fs-extra');

const args = process.argv.slice(2);
const project = args.pop();

const copy = ({src, dest}) => {
    console.log(src);
    console.log(dest);
    fs.copySync(src, dest, {overwrite: true}, function (err) {
        if (err) {
            console.error(destDir, err);
        } else {
            console.log(destDir, "success!");
        }
    });
};

[
    {
        src: path.join(__dirname, 'fn/callables'),
        dest: path.join(__dirname, `../${project}/functions/fn/callables`)
    },
    {
        src: path.join(__dirname, 'libs'),
        dest: path.join(__dirname, `../${project}/functions/libs`)
    }
].forEach(copy);
