import express from 'express';
import { readdir } from 'fs/promises';
import path from 'path';
import { SERVER_CONFIG, PORT } from "./localFileListing[browser].js";
const excludedFolders = [
    'node_modules',
    '___OldHTML',
    '___NotesToWorkOn',
    'images'
];
const app = express();
function walkDir(dir, filter, excludeDirs = []) {
    return new Promise((resolve, reject) => {
        readdir(dir, { withFileTypes: true })
            .then((dirents) => {
            const files = [];
            for (const dirent of dirents) {
                const fullPath = path.join(dir, dirent.name);
                if (dirent.isDirectory()) {
                    if (excludeDirs.some(ex => dirent.name.includes(ex)))
                        continue;
                    // const subFiles = await 
                    walkDir(fullPath, filter, excludeDirs)
                        .then((subFiles) => {
                        files.push(...subFiles);
                    }).catch((err) => {
                        console.log(`Error: ${err}`);
                    });
                }
                else if (filter(dirent.name))
                    files.push(fullPath);
            }
            resolve(files);
        }).catch((err) => {
            reject(`Failed to list files\nError: ${err}`);
        });
    });
}
const getDirListing = (config) => (_req, res) => {
    walkDir(config.staticRoot, config.filesFilter, excludedFolders)
        .then((allFiles) => {
        // Optional: Convert to relative URLs for front-end use
        const relPaths = allFiles.map(f => path.relative(config.staticRoot, f).replace(/\\/g, '/'));
        res.json(relPaths);
    }).catch((err) => {
        res.status(500).send(`Failed to list files\nError: ${err}`);
    });
};
app.use((_req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5500'); // Allow requests from your web page's origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // Add allowed methods
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // Add allowed headers
    next();
});
for (const config of SERVER_CONFIG) {
    console.log(`setting up '${config.path}'`);
    app.get(config.path, getDirListing(config));
    app.use(config.path, express.static(config.staticRoot));
}
app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}`));
//# sourceMappingURL=FileListingExpressServer.js.map