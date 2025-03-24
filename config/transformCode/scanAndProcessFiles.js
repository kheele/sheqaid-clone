const fs = require('fs/promises');
const path = require('path');

module.exports = async function scanAndProcessFiles(directory, regex, newFunc) {
    const outputLines = [];

    async function processFile(filePath, regex) {
        try {
            const fileContent = await fs.readFile(filePath, 'utf-8');

            const match = fileContent.match(regex);

            if (match) {
                const dynamicPath = match[1]; // Capture the dynamic path from the regex.
                const filename = path.basename(filePath, path.extname(filePath));
                const functionName = filename;
                outputLines.push(`export const ${functionName} = ${newFunc}("${dynamicPath}");`); // Use the captured path.
            }
        } catch (error) {
            console.error(`Error processing file ${filePath}:`, error);
        }
    }

    async function scanDirectory(dir, regex) {
        try {
            const entries = await fs.readdir(dir, {withFileTypes: true});

            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);
                if (entry.isDirectory()) {
                    await scanDirectory(fullPath, regex);
                } else if (entry.isFile() && entry.name.endsWith('.js')) { // or .js
                    await processFile(fullPath, regex);
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${dir}:`, error);
        }
    }

    await scanDirectory(directory, regex);

    if (outputLines.length > 0) {
        console.log(outputLines.join('\n'));
    } else {
        console.log("No matching files found.");
    }
}