export { coreProcessing, setPacificTime, parseRosterPRNFile, convertPRNFileInfo2RosterRecords, parseCSVRoster, };
import { parse } from "../node_modules/csv-parse/dist/esm/sync.js";
import { stringify } from "../node_modules/csv-stringify/dist/esm/sync.js";
//import { multiSort, SortConfig } from "./arraysExtended.js";
const daysMatch = [
    { short: "MON", long: "Monday" },
    { short: "TUE", long: "Tuesday" },
    { short: "WED", long: "Wednesday" },
    { short: "THU", long: "Thursday" },
    { short: "FRI", long: "Friday" },
    { short: "SAT", long: "Saturday" },
];
function coreProcessing(appInfo, rosterRecords, attendanceFilesContents // keep the contents of all files separate as strings
) {
    // clean up the attendance records content
    let report = "", sessionRecords = [];
    for (let attendanceFileContent of attendanceFilesContents) {
        // Timestamp, Student ID, Attendance Code, optional Name
        sessionRecords = sessionRecords.concat(parse(attendanceFileContent, {
            columns: true,
            skip_empty_lines: true
        }));
    }
    /* - sessionRecords[] contains every entry of student recording attendance with a timestamp
          it will be sorted by attendance code
       - rosterRecords[] contains the roster that session records will be compared to
          It will be sorted by section
    */
    if (typeof rosterRecords === "string")
        rosterRecords = parseCSVRoster(rosterRecords);
    if (!rosterRecords)
        throw Error("not able to parse required roster files in CSV format");
    const sectionRosters = [];
    let prevRecord = -1;
    // Section, Name, StudentId, Email, Status
    //  Status: "Enrolled" | "Waitlisted" | "Dropped"
    let list = [];
    const identifiedSections = [], addMissingElement = (array, element) => {
        if (!array.includes(element)) {
            array.push(element);
        }
        ;
    };
    for (const rosRec of rosterRecords) {
        if (prevRecord != rosRec.Section) {
            list = [];
            sectionRosters.push({
                Section: rosRec.Section,
                Roster: list
            });
            prevRecord = rosRec.Section;
        }
        addMissingElement(identifiedSections, rosRec.Section);
        list.push(rosRec);
    }
    report += "\n\n";
    /*
       - Define const 'Present', 'Absent' to be array of object of this type
             Student ID, Name, Section, Class, Date, Waitlisted?
             Class: lecture, Tuesday lab, Thurs lab
       - sort attendance records into Sessions Blocks using Attendance Code
          get the date of Session Block
       - for each Session Block
          initialize a SessionData object
          for each student in the roster
             if an enrolled student is not found, place that student in "Absent"
             if enrolled, waitlisted, and dropped is found, add to "Present"
    */
    const sessionsData = [], sessionBlocks = [];
    let sessionCode = "", sessionRecord, sessionBlock = [], present = [], absent = [], unmatched = [], sessionType, sessionDate, csvRecords = [];
    sessionRecords.sort((a, b) => {
        const aValue = a["Attendance Code"], bValue = b["Attendance Code"];
        return aValue > bValue ? aValue < bValue ? -1 : 0 : 1;
    });
    for (const sessionRecord of sessionRecords) {
        sessionRecord["Student ID"] = sessionRecord["Student ID"].trim();
        if (sessionRecord.Name)
            sessionRecord.Name = sessionRecord.Name.trim();
        if (sessionCode != sessionRecord["Attendance Code"].trim()) {
            sessionBlock = [];
            sessionBlocks.push(sessionBlock);
        }
        sessionCode = sessionRecord["Attendance Code"].trim();
        sessionBlock.push(sessionRecord);
    }
    // constructing a Session Roster here from the Session Blocks
    for (const sessionBlock of sessionBlocks) {
        let sessionRoster = [];
        sessionCode = sessionBlock[0]["Attendance Code"];
        const sessionDay = daysMatch.find(elem => elem.short == sessionCode.slice(-3).toUpperCase());
        if (!sessionDay) {
            sessionType = "Lecture";
            for (const rec of sectionRosters)
                sessionRoster = sessionRoster.concat(rec.Roster);
        }
        else {
            const sessionSection = appInfo.sections.find(elem => elem.day == sessionDay.long).number;
            sessionType = `${sessionDay.long} Lab`;
            sessionRoster = sectionRosters.find(sec => sec.Section == sessionSection).Roster;
        }
        sessionDate = new Date(sessionBlock[0].Timestamp).toLocaleDateString();
        for (const rosterRecord of sessionRoster)
            // take one record in the roster
            if (sessionRecord = sessionBlock.find(blockRec => blockRec["Student ID"] == rosterRecord.StudentId)) {
                // student ID in session matches student ID in roster
                if (rosterRecord.Status == "Enrolled" || rosterRecord.Status == "Waitlisted") {
                    // the status is either enrolled or waitlists: add to Present records
                    present.push({
                        Name: rosterRecord.Name,
                        StudentID: rosterRecord.StudentId.toString(),
                        RecordedName: sessionRecord.Name,
                        Section: rosterRecord.Section,
                        Timestamp: sessionRecord.Timestamp,
                        SessionType: sessionType,
                        WaitlistPosition: isNaN(rosterRecord["Wait Position"]) ? undefined : rosterRecord["Wait Position"]
                    });
                    csvRecords.push({
                        Name: rosterRecord.Name,
                        StudentID: rosterRecord.StudentId.toString(),
                        Email: rosterRecord.Email,
                        Section: rosterRecord.Section,
                        Status: rosterRecord.Status,
                        SessionDate: sessionDate,
                        SessionType: sessionType,
                        Absent: "no",
                        Timestamp: sessionRecord.Timestamp,
                        WaitlistPosition: null
                    });
                    /*
                    csvRecords.push({
                       StudentID: rosterRecord.StudentId.toString(),
                       Name: rosterRecord.Name,
                       Email: rosterRecord.Email,
                       Section: rosterRecord.Section,
                       Status: rosterRecord.Status,
                       SessionDate: sessionDate,
                       SessionType: sessionType,
                       Absent: "no",
                       Timestamp: sessionRecord.Timestamp,
                       WaitlistPosition: null
                    }); */
                }
            }
            else if (rosterRecord.Status == "Enrolled") {
                // this is record in the roster, and the condition of being Present or Waitlisted was not met
                absent.push({
                    Name: rosterRecord.Name,
                    StudentID: rosterRecord.StudentId.toString(),
                    Email: rosterRecord.Email,
                    Section: rosterRecord.Section,
                    Status: rosterRecord.Status,
                    SessionType: sessionType,
                    SessionDate: sessionDate
                });
                csvRecords.push({
                    Name: rosterRecord.Name,
                    StudentID: rosterRecord.StudentId.toString(),
                    Email: rosterRecord.Email,
                    Section: rosterRecord.Section,
                    Status: rosterRecord.Status,
                    SessionDate: sessionDate,
                    SessionType: sessionType,
                    Absent: "yes",
                    Timestamp: null,
                    WaitlistPosition: null
                });
            }
        // running through the roster once complete
        // now to go through the records and find IDs not matched: students forgetting their IDs
        for (const sessionRecord of sessionBlock)
            if (rosterRecords.find(rosRec => rosRec.StudentId == sessionRecord["Student ID"] //&&
            // rosRec.Status == "Enrolled"
            )) // if ID was found in roster and in session record, skip this
                continue;
            else { // get the iD and recorded name
                unmatched.push({
                    StudentID: sessionRecord["Student ID"].toString(),
                    RecordedName: sessionRecord.Name,
                    SessionType: sessionType,
                    Timestamp: sessionRecord.Timestamp
                });
                csvRecords.push({
                    StudentID: sessionRecord["Student ID"],
                    Name: "unknown",
                    RecordedName: sessionRecord.Name,
                    Absent: "no",
                    Timestamp: sessionRecord.Timestamp,
                    Email: "",
                    Section: -1,
                    Status: "",
                    SessionDate: sessionDate,
                    SessionType: sessionType,
                    WaitlistPosition: null
                });
            }
        // collect all the information on the sesson and matched students
        sessionsData.push({
            Headers: {
                present: Object.keys(present[0]),
                absent: Object.keys(absent[0]),
                //            unmatched: Object.keys(unmatched[0])
            },
            Present: present,
            Absent: absent,
            Unmatched: unmatched,
            SessionCode: sessionCode,
            SessionType: sessionType,
            SessionDate: sessionDate.toLocaleString()
        });
        present = [];
        absent = [];
        unmatched = [];
    }
    const stringified = stringify(csvRecords, {
        header: true
    });
    return { sessionsData: sessionsData, rosterRecords: rosterRecords, csvData: stringified };
}
function setPacificTime(timestamp) {
    return new Intl.DateTimeFormat("en-us", {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        timeZoneName: "short"
    }).format(new Date(timestamp));
}
function parseRosterPRNFile(prnFileContent) {
    let line = 0, parts;
    const prnFileInfo = {
        datetime: new Date(),
        section: -1,
        term: "",
        size: { capacity: -1, enrolled: -1, waitlisted: -1 },
        students: {
            enrolled: [],
            waitlisted: [],
            dropped: []
        }
    };
    if ((parts = prnFileContent[line++].match(/Printed on: (.*(AM|PM))/)) != null)
        prnFileInfo.datetime = new Date(parts[1]);
    try {
        if ((parts = prnFileContent[line++].match(/CHEM-3A-(\d{5})[^\d]+(\d{4}(SP|FA))/)) == null)
            throw Error("No section number found when expected");
    }
    catch (exc) {
        Promise.reject(exc);
    }
    prnFileInfo.section = parseInt(parts[1]);
    prnFileInfo.term = parts[2];
    if ((parts = prnFileContent[line++].match(/Capacity\s*:\s*(\d{1,2})\s+Enrolled\s*:\s*(\d{1,2})\s+Waitlisted\s*:\s*(\d{1,2})/)) != null) {
        prnFileInfo.size.capacity = parseInt(parts[1]);
        prnFileInfo.size.enrolled = parseInt(parts[2]);
        prnFileInfo.size.waitlisted = parseInt(parts[3]);
    }
    while (prnFileContent[line++].search(/NameIDEmail/) < 0)
        ;
    let lineText, rowRegex = /^(\d+)(.+?)(\d{7})([A-Za-z0-9]+@MY\.SCCCD\.EDU)(Enrolled).*$/;
    while ((lineText = prnFileContent[line++]).search(/Waitlist$/) < 0) {
        if ((parts = lineText.match(rowRegex)) == null)
            continue;
        prnFileInfo.students.enrolled.push({
            position: parseInt(parts[1]),
            name: parts[2],
            studentId: parts[3],
            email: parts[4],
            status: parts[5]
        });
    }
    rowRegex = /^(\d+)(.+?)(\d{7})([A-Za-z0-9]+@MY\.SCCCD\.EDU)(Waitlisted).*$/;
    while ((lineText = prnFileContent[line++]).search(/Dropped$/) < 0) {
        if ((parts = lineText.match(rowRegex)) == null)
            continue;
        prnFileInfo.students.waitlisted.push({
            position: parseInt(parts[1]),
            name: parts[2],
            studentId: parts[3],
            email: parts[4],
            status: parts[5]
        });
    }
    rowRegex = /^(\d+)(.+?)(\d{7})([A-Za-z0-9]+@MY\.SCCCD\.EDU)(Dropped).*$/;
    while (lineText = prnFileContent[line++]) {
        if ((parts = lineText.match(rowRegex)) == null)
            continue;
        prnFileInfo.students.dropped.push({
            position: parseInt(parts[1]),
            name: parts[2],
            studentId: parts[3],
            email: parts[4],
            status: parts[5]
        });
    }
    return prnFileInfo;
}
function convertPRNFileInfo2RosterRecords(prnFileInfo) {
    const rosterRecords = [];
    for (const student of prnFileInfo.students.enrolled)
        rosterRecords.push({
            Section: prnFileInfo.section,
            Name: student.name,
            StudentId: student.studentId,
            Email: student.email,
            Status: student.status,
            "Wait Position": NaN
        });
    for (const student of prnFileInfo.students.waitlisted)
        rosterRecords.push({
            Section: prnFileInfo.section,
            Name: student.name,
            StudentId: student.studentId,
            Email: student.email,
            Status: student.status,
            "Wait Position": student.position
        });
    for (const student of prnFileInfo.students.dropped)
        rosterRecords.push({
            Section: prnFileInfo.section,
            Name: student.name,
            StudentId: student.studentId,
            Email: student.email,
            Status: student.status,
            "Wait Position": NaN
        });
    return rosterRecords;
}
function parseCSVRoster(rosterContent, csvFileName) {
    let headers = "";
    const rosterRecords = parse(rosterContent, {
        bom: true,
        columns: (header) => {
            headers += `${header},`;
            return header.map((h) => h.trim());
        },
        skip_empty_lines: true,
        cast: (value, context) => {
            if (context.column == "StudentId")
                return value.length == 6 ? "0" + value : value;
            else if (context.column == "Wait Position")
                return parseInt(value);
            return value;
        }
    });
    let modifiedRosterRecords = [];
    const selfServiceCsvExport = rosterRecords;
    if (rosterContent.search(/Section/) < 0)
        if (csvFileName) {
            let sectionNumberMatchArray = csvFileName.match(/[^\d](\d{5})[^\d]/);
            if (!sectionNumberMatchArray)
                return null;
            const sectionNumber = Number(sectionNumberMatchArray[1]);
            for (const record of selfServiceCsvExport)
                modifiedRosterRecords.push({
                    Section: sectionNumber,
                    Name: record["Student Name"],
                    StudentId: record["Student ID"],
                    Email: record["Preferred Email"],
                    Status: "Enrolled",
                    "Wait Position": -1
                });
        }
        else
            return null;
    else
        modifiedRosterRecords = rosterRecords;
    return modifiedRosterRecords;
}
//# sourceMappingURL=simpleattendanceCore.js.map