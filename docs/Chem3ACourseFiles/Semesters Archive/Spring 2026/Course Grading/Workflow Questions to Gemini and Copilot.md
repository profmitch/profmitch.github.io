# Questions on Course Grading Workflow

I am entering the final phase of course grading.

Below is an Announcement I made to students. Continue below for the steps that I see planned.

```Canvas Announcement
While I do the final processing for all assignment group scoring toward examining total scores, applying exclusions from scoring, I have hidden the Canvas Gradebook, and for good reason. There is a lot of number changing going on, and students get alarmed and stressed by up and downs in the transformations.

For example, I have entered in the scores for the final examination and the highest course score is 89% for the course at the moment. The final score has a severe effect on course scoring since the highest scoring student may barely get above 80%. If I applied 90-100 = A, 80-89 = B grading and so on without applying a (non-linear) transformation process--a curve-- that would mean no "A" grade would be given for the course, and that's not going to happen.

I have a few scoring analyses to be done. These were given to you in the syllabus:

Final Exam Score Replaces Lowest Midterm Score. I neglected to include in the earlier version of the Announcement the most important course scoring adjustment: your lowest midterm score gets replaced by the final exam score, if the latter is higher. Otherwise, you keep your higher midterm score.

Alternate Course Grading Analysis. An alternative grade scheme will be applied in an automatic analysis at the end of the semester where the midterm examinations are evaluated at 55% and the homework is evaluated at 7.5%. If the course grade is higher with this scheme, it will be used for the course grade, it will be noted in the student's course grading and the student will be notified of the use of the alternative grading.

The alternative course grading analysis is likely to prove of no value since all students are using A.I. to make sure their MOM assessments are near 100% in scoring, and I get that. Reducing the percent of the grade in the homework and giving midterms the higher percentage would almost certainly have a score/grade-lowering effect. The homework exists with the hope you are actually doing it yourself before you let A.I. "review" your results. If you have not bothered to think about your homework at all and just let A.I. give you the answers in every case, then you have not done yourself any favor.

Dropped Low Scores.. There are no make-ups on laboratory report submissions. However the lowest score on a laboratory report submission will be dropped during course grading. The same will be applied to a homework score as well.

On the dropped low scores, here is what will happen in each assignment group

Homework and Review: As a collection, the two lowest will be dropped
Pre-lecture quizzes: two lowest to be dropped. (Not in syllabus, but an unofficial action considered a "gift" of the instructor...something instructors generally do)
Pre-lab quizzes: no score dropping
Lab Report:  lowest report dropped, as promised
```

These are the steps I think need to be taken in order. And the question is if Canvas can do all or just some/most of the steps.

Below I have questions with a letter symbol "A.", "B." etc
I used numbers "1.", "2.", etc for naming the Canvas Assignment groups.

1. The Final Exam Assignment group: the final exam is in its own Canvas Assignment group because it alone is 12.5% of the course grade.

2. The Midterm Examinations Assignment will have a total of 4 numerical values although it has numerous assignments named in the group. "Midterm Exam #1", "Midterm Exam #2", "Midterm Exam #3", and "Midterm Exam #4". It also has ""Midterm Retake #1" and "Midterm Retake #3" added in the semester when two groups of students requested to retake either "Midterm Exam #1" or "Midterm Exam #3". If the student had a higher retake score, then the original was marked "Excused" (the old score recorded in a "Comment" on Canvas) and the retake score entered. This process still leaves four numbers (scores) in the Midterm assignment group.

   ***A. In course scoring adjustment process, this first step must compare the final exam score group to the midterm exam scores group, find the lowest score in the midterm group, and replace that score in the midterm group with the final score. The process must not lose the midterm score, only indicate that the one midterm score will be replaced in scoring toward the course grade.***

3. Homework Review MOM assessments Assignment group. I decided to drop the two lowest scores. Canvas does that easily, so that setting has been done in Canvas.

4. Pre-lecture quizzes MOM assessments Assignment group. I decided to drop the two lowest scores, and again, Canvas does this without effort

5. Lab Reports MOM assessments Assignment group. The lowest scoring Lab Report is dropped. Again, something Canvas easily does.

6. Pre-lab quizzes MOM assessments Assignment group. No score is dropped.

---

B. A What-If analysis.

Here is the percentages of the Assignment groups in the course grade:

- Homework/Homework Review [MyOpenMath assessments]:  15%
- Prelecture quizzes [MyOpenMath assessments]: 5% 
- Pre-Lab Quizzes [MyOpenMath assessments]:  2%
- Lab Data Reports [MyOpenMath assessments]:  13%
- Midterm Exams:  47.5%
- Lab Practical:  5%
= Final Exam:  12.5%

This is an Alternate Course Grading Analysis. This changes the weight of two assignment groups. It takes away 7.5% from Homework/Review (at 15% to 7.5%) and adds 7.5% to Midterm Exams (from 47.5% to 55%). This actually now seems silly in hindsight because students have access to A.I. to "cheat" on the homework and get a high score on that, and they do not have any access to A.I. on in-class midterm exams with zero ability to cheat.

---

