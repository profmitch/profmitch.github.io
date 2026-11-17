"use strict";
//import type * as JsYaml from 'js-yaml';
async function getCourseInfo() {
    // fetch the YAML file as text
    const response = await fetch('semesterData.yaml');
    if (!response.ok)
        throw new Error(`Failed to load config: ${response.statusText}`);
    const yamlText = await response.text();
    // Parse and cast to your TypeScript interface
    const courseInfo = jsyaml.load(yamlText);
    //console.log("first semester day is " + courseInfo.firstSemesterDay);
    return courseInfo;
}
function getCourseHeader(courseInfo) {
    let out = "";
    for (const sec of courseInfo.sections)
        out +=
            `<div class="secblock"><span class="secnum">Section ${sec.section}</span><br>` +
                `<span class="lecdays">Lecture: ${sec.lectureDays} ` +
                `  ${sec.lectureTimes}</span>` +
                `<span class="lecloc">Room ${sec.lectureLocation}</span>` +
                `<span class="labday">Lab: ${sec.labDay} ` +
                `${sec.labTime}</span>` +
                `<span class="labloc">Room ${sec.labLocation}</span></div>`;
    out += `<span id="census-date">Census Date: <b>${courseInfo.censusDate}</b></span>`;
    return out;
}
function getDateString(instDate) {
    return (new Date(instDate).toLocaleDateString('en-GB', {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    })).replace(/ (\d+) (\w+)/, ", $1\u00a0$2");
}
//(window as any).getDateString = getDateString;
function getWeekRange(week, firstDate, nohtml) {
    const start = new Date(firstDate);
    start.setDate(start.getDate() + (week - 1) * 7);
    const end = new Date(start);
    end.setDate(end.getDate() + 4);
    if (nohtml)
        return start;
    const weekStart = start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
    let weekEnd = end.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
    if (weekEnd.substring(0, 2) == weekStart.substring(0, 2))
        weekEnd = weekEnd.substring(4);
    const result = `${week}:<span class="tabdates">${weekStart}-${weekEnd}</span>`;
    //console.log(result);
    return result;
}
//(window as any).getWeekRange = getWeekRange;
function getRelativeDate(week, weekday /* should be 1-7 */, firstDate) {
    const sDate = getWeekRange(week, firstDate, true);
    sDate.setDate(sDate.getDate() + weekday);
    return getDateString(sDate);
}
const getFinalExamDate = (firstSemesterDay) => {
    const relDate = new Date(getRelativeDate(18, 1, firstSemesterDay) + firstSemesterDay.getFullYear());
    return `${new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(relDate)}, 5:00-6:30 p.m.`;
};
document.addEventListener("DOMContentLoaded", () => {
    (async () => {
        const courseInfo = await getCourseInfo();
        const courseHeader = getCourseHeader(courseInfo);
        elementFilling(courseInfo, courseHeader);
    })();
});
function elementFilling(courseInfo, courseHeader) {
    const elementFills = [
        {
            element: { node: "div", idtype: "id", idval: "course-header" },
            //attribs: [{name: "style", val: "font-size:140%;" }],
            content: courseHeader
        },
        {
            element: { node: "span", idtype: "class", idval: "fullSemName" },
            attribs: [{ name: "style", val: "font-size:140%;" }],
            content: courseInfo.semesterFullName
        },
        {
            element: { node: "span", idtype: "class", idval: "finalExamDay" },
            attribs: [{ name: "style", val: "font-size:140%;" }],
            content: getFinalExamDate(new Date(courseInfo.firstSemesterDay))
        },
        {
            element: { node: "span", idtype: "id", idval: "dead1" },
            content: getDateString("8/10/2026")
        },
        {
            element: { node: "span", idtype: "id", idval: "dead2" },
            content: getDateString("8/21/2026")
        },
        {
            element: { node: "span", idtype: "id", idval: "dead3" },
            content: getDateString("8/28/2026")
        },
        {
            element: { node: "span", idtype: "id", idval: "dead4" },
            content: getDateString("8/31/2026")
        },
        {
            element: { node: "span", idtype: "id", idval: "dead5" },
            content: getDateString("10/9/2026")
        },
        {
            element: { node: "span", idtype: "id", idval: "dead6" },
            content: getDateString("11/30/2026")
        },
        {
            element: { node: "span", idtype: "id", idval: "dead7" },
            content: getDateString("12/11/2026")
        },
    ];
    for (const item of elementFills) {
        if (item.element.idtype == "class") {
            const classElems = document.getElementsByClassName(item.element.idval);
            for (const classElem of classElems)
                if (item.attribs)
                    for (const attrib of item.attribs) {
                        classElem.setAttribute(attrib.name, attrib.val);
                        if (item.content)
                            classElem.innerHTML = item.content;
                    }
        }
        else if (item.element.idtype == "id") {
            const elem = document.getElementById(item.element.idval);
            if (elem) {
                if (item.attribs)
                    for (const attrib of item.attribs)
                        elem.setAttribute(attrib.name, attrib.val);
                if (item.content)
                    elem.innerHTML = item.content;
            }
        }
    }
    for (let i = 1; i <= 18; i++) {
        const weekElem = document.getElementById(`SemWeek` + i);
        if (weekElem)
            weekElem.innerHTML = `${getWeekRange(i, courseInfo.firstSemesterDay)}`;
    }
}
/*
function test() {
   const firstSemesterDay = new Date("8/10/2026");
   const relDate = getRelativeDate(18, 1, firstSemesterDay);
   const formattedDate = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
   }).format(new Date(relDate));
   console.log(`${formattedDate}, 5:00-6:30 p.m.`);
}
test(); */ 
//# sourceMappingURL=syllabusCode.js.map