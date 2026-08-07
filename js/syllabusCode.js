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
const getFinalExamDate = (firstSemesterDay) => `${new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
}).format(new Date(getRelativeDate(18, 1, firstSemesterDay)))}, 5:00-6:30 p.m.`;
function test() {
    const firstSemesterDay = new Date("8/10/2026");
    const relDate = getRelativeDate(18, 1, firstSemesterDay) + " 2026";
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }).format(new Date(relDate));
    console.log(`${formattedDate}, 5:00-6:30 p.m.`);
}
test();
//# sourceMappingURL=syllabusCode.js.map