But I promised the analysis, so I must do it.

I believe nothing else remains in this final course grading analysis.

After the semester, after this course grading, I want to talk about optimizing the percentages on the course grade. I want less percentage on work the student can "cheat"--not merely using A.I. to review questions they tried to do themselves, but basically just fed the questions to A.I. and getting the answers without any thinking.

---

## Gemini Response

That is quite a complex final grading puzzle to piece together. I completely understand why you hid the gradebook—watching grades fluctuate while you run these kinds of calculations can drive students into a total panic.

To answer your core question directly: **Canvas cannot automatically handle all of these steps.** It is excellent at the drop-low-score rules you already set up, but it completely falls short on cross-group calculations (like comparing the Final to Midterms) and running side-by-side alternative weight calculations.

Here is exactly what Canvas can do, what it *cannot* do, and the most efficient way for you to handle the rest without losing your mind.

---

### Part A: Replacing the Lowest Midterm with the Final

> **Can Canvas do this automatically?**
> ✗ **No.**

Canvas treats assignment groups as completely independent silos. It has no built-in logic that allows a score in Group 1 (Final Exam) to look inside Group 2 (Midterms), find the lowest value, and replace it.

#### How to handle this:

Since you only have four midterms, the cleanest approach is to handle this directly in the Canvas Gradebook manually before exporting your data, or do it in Excel.

If you want to do it directly in Canvas so the final calculation is visible to students later:

1. Sort your gradebook by the **Final Exam** column to see who scored well.
2. Manually look at each student's 4 midterm scores.
3. If the Final Exam score is higher than the lowest midterm, type the Final Exam score directly over that lowest midterm score. *Note: As you mentioned, write the original midterm score in the assignment comment first so you don't lose the historical data.*

---

### Part B: The Alternate Course Grading Analysis

> **Can Canvas do this automatically?**
> ✗ **No.**

Canvas only allows **one active weighting scheme per course** at any given time. It cannot natively calculate two different weighting schemas simultaneously and choose the higher grade for each individual student.

***How to handle this:***

This is a classic job for **Excel or Google Sheets**. Trying to force Canvas to do this will cause endless headaches. Here is the most efficient workflow to execute this:

#### The Final Grading Workflow

1. **Finalize the standard Canvas Gradebook:** Do this first.
Ensure all regular grades, retakes, and manual Final-for-Midterm replacements (from Part A) are entered. Canvas will automatically apply your dropped low score rules for Homework, Pre-lecture quizzes, and Labs.

2. **Export the Gradebook to Excel:** Takes 1 minute.
Go to your Canvas Gradebook, click **Actions** > **Export**. This gives you a CSV spreadsheet containing the current, fully-calculated assignment group totals for every student.

3. **Calculate the Standard Grade:** In Excel.
Open the spreadsheet. Create a column named **Standard Total**. Use a formula to multiply your Canvas group percentages by the student's scores.

4. **Calculate the Alternate Grade:** In Excel.
Create a column right next to it named **Alternate Total**. Use the exact same formula, but change the Midterm multiplier to 0.55 and the Homework multiplier to 0.075.

5. **Find the Max Grade:** The Final Decision.
Create a final column called **Final Course Grade**. Use the formula =MAX(Standard_Total_Cell, Alternate_Total_Cell). This automatically awards whichever percentage is higher.

---

> **A Note on your AI Homework Dilemma:** You are completely right. If students used AI to inflate their homework scores to nearly 100%, reducing the weight of that homework from 15% to 7.5% while increasing the weight of un-cheatable midterms will almost certainly *lower* their grade. For the vast majority of your students, the "Alternate Analysis" will yield a lower score, meaning their **Standard Grade** will be the one that counts.

Once you have your final numbers in Excel, you can manually input the final letter grades into your university’s official grading portal.

Whenever you wrap up this semester's grading and unhide that gradebook, I would love to help you brainstorm and restructure your syllabus weights for next semester to outsmart the "AI copy-paste" loop. Let me know when you're ready!

---

## Copilot Response

Here’s the clean, structured, *Canvas‑accurate* answer you need — written for someone who is actually about to push the buttons and wants to know **what Canvas can do**, **what Canvas cannot do**, and **what must be done manually**.

I’ll go through **A** and **B**, but first I’ll restate the workflow in the correct operational order so you can see where Canvas automates things and where it absolutely does not.

---

### ✅ **THE REALITY CHECK: What Canvas Can and Cannot Do**

Canvas is excellent at:

- Dropping lowest scores **within** an assignment group  
- Applying assignment‑group weights  
- Handling excused assignments  
- Handling “What‑If” calculations **for students**, not instructors  

Canvas **cannot**:

- Replace a midterm score with the final exam score  
- Perform conditional logic (“if final > lowest midterm, then replace”)  
- Run alternate weighting schemes automatically  
- Run two parallel gradebooks  
- Compare two grading schemes and choose the higher  

So: **you must do the midterm‑replacement logic manually**, and **you must do the alternate‑weight analysis manually**.

Now let’s go step by step.

---

