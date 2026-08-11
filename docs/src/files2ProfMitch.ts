import * as jsYaml from "js-yaml";
import { existsSync } from "node:fs";
import fs from "fs/promises";
import path from "path";
import fastGlob from "fast-glob";
// use the global `process` provided by Node.js; no import to avoid missing type declarations

type ProcessInfo =  {
   scriptPath: string;
   scriptName: string;
};

interface YamlConfig {
   destPath: string;
   pathsToCopy: {
      src: string;
      dest: string;
   }[];
   move: {
      src: string;
      dest: string;
   }[];
   moveWithRename: {
      src: string;
      dest: string;
   }[];
   delete: {
      path: string;
      type: "fileOnly" | "dirFilesOnly" | "dirTreeItems" | "dirBranch";
   }[];
}

function resolveLeadingPath(path: string, destPath: string): string {
   return path.replace(/^\*[\/\\]/, `${destPath}/`);
}

async function processMoves(yamlData: YamlConfig): Promise<void> {
   let matches: string[],
      copyOps: {src: string; dest: string;}[] = [];
   { // copy operations 
      console.log("\n========== copy operations");
      for (const item of yamlData.pathsToCopy) {
         if (item.src.search(/\/[\*\?]+$/) >= 0) {
            console.log(`\n     path with glob chars: '${item.src}'`);
            matches = await fastGlob(item.src, { dot: true, onlyFiles: false });
            console.log(`     ${matches.length} matches found\n` +
               "\n     - " + matches.join("\n     - "));
            for (const match of matches)
               copyOps.push({src: match, dest: resolveLeadingPath(item.dest, yamlData.destPath)});
         } else {
            item.src = resolveLeadingPath(item.src, yamlData.destPath);
            if (existsSync(item.src)) {
               const dest = path.join(resolveLeadingPath(item.dest, yamlData.destPath), path.basename(item.src));
               console.log(
                     `  - single item path: '${item.src}'` + 
                     `       -> '${dest}'`);
               copyOps.push({src: item.src, dest});
            }  else
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
         item.src = resolveLeadingPath(item.src, yamlData.destPath);
         item.dest = resolveLeadingPath(item.dest, yamlData.destPath);
         if (existsSync(item.src) == false)
            console.error(`MOVE op ERROR: '${item.src}' does not exist. Skipping...`);
         else {
            const itemInfo = await fs.lstat(item.src)
            if (itemInfo.isDirectory()) {
               const entries = await fs.readdir(item.src);
               for (const name of entries) {
                  const from = path.join(item.src, name);
                  const to = path.join(item.dest, name);
                  await fs.rename(from, to);
               }
            } else
               await fs.rename(item.src, item.dest);
         }
      }

   console.log("\n========== move with renam operations");
   if (yamlData.moveWithRename && yamlData.moveWithRename.length > 0)
      for (const item of yamlData.moveWithRename) {
         item.src = resolveLeadingPath(item.src, yamlData.destPath);
         if (existsSync(item.src) == false)
            console.error(`MOVE WITH RENAME op ERROR: '${item.src}' does not exist. Skipping...`);
         else 
            await fs.rename(item.src, resolveLeadingPath(item.dest, yamlData.destPath));
      }

   console.log("\n========== delete operations");
   if (yamlData.delete && yamlData.delete.length > 0)
      for (const item of yamlData.delete) {
         item.path = resolveLeadingPath(item.path, yamlData.destPath);
         if (existsSync(item.path) == false)
            console.error(`DELETE op ERROR: '${item.path}' does not exist. Skipping...`);
         else if (!item.type)
            console.error(`DELETE op ERROR: 'Type of deleteion for '${item.path}' not specified. Skipping...`);
         else {
            const stat = await fs.lstat(item.path);
            if (stat.isFile() && item.type == "fileOnly")
               await fs.unlink(item.path);
            else {  // directory-related
               if (item.type  == "dirFilesOnly") {
                  const entries = await fs.readdir(item.path, { withFileTypes: true });
                  for (const entry of entries)
                     if (entry.isFile())
                        await fs.rm(path.join(item.path, entry.name), { force: true });
               } else if (item.type == "dirTreeItems") {
                  const entries = await fs.readdir(item.path, { withFileTypes: true });
                  await Promise.all(entries.map(entry => {
                     const childPath = path.join(item.path, entry.name);
                     return fs.rm(childPath, { recursive: true, force: true });
                  }));
               } else if (item.type == "dirBranch")
                  await fs.rm(item.path, {recursive: true, force: true});
            }
         }
      }
}

async function getYamlContent(YamlFileName: string): Promise<YamlConfig> {
   const yamlText = await fs.readFile(YamlFileName, "utf8");
   const yamlData: YamlConfig = jsYaml.load(yamlText) as YamlConfig;

   // handle fatal errors now
   if (existsSync(yamlData.destPath) == false) {
      console.error(`Destination path '${yamlData.destPath}' does not exist or is not specified. Exiting...`)
      process.exit(1);
   }
   return yamlData;
}

function main(argv: string[]) {
   const scriptPath: string = new URL(import.meta.url).pathname;
   const processInfo: ProcessInfo = {
      scriptPath: scriptPath,
      scriptName: path.basename(scriptPath)
   };
   console.log(`========\nSTARTING Node in path '${processInfo.scriptPath}' is running script '${processInfo.scriptName}'\n========`);

   // evaluate flags/options here
   (async () => {
      const yamlData = await getYamlContent("filelist.yaml", );
      await processMoves(yamlData);      
   })();
   console.log(`========\nCompleted running of '${processInfo.scriptName}'\n========`);
}

main(process.argv);