const fs = require('fs');
const path = require('path');

function listFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);

        if (stats.isDirectory()) {
            fileList = listFiles(filePath, fileList); // Recursively list files in subdirectory
        } else {
            fileList.push(filePath);
        }
    });

    return fileList;
}

const directoryPath = './libs'; // Change this to your desired directory
const allFiles = listFiles(directoryPath);
const outputFile = 'files.txt';

fs.writeFileSync(outputFile, allFiles.join('\n'), 'utf8');
console.log(`All files have been saved to ${outputFile}`);
