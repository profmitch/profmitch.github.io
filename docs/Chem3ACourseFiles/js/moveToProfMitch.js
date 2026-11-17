import * as jsYaml from "js-yaml";
import { existsSync } from "node:fs";
import fs from "fs/promises";
import path from "path";
import fastGlob from "fast-glob";
const scriptPath = new URL(import.meta.url).pathname;
const scriptName = path.basename(scriptPath);
console.log(`========\nSTARTING Node in path '${scriptPath}' is running script '${scriptName}'\n========`);
const yamlText = await fs.readFile("filelist.yaml", "utf8");
const yamlData = jsYaml.load(yamlText);
if (existsSync(yamlData.destPath) == false) {
    console.error(`Destination path '${yamlData.destPath}' does not exist or is not specified. Exiting...`);
    process.exit(1);
}
function resolveDestPath(path) {
    return path.replace(/^\*[\/\\]/, `${yamlData.destPath}/`);
}
(async () => {
    let matches, copyOps = [];
    { // copy operations 
        console.log("\n========== copy operations");
        for (const item of yamlData.pathsToCopy) {
            if (item.src.search(/\/[\*\?]+$/) >= 0) {
                console.log(`\n     path with glob chars: '${item.src}'`);
                matches = await fastGlob(item.src, { dot: true, onlyFiles: false });
                console.log(`     ${matches.length} matches found\n` +
                    "\n     - " + matches.join("\n     - "));
                for (const match of matches)
                    copyOps.push({ src: match, dest: resolveDestPath(item.dest) });
            }
            else {
                item.src = resolveDestPath(item.src);
                if (existsSync(item.src)) {
                    const dest = path.join(resolveDestPath(item.dest), path.basename(item.src));
                    console.log(`  - single item path: '${item.src}'` +
                        `       -> '${dest}'`);
                    copyOps.push({ src: item.src, dest });
                }
                else
                    console.error(`Source item '${item.src}' does not exist. Skipping to next item...`);
            }
        }
        if (copyOps.length > 0)
            for (const item of copyOps) {
                if (existsSync(item.src) && existsSync(item.dest)) {
                    const srcInfo = await fs.lstat(item.src);
                    const destInfo = await fs.lstat(item.dest);
                    if (srcInfo.isFile() == true && destInfo.isDirectory() == true) {
                        //  console.log("src is file and dest is dir...adding file name to dest path");
                        item.dest = path.join(item.dest, path.basename(item.src));
                    }
                }
                await fs.cp(item.src, item.dest, { recursive: true, force: true });
            }
    }
    console.log("\n========== move operations");
    if (yamlData.move && yamlData.move.length > 0)
        for (const item of yamlData.move) {
            item.src = resolveDestPath(item.src);
            item.dest = resolveDestPath(item.dest);
            if (existsSync(item.src) == false)
                console.error(`MOVE op ERROR: '${item.src}' does not exist. Skipping...`);
            else {
                const itemInfo = await fs.lstat(item.src);
                if (itemInfo.isDirectory()) {
                    const entries = await fs.readdir(item.src);
                    for (const name of entries) {
                        const from = path.join(item.src, name);
                        const to = path.join(item.dest, name);
                        await fs.rename(from, to);
                    }
                }
                else
                    await fs.rename(item.src, item.dest);
            }
        }
    console.log("\n========== move with renam operations");
    if (yamlData.moveWithRename && yamlData.moveWithRename.length > 0)
        for (const item of yamlData.moveWithRename) {
            item.src = resolveDestPath(item.src);
            if (existsSync(item.src) == false)
                console.error(`MOVE WITH RENAME op ERROR: '${item.src}' does not exist. Skipping...`);
            else
                await fs.rename(item.src, resolveDestPath(item.dest));
        }
    console.log("\n========== delete operations");
    if (yamlData.delete && yamlData.delete.length > 0)
        for (const item of yamlData.delete) {
            item.path = resolveDestPath(item.path);
            if (existsSync(item.path) == false)
                console.error(`DELETE op ERROR: '${item.path}' does not exist. Skipping...`);
            else if (!item.type)
                console.error(`DELETE op ERROR: 'Type of deleteion for '${item.path}' not specified. Skipping...`);
            else {
                const stat = await fs.lstat(item.path);
                if (stat.isFile() && item.type == "fileOnly")
                    await fs.unlink(item.path);
                else { // directory-related
                    if (item.type == "dirFilesOnly") {
                        const entries = await fs.readdir(item.path, { withFileTypes: true });
                        for (const entry of entries)
                            if (entry.isFile())
                                await fs.rm(path.join(item.path, entry.name), { force: true });
                    }
                    else if (item.type == "dirTreeItems") {
                        const entries = await fs.readdir(item.path, { withFileTypes: true });
                        await Promise.all(entries.map(entry => {
                            const childPath = path.join(item.path, entry.name);
                            return fs.rm(childPath, { recursive: true, force: true });
                        }));
                    }
                    else if (item.type == "dirBranch")
                        await fs.rm(item.path, { recursive: true, force: true });
                }
            }
        }
    console.log(`========\nCompleted running of '${scriptName}'\n========`);
})();
//# sourceMappingURL=moveToProfMitch.js.map