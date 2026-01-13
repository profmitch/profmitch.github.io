import { readFile, readdir, copyFile } from "fs/promises";
import { glob } from "glob";
import { mkdirp } from "mkdirp";
import columnify from "columnify";
import yaml from "js-yaml";
//import {openFileDialog, folderBrowserDialog, saveFileDialog} from  "./iPowerShell.js";
import path from 'path';
import { deduplicateByField } from "./arraysExtended.js";
//import blessed, { line, text } from "blessed";
import { coreProcessing, parseRosterPRNFile, convertPRNFileInfo2RosterRecords, parseCSVRoster } from "./simpleattendanceCore.js";
import { existsSync, unlink } from "fs";
import AdmZip from "adm-zip";
// import type { SessionData } from "./types/simpleattendanceTypes.d.ts";
const PresentColumnsOrdering = [
    "Name", "StudentID", "Section", "Timestamp", "SessionType", "WaitlistPosition"
], AbsentColumnsOrdering = [
    "Name", "StudentID", "Email", "Section", "SessionType", "WaitlistPosition"
], UnmatchedColumnsOrdering = [
    "StudentID", "RecordedName", "TimeStamp", "SessionType"
];
/*
async function collectAttendanceRecords(): Promise<string[]> {
    /*
    DEBUGGING:
    const recordsFolder = await folderBrowserDialog(
        'Select folder containing attendance records CSV files',
        attendanceRecordsFolder,
        true
    );
    const recordsFolder = "D:\\Mavigozler GitHub\\mavigozler.github.io\\Teaching\\Chemistry\\Fall 2025 3A\\Attendance";

    const folderFiles = (await readdir(recordsFolder)).filter(item => item.search(/^Attendance\d{8}.csv$/i) == 0);
    AttendanceSessionFiles = folderFiles;
    const openedFiles: Promise<string>[] = [];
    for (const file of folderFiles)
        if (file.search(/^Attendance\d{8}\.csv$/) >= 0)
            openedFiles.push(new Promise<string>((resolve, reject) => {
                (async () => {
                    try {
                        resolve(await readFile(path.join(recordsFolder, file), { encoding: "utf8"}));
                    } catch (except) {
                        reject(`Error: ${except}`);
                    }
                })();
            }));
    return Promise.all(openedFiles)
    .then((records: string[]) => {
        return records;
    }).catch(err => { return err });
} */
async function collectFiles(appInfo) {
    /* Roster files name formats are specified as REs in YAML file
      1. "section-rosters_CHEM-3A-(\\d+)_.*\\.csv"-- name from FCC Self-service
          Section are found from file name
      2. "Chem3a-?\\d{5}\\s+roster.*\\.prn"
        obtained from FCC Section Roster utility using Print to FILE:
         used to generate waitlist initially

        This code will first check the Downloads folder for roster files and move them to their
        final location

        must read section roster CSV records and preserve them for core processing
        The waitlist records must be merged as well if used
        When finished, it will be one file with section numbers added to the records
    Attendance records will be unchanged.
    */
    const activeTerm = appInfo.activeTerm, downloadsFolder = appInfo.termsFolderPaths.downloadsFolder, attendanceFileNamesRE = new RegExp(appInfo.attendanceFileNamesRE, "i");
    let attendanceRecordsFolder = appInfo.termsFolderPaths.terms[appInfo.termsFolderPaths.terms.findIndex(elem => elem.term == activeTerm)].path;
    if (attendanceRecordsFolder.search(/[\/\\]Attendance$/) < 0)
        attendanceRecordsFolder += "/Attendance";
    // check for Attendance CSV files in zip form: 1) extract, and add DateModified to file name
    try {
        const zipFiles = await glob(`${downloadsFolder}/*.zip`);
        if (zipFiles.length > 0)
            for (const zipFile of zipFiles)
                if (zipFile.search(attendanceFileNamesRE) > 0)
                    new AdmZip(zipFile).extractAllTo(downloadsFolder, false);
    }
    catch (exc) {
        throw Error(`error extracting an attendance zip file to '${downloadsFolder}':\n${exc}`);
    }
    try {
        const files = await glob([`${downloadsFolder}/*.csv`, `${downloadsFolder}/*.prn`]);
        if (existsSync(attendanceRecordsFolder) == false)
            await mkdirp(attendanceRecordsFolder);
        for (const file of files) {
            await copyFile(file, `${attendanceRecordsFolder}/${path.basename(file)}`);
            unlink(file, (err) => {
                if (err)
                    console.log(`Error deleting *.csv files:\n${err}`);
            });
        }
    }
    catch (exc) {
        console.log("Failure to execute `unlink` method");
        throw Error("Copy and delete operations failed");
    }
    /*
        try {
            rosterFiles = await openFileDialog(
                'Select Student Roster CSV and/or PRN Files',  // dialogTitle
                'CSV, PRN files (*.csv; *.prn)|*.csv;*.prn|All files (*.*)|*.*', // file types filter string
                attendanceRecordsFolder
            );
            //RosterFilePath = "D:\\Mavigozler GitHub\\mavigozler.github.io\\Teaching\\Chemistry\\Fall 2025 3A\\Attendance\\Section Rosters Week 3.csv";
    
            attendanceRecords = await collectAttendanceRecords();
        } catch (exc) {
            console.log(`\n\nProcessing halted: ${exc}\n`);
        } */
    const rosterFileNamesRE = new RegExp(appInfo.rosterFileNamesRE.join("|"), "i");
    const rosterFileNames = (await readdir(attendanceRecordsFolder)).filter(item => item.search(rosterFileNamesRE) == 0);
    if (rosterFileNames.length == 0)
        throw Error("No roster files were found");
    let rosterRecords = [];
    for (const rosterFileName of rosterFileNames)
        if (rosterFileName.search(/\.prn$/i) >= 0) { // the waitlist file
            const prnFileContent = (await readFile(`${attendanceRecordsFolder}/${rosterFileName}`)).toString().replace(/\r/g, "").split("\n");
            rosterRecords = rosterRecords.concat(convertPRNFileInfo2RosterRecords(parseRosterPRNFile(prnFileContent)));
        }
        else {
            let csvRecords;
            const rosterFileContent = await readFile(`${attendanceRecordsFolder}/${rosterFileName}`, 'utf8');
            if (csvRecords = parseCSVRoster(rosterFileContent, rosterFileName))
                rosterRecords = rosterRecords.concat(csvRecords);
            else
                console.log(`There was an error in parsing roster file '${rosterFileName}'`);
        }
    rosterRecords = deduplicateByField(rosterRecords, "StudentId");
    const attendanceFileNames = (await readdir(attendanceRecordsFolder)).filter(item => item.search(attendanceFileNamesRE) == 0);
    let attendanceFilesRecords = [];
    for (const attendanceFile of attendanceFileNames)
        attendanceFilesRecords = attendanceFilesRecords.concat((await readFile(`${attendanceRecordsFolder}/${attendanceFile}`, 'utf8')));
    //	await fileDialog("D:\\Documents\\PowerShell\\saveFileDialog.ps1");
    return { rosterRecords, attendanceFilesRecords };
}
async function createReport(sessionsData) {
    const today = new Date();
    let report = "ATTENDANCE REPORT for Chemistry 3A" +
        "\nGenerated:  " + today.toLocaleDateString();
    report += "\n\nfiles used to generate this report at bottom of report";
    for (const sessionData of sessionsData) {
        // sort by name 
        report += "\n\n========================" +
            `\nSession Code: ${sessionData.SessionCode}` +
            `\nSession Date: ${sessionData.SessionDate}` +
            `\nSession Type: ${sessionData.SessionType}` +
            "\n----" +
            `\n\n------ UNMATCHED PRESENT   (count = ${sessionData.Unmatched.length})\n` +
            (sessionData.Unmatched.length == 0 ? "--NONE--" :
                columnify(sessionData.Unmatched, { columns: UnmatchedColumnsOrdering })) +
            `\n\n------ ABSENT   (count = ${sessionData.Absent.length})\n` +
            (sessionData.Absent.length == 0 ? "--NONE--" :
                columnify(sessionData.Absent, { columns: AbsentColumnsOrdering })) +
            `\n\n------ PRESENT   (count = ${sessionData.Present.length})\n` +
            columnify(sessionData.Present, { columns: PresentColumnsOrdering }) + "\n\n";
    } /*
    report += //`\n\nRoster file path: ${RosterFilePath}` +
        `\nAttendance records folder: ${attendanceRecordsFolder}` +
        `\nAttendance records files:\n${AttendanceSessionFiles!.join("\n  ")}`;
    let fileNum: number = 1;
    const setFileDating = (num: number) => {
        return `${today.getFullYear()}-${(today.getMonth() + 1).toString()}-` +
            `${today.getDate().toString().padStart(2, "0")} #${num.toString().padStart(2, '0')}`;
    };
    const maxRetries = 3;
   let currentRetry = 0,
        success = false;
    const saveResult = await saveFileDialog(
        "Save Attendance Report as...",
        `Attendance Report-${setFileDating(fileNum)}.txt`,
        "TXT files (*.txt)|*.txt|All files (*.*)|*.*",
        attendanceRecordsFolder
    );

    while (!success && currentRetry < maxRetries)
        try {
            await writeFile(
                saveResult,
                report,
                {flag: "wx"}
            );
            success = true;
            //	resolve(csvData);
        } catch (exc) {
            currentRetry++;
            //	reject(`An exception occurred: ${exc}`);
        }*/
}
async function entry() {
    /* Should not have to use this
        const yamlFileName = await openFileDialog(
            'Select Course Info YAML File',  // dialogTitle
            "YAML Files (*.yaml;*.yml)|*.yaml;*.yml|All files (*.*)|*.*", // file types filter string
            attendanceRecordsFolder
        );*/
    const yamlFileName = "../config/SimpleAttendance.yaml";
    const yamlFile = await readFile(yamlFileName, "utf8");
    const appInfo = yaml.load(yamlFile);
    const dataFiles = await collectFiles(appInfo);
    const { sessionsData
    //, rosterRecords, csvData
     } = 
    /* core processing expects
        1. roster records as a string with CSV style lines
        2. attendance records are an array of strings like roster recordd, each
           array element being a string with CSV style lines
    */
    coreProcessing(appInfo, dataFiles.rosterRecords, dataFiles.attendanceFilesRecords);
    createReport(sessionsData);
}
entry();
//# sourceMappingURL=simpleattendanceNode.js.map