### 🅐 **MIDTERM REPLACEMENT LOGIC (Final Exam replaces lowest midterm)**

#### **What you want:**

For each student:

1. Look at their four midterm scores (after retake substitutions).  
2. Identify the lowest.  
3. If the final exam score is higher, replace that lowest midterm with the final exam score.  
4. Keep the original midterm score recorded somewhere (comment, excused, etc.).  
5. Use the replaced score only for course‑grade calculation.

**Can Canvas do this automatically?**
**No.**  

Canvas has *no mechanism* to:

- Compare scores across assignment groups  
- Replace one assignment’s score with another  
- Apply conditional logic  

#### **Correct workflow**

You must do this manually:

1. Export the Gradebook to CSV.  
2. For each student, compute:
   - Lowest midterm  
   - Compare to final  
   - Replace if needed  
3. Re‑import the modified midterm column(s) **OR** manually enter the replaced values in Canvas.

#### **Best practice inside Canvas**

The cleanest method:

- **Create a new assignment inside the Midterm group** called  
  **“Final‑Exam Replacement for Lowest Midterm”**  
  worth **the same points** as a midterm.
- For each student:
  - Enter the replacement score (final exam score) **only if it is higher**.
  - Enter **0** or **EX** for students who do not get a replacement.
- Then **manually excuse** the lowest midterm for each student.

Canvas will then:

- Count the replacement score  
- Ignore the excused midterm  
- Apply the Midterm group weight normally  

This is the only way to keep the process transparent and auditable.

---

### 🅑 **ALTERNATE COURSE GRADING ANALYSIS (What‑If for the instructor)**

#### **Your alternate scheme:**

- Homework/Review: **15% → 7.5%**  
- Midterms: **47.5% → 55%**  
- Everything else unchanged  

**Can Canvas run two grading schemes and choose the higher?**
**No.**

Canvas supports:

- **One** active weighting scheme  
- No conditional logic  
- No instructor‑side “What‑If” mode  

**Therefore:**

You must compute the alternate grade **outside Canvas**.

#### **Correct workflow**

1. Export the Gradebook (after all drops and midterm replacement are finalized).  
2. Compute:
   - Standard weighted grade  
   - Alternate weighted grade  
3. Compare the two  
4. For each student, choose the higher  
5. Enter the final course grade manually in the “Final Grade Override” column in Canvas (if enabled).

#### **Important note**

Your intuition is correct:  
Because students used AI to get near‑perfect homework scores, **reducing homework weight will almost always lower their grade**.  
But since you promised the analysis, you must run it.

---

### 🧩 **WHICH PARTS CAN CANVAS AUTOMATE?**

| Task | Canvas Can Do It? | Notes |
|------|-------------------|-------|
| Drop lowest homework scores | ✅ Yes | Already done |
| Drop lowest pre‑lecture quizzes | ✅ Yes | Already done |
| Drop lowest lab report | ✅ Yes | Already done |
| No drops for pre‑lab quizzes | ✅ Yes | Already done |
| Replace lowest midterm with final exam | ❌ No | Must be done manually |
| Compare two grading schemes | ❌ No | Must be done manually |
| Choose the higher of two schemes | ❌ No | Must be done manually |
| Hide gradebook during processing | ✅ Yes | You already did this |
| Excuse assignments | ✅ Yes | Works perfectly for retakes and replacements |

---

### 🧠 **THE ORDER YOU SHOULD FOLLOW (Operational Checklist)**

Here is the correct sequence for your grading workflow:

1. **Finalize all raw scores**  
   - Ensure all MOM scores are synced  
   - Ensure retake substitutions are correct  
   - Ensure excused midterms are properly marked  

2. **Apply all Canvas‑automated drops**  
   - Homework (drop 2)  
   - Pre‑lecture quizzes (drop 2)  
   - Lab reports (drop 1)  

3. **Perform the midterm‑replacement logic manually**  
   - Compute lowest midterm  
   - Compare to final  
   - Replace if needed  
   - Enter replacement assignment or overwrite midterm score  

4. **Export the Gradebook**  
   - This gives you the post‑drop, post‑replacement dataset  

5. **Compute the standard weighted grade**  
   - Using Canvas weights  

6. **Compute the alternate weighted grade**  
   - Homework 7.5%  
   - Midterms 55%  

7. **Choose the higher grade for each student**  
   - Document which scheme was used  

8. **Enter final course grades**  
   - Use “Final Grade Override” if needed  

9. **Unhide the Gradebook**  
   - After all transformations are complete  

---

### 🎯 **BOTTOM LINE ANSWERS**

**A. Can Canvas replace the lowest midterm with the final exam?**
**No.**  
You must do this manually.

**B. Can Canvas run a What‑If alternate grading analysis?**  
**No.**  
You must compute the alternate scheme manually and choose the higher grade.

---

If you want, I can also produce:

- A **step‑by‑step spreadsheet formula workflow**  
- A **Python script** to automate the entire analysis  
- A **Canvas‑safe workflow** that minimizes manual editing  
- A **post‑semester redesign** of your weighting scheme to reduce AI‑inflated homework effects  

Just tell me which direction you want to go
