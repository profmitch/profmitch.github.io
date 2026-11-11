# Alternate Grading Scheme Analysis

Here’s the clean, instructor‑friendly workflow you asked for — **not the computation**, just the *method* you should use in Excel to run the alternate grading scheme (Homework 7.5%, Midterms 55%) using the CSV you exported *after* the final‑exam‑replaces‑lowest‑midterm adjustment.

This is the exact process I would use if I were doing it manually in Excel.

---

## ⭐ **Overall Goal**

You want to compute:

- **Standard scheme** (already in Canvas):  
  HW 15%, PLQ 5%, Pre‑Lab 2%, Lab Reports 13%, Midterms 47.5%, Lab Practical 5%, Final 12.5%

- **Alternate scheme** (you promised students):  
  **HW 7.5%**, **Midterms 55%**, all other weights unchanged.

Then compare the two and take the higher.

---

## 🧩 **What you already have in the CSV**

Canvas already gives you, for each student:

- **Homework Final Score**  
- **Pre‑Lecture Quizzes Final Score**  
- **Pre‑Lab Quizzes Final Score**  
- **Lab Data Reports Final Score**  
- **Midterm Exams Final Score**  
- **Lab Practical Final Score**  
- **Final Exam Final Score**  
- **Current Score** (Canvas’s weighted total using the standard scheme)

These are already **percent values** (0–100), so you do *not* need to divide by points.

---

## 🛠️ **Workflow to compute the alternate scheme in Excel**

Below is the exact step‑by‑step process.

---

### **STEP 1 — Save CSV as XLSX**

You already know this part.

---

### **STEP 2 — Insert a new column called “Alternate Weighted Score”**

Place it to the right of the Canvas “Final Score” column so you can compare side‑by‑side.

---

### **STEP 3 — Identify the columns you need**

You will use the **Final Score** columns for each assignment group:

| Assignment Group | Column Name in CSV |
|------------------|--------------------|
| Homework | Homework Final Score |
| Pre‑Lecture Quizzes | Pre‑Lecture Quizzes Final Score |
| Pre‑Lab Quizzes | Pre‑Lab Quizzes Final Score |
| Lab Data Reports | Lab Data Reports Final Score |
| Midterm Exams | Midterm Exams Final Score |
| Lab Practical | Lab Practical (5% Weight) Final Score |
| Final Exam | Final Exam (12.5% Weight) Final Score |

You will reference these in your Excel formula.

---

### **STEP 4 — Write the formula for the alternate scheme**

The alternate weights are:

- Homework: **0.075**
- Pre‑Lecture Quizzes: **0.05**
- Pre‑Lab Quizzes: **0.02**
- Lab Data Reports: **0.13**
- Midterm Exams: **0.55**
- Lab Practical: **0.05**
- Final Exam: **0.125**

Your Excel formula will look like this (using example column letters):

```
= (HW_Final * 0.075)
+ (PLQ_Final * 0.05)
+ (PreLab_Final * 0.02)
+ (LabReports_Final * 0.13)
+ (Midterms_Final * 0.55)
+ (LabPractical_Final * 0.05)
+ (FinalExam_Final * 0.125)
```

You will replace the names with actual cell references.

Example (NOT your real columns):

```
= (AB2 * 0.075)
+ (AC2 * 0.05)
+ (AD2 * 0.02)
+ (AE2 * 0.13)
+ (AF2 * 0.55)
+ (AG2 * 0.05)
+ (AH2 * 0.125)
```

Then fill down for all students.

---

### **STEP 5 — Insert another column: “Higher of Standard vs Alternate”**

This is the grade you will actually use.

Formula:

```
=MAX(CurrentScore, AlternateWeightedScore)
```

Where:

- **CurrentScore** = Canvas’s weighted total (standard scheme)
- **AlternateWeightedScore** = your new calculation

This gives each student the higher of the two schemes.

---

### **STEP 6 — (Optional) Insert a column “Which Scheme Used?”**

Formula:

```
=IF(AlternateWeightedScore > CurrentScore, "Alternate", "Standard")
```

This lets you document which scheme benefited each student.

---

## 🎯 **At the end, you will have three key columns**

1. **Canvas Final Score** (standard scheme)  
2. **Alternate Weighted Score** (your calculation)  
3. **Higher of the Two** (the grade you will actually assign)

This is exactly what you need to determine final course grades.

---

## 🧠 Why this workflow is correct

- You are using Canvas’s own post‑drop, post‑replacement group scores.  
- You are applying your alternate weights cleanly and transparently.  
- You are not touching any raw assignment‑level data.  
- You can audit every step.  
- You can easily identify which students benefit.

---

If you want, I can also:

- Generate the exact Excel formula using your real column letters  
- Produce a template spreadsheet layout  
- Create a summary table of how many students benefit  
- Help you design a more AI‑resistant weighting scheme for next semester

Just tell me what direction you want to go.