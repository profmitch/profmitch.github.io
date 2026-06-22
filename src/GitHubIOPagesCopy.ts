// import { glob } from "glob";
import { readFile } from "fs/promises";
import path from "path";
//import { execSync } from "child_process";
import yaml from "js-yaml";
import { genCopy } from "./GenLib/fsystem.js";

type XOR<A, B> =
  | (A & { [K in keyof B]?: never })
  | (B & { [K in keyof A]?: never });

type TemplateSection = {
	name: string;
	in: string; // file template
	out: string; // finished file
	sections: {
		section: string; // in template file
		ref: number;
		input: string;
		output: string;
	}[];
};

type CopyList = {
	destpath: string;
	items: ({
		src: string;
		option?: "tree"
		templateRef?: number;
	} & XOR<
		{ reldest: string },
		{ dest: string; }
	>)[];
	courseFiles: {
		templates: TemplateSection[];
	};
};


(async () => {
	let dest: string;
	const templateRefs: {
		ref: number;
		dest: string;
		src: string;
		option?: string;
	}[] = [];
	const yamlFile = await readFile("../sync-map.yaml");
	const syncInfo: CopyList = yaml.load(yamlFile.toString()) as CopyList;
	const docsroot = syncInfo.destpath;
	for (const item of syncInfo.items) {
		if (item.templateRef)
			templateRefs.push({
				ref: item.templateRef,
				dest: item.dest ?? item.reldest,
				src: item.src,
				option: item.option
			});
		if (item.reldest)
    		dest = path.join(docsroot, item.reldest);
		else if (item.dest)
			dest = item.dest;
		else
			throw Error("A destination either relative or absolute was not given");
		let result 
		if ((result = await genCopy(item.src, dest, item.option)) !== undefined)
			console.log(`Message = ${result}`);
	}

	// Optional Git automation
	//	execSync("git add .", { stdio: "inherit" });
	//	execSync(`git commit -m "automated docs sync"`, { stdio: "inherit" });
	//	execSync("git push", { stdio: "inherit" });


	// courseFiles.html build (students, instructor)
/*
	const templates = syncInfo.courseFiles?.templates;
	let templateFileContent, templateRef;
	if (templates)
		for (const template of templates) {
			// open the template file
			try {
				templateFileContent = await readFile(template.in);
			} catch (exc) {
				return console.error(`Error reading template file '${template.in}'\n --> ${exc}`);
			}
			
			for (const section of template.sections) {
				// if there is a list of files to read, get those file names
				// use the /** /*.ext to achieve recursion
				if ((templateRef = templateRefs.find(elem => elem.ref == section.ref)) == undefined) {
					console.error('YAML file does not reference template file properly');
					continue;
				}
				const sectionFiles = await glob(templateRef.src);
				const elements = [];
				// with output, use to build repettive elements
				if (section.output.search(/[\s,]*ul[\s,]* /) >= 0)
					elements.push("<ul>");
				if (section.output.search(/[\s,]*a[\s,]* /) >= 0)
					elements.push("<a>");

				
				// use input to set the name up for any text content	
				// look for the section sign
				

			}
		} */
	console.log("Sync complete.");
})();