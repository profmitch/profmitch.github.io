# Scoring Exceptions for Excel Worksheets

## PROMPT

I will be describing an Excel sheet with its data and formulas. The data are student names, ID, and course section (not important). The rows of the students range from row 5 to 56.

There are 25 multiple choice answers. There are two versions of the exam, A and B.
The key ID for versions, values "A" and "B" are in cells L2 and L3 respectively.
The answer key for Version A 25 choices is M2 to AK2. Those for Version B are next row down, M3 to AK3.
The number of correct M/C choices for the student are in column D. Thus for the student in row 5, the first student, the correct choices are in D5. The vector is D5 to D56 for all students.
The version A or B the student took is indicated in column L, thus cell range L5 to L56 for all students.

Here is the formula for the number of correct M/C choices in column D for the first student in row 5.

```xls
=SUMPRODUCT(--(M5:AK5=TRIM(IF(L5="A",$M$2:$AK$2,$M$3:$AK$3))))
```

M5 to AK5 are the student's choice. L5 in the version. If L5 = A, then use answer key response $M$2:$AK$2 [row 2], or if not, then row 3.
Quite simple

Now we come exceptions because of isses in the exam. There are THREE exceptions.

1. One question removed from Exam because of no correct choices. This is Question 23 in Version A and Question 25 in Version B.
2. One question had TWO correct choices, unfortunately. This is Question 22 in Version A, Question 16 in Version B. The two correct choices are B and C; students selecting A or D get it markked incorrect.
3. Each M/C question is scored 2 points. I have a formula "Raw Score" that actually calculates the total score for the student. For student in row 5:

```xls
=D5*2+E5+F5
```

But Question 21 in Version A and Question 12 in Version B had two choices in which choice C was the best, and choice A was a weaker choice. The compromise is that I will give 2 points for Choice C and 1 point for Choice A. So somehow I have work that into a separate cell which will ultimately be an input to cell G5, or to alter the formula in G5 directly

So the formula will need adjustments to deal with these exceptions. What can you figure out?

## AI RESPONSE

To incorporate your three exam exceptions into a clean and robust Excel setup, we need to adjust how correctness is evaluated for specific questions and how partial credit/point bonuses are calculated.

Since Excel allows us to evaluate ranges and conditional arrays using functions like `SUMPRODUCT`, we can handle these exceptions dynamically based on whether the student took **Version A** or **Version B**.

Here is how you can restructure your formulas for row 5 (and copy down to row 56).

---

### Step 1: Mapping Question Numbers to Column Positions

Since your answer keys run from column **M to AK** (25 choices total), let's map out the positions:

* Column **M** = Question 1
* Column **N** = Question 2
* ...
* Column **AH** = Question 20
* Column **AI** = Question 21 (The partial credit question)
* Column **AJ** = Question 22 (The two-correct question)
* Column **AK** = Question 23 (For Version A) / Question 25 (For Version B) — wait, let's look closely at the removed question.

Let's carefully verify the column offsets from M (which is index 1):

1. **Exception 3: Question 21 (Ver A) / Question 12 (Ver B)**
   * Version A, Q21 is at column **AI** (13th column from M, since $M + 21 - 1 = AI$).
   * Version B, Q12 is at column **X** ($M + 12 - 1 = X$).

2. **Exception 2: Question 22 (Ver A) / Question 16 (Ver B)**
   * Version A, Q22 is at column **AJ**.
   * Version B, Q16 is at column **AB**.

3. **Exception 1: Question 23 (Ver A) / Question 25 (Ver B)**

   * Version A, Q23 is at column **AK**.
   * Version B, Q25 is *also* at column **AK**? Wait, if both Version A and Version B keys end at column AK (25 columns total), let's check: Column AK is the 25th column. If Version B's last question is Q25, it sits in AK. If Version A's Q23 is in AK, what are columns AJ and AK for Version B?
   * *Assumption/Correction:* Assuming your 25 questions for both versions map columns **M through AK** linearly to Questions 1 through 25, let's identify them by their relative column offset or handle them question-by-question.

To make this foolproof without messing up column math, we can build a **Column-by-Column Adjustment** or handle the standard questions via `SUMPRODUCT` and handle the exceptions via separate logical checks.

---

### Step 2: Refining Column D (Number of Correct M/C Choices)

Your current formula counts every match between the student's row (`M5:AK5`) and the active answer key. We need to **exclude** the dropped question and the multi-correct questions from this standard strict-match count so we can score them properly.

Let's assume the 25 questions map directly to columns **M through AK** (M=Q1, N=Q2 ... AK=Q25).

* **Exception 1 (Dropped Question):** Since it has no correct answers, it should give 0 points and be ignored in the count. If it's **Q23 for Version A** (column AK) and **Q25 for Version B** (also column AK), then column AK is *always* dropped for everyone! If they are different columns, we can zero them out. Assuming AK is dropped for both, or we can isolate standard questions.
* **Exception 2 (Two Correct Choices - B or C):** For this question, a student gets it right if their answer is "B" or "C".

Instead of a massive monolithic formula that breaks easily, the cleanest way in Excel is to calculate the **Standard Correct Count (excluding exception columns)** and add the exception results.

Alternatively, if you want a refined single formula for **D5** that evaluates standard questions strictly, handles the "B or C" question flexibly, and drops the removed question:

```xls
=SUMPRODUCT(--(
    (M5:AJ5 = TRIM(IF(L5="A", $M$2:$AJ$2, $M$3:$AJ$3))) 
    * 
    ISNA(MATCH(COLUMN(M5:AJ5), IF(L5="A", {COLUMN($AI$5), COLUMN($AJ$5)}, {COLUMN($X$5), COLUMN($AB$5)}), 0))
)) + 
IF(L5="A", 
   --OR(AJ5={"B","C"}),  !-- Version A Q22 is in AJ --
   --OR(AB5={"B","C"})   !-- Version B Q16 is in AB --
)
```

*(Note: Adjust column letters `AI`, `AJ`, `X`, `AB`, `AK` to match the exact columns where those specific questions land in your sheet).*

---

### Step 3: Handling Exception 3 (Partial Credit) for Cell G5

Question 21 (Version A) or Question 12 (Version B) awards **2 points for 'C'** and **1 point for 'A'** (and 0 for anything else).

Since standard multiple-choice questions give 2 points each (multiplied via `D5*2`), we can pull the partial credit points for this specific question out into its own helper column (let's say **Column H**, where `H5` calculates the points for that specific question), or plug it directly into `G5`.

For student in row 5, assuming **Version A Q21 is in column AI** and **Version B Q12 is in column X**:

**Formula for a helper column (e.g., H5):**

```Excel
=IF(L5="A", 
    CHOOSE(MATCH(AI5, {"A", "C", "B", "D"}, 0), 1, 2, 0, 0), 
    CHOOSE(MATCH(X5, {"A", "C", "B", "D"}, 0), 1, 2, 0, 0)
)

```

*(Tip: `MATCH` finds whether the student put A, C, B, or D. `CHOOSE` maps 'A' to 1 point, 'C' to 2 points, and anything else to 0. If the cell is blank, you can wrap it in an `IF(AI5="", 0, ...)`).*

---

### Step 4: Finalizing the Raw Score (Cell G5)

Since `D5` will now track your standard correct answers (worth 2 points each, *excluding* the partial-credit question and the dropped question), your final Raw Score formula in **G5** becomes:

```Excel
= (D5 * 2) + H5 + E5 + F5

```

* **`D5 * 2`**: Points from all standard M/C questions.
* **`H5`**: The partial credit points (1 for 'A', 2 for 'C') from the special question (Q21 for A / Q12 for B).
* **`E5` and `F5**`: Your existing additional score components (such as short answers, extra credit, etc.).

### Summary of What to Check on Your Sheet

1. **Verify Question Columns:** Ensure you know the exact Excel column letters for Q21(A), Q22(A), Q23(A) and Q12(B), Q16(B), Q25(B) so the array matches your layout.
2. **Dropped Question:** By omitting the dropped question column from the `SUMPRODUCT` range (or multiplying it by 0), it naturally contributes 0 points to `D5`.
3. **Two-Correct Question:** Evaluated using an `OR(Cell={"B","C"})` check to award 1 correct point cleanly.

## NEW PROMPT

Let's go back to the Step 1 mapping

It is correct that Question 1 is column M, Q2 at column N but Q20 is at AF, not AH (check your sequencing again)

Q21 is at column AG

Q22 at AH, Q23 at AI, Q24 at AJ, and finally Q25 at AK.
Disregard thinking about versions A and B at this time.

The correspondence of questions on Versions A and B are as follows. and I include the Excell cell reference for where the answer in the key is for each version:

Version A Q23 (with no choices correct) is at cell AI2 and for Version B it is Q25 at cell AK3. That is version A Q23 is identical with Version B Q25.

Version A Q22 (with two choices correct--choices B and C) is at cell AH2 and in Version B this is Question 16 at cell AB3

Now for the question where two choices are correct---with choice A being 1 point and choices C being 2 points--the Version A response is Question 21 at cell AG2 and the version B response is Question 12 at cell X3. This particularly question probably cannot be included with making exceptions to the Excel SUMPRODUCT formula, but you were going to explain how that was done

## NEW RESPONSE

Thank you for clearing up the exact column layout and the precise mapping between Version A and Version B!

Given that columns **M through AK** map sequentially from Question 1 to Question 25 for *both* versions (meaning the physical column a student types their answer into depends on the question number layout of the test they took), we can handle all three exceptions cleanly.

Here is how you can set up your formulas for **Column D** (number of standard correct M/C choices) and handle the **Partial Credit** exception without messy workarounds.

---

### Step 1: Adjusting Column D (Correct M/C Choices)

To calculate `D5` correctly, we need a formula that evaluates the student's choices (`M5:AK5`) against the correct answer key row (`$M$2:$AK$2` for Version A, `$M$3:$AK$3` for Version B), with three specific adjustments:

1. **Exclude Question 23 (Ver A) / Question 25 (Ver B)** because it has no correct choices (it sits in column **AI** for Version A and column **AK** for Version B).
2. **Exclude Question 22 (Ver A) / Question 16 (Ver B)** from the strict match because it has *two* correct answers (B or C). It sits in column **AH** for Version A and column **AB** for Version B.
3. **Exclude the Partial Credit Question** (Ver A Q21 at **AG** / Ver B Q12 at **X**) from the standard 2-point count, since it will be scored separately.

Instead of trying to force a single, unreadable block of text, we can use a dynamic `SUMPRODUCT` that checks all columns *except* the ones tied up in exceptions, and then manually adds a point if the student got the two-correct question right.

For **Cell D5**:

```xlsx
=SUMPRODUCT(
    --(M5:AK5 = TRIM(IF(L5="A", $M$2:$AK$2, $M$3:$AK$3)))
    * 
    ISNA(MATCH(COLUMN(M5:AK5), IF(L5="A", {COLUMN($AG$5), COLUMN($AH$5), COLUMN($AI$5)}, {COLUMN($X$5), COLUMN($AB$5), COLUMN($AK$5)}), 0))
) + 
IF(L5="A", --OR(AH5={"B","C"}), --OR(AB5={"B","C"}))
```

* **How it works:**
* The first part checks standard matches across `M5:AK5` against the correct key row.
* `ISNA(MATCH(...))` filters out the three exception columns so they don't count toward regular strict scoring.
* The final `IF(...)` checks the two-correct question specifically (`AH5` for Version A, `AB5` for Version B) and adds `1` if the student chose either "B" or "C".

---

### Step 2: Handling Exception 3 (Partial Credit Question)

As you noted, the question worth partial credit (2 points for C, 1 point for A) cannot easily live inside a simple binary `SUMPRODUCT`.

The cleanest way to handle this without cluttering your main raw score formula is to use a **Helper Column** (let's assume **Column H**). For student row 5, **`H5`** will look at whether they took Version A or B, check their answer for that specific question, and output their earned points (`2`, `1`, or `0`).

Put this formula in **`H5`** and drag it down to row 56:

```xlsx
=IF(L5="A",
    CHOOSE(MATCH(AG5, {"C", "A", "B", "D"}, 0), 2, 1, 0, 0),
    CHOOSE(MATCH(X5, {"C", "A", "B", "D"}, 0), 2, 1, 0, 0)
)

```

*(Note: If the cell is blank and you want to prevent error codes like `#N/A`, you can wrap it in an `IFERROR(..., 0)`).*

* **How it works:**
* For Version A, it checks **AG5** (Question 21). For Version B, it checks **X5** (Question 12).
* `MATCH` looks up the student's letter choice.
* `CHOOSE` maps 'C' to position 1 (earning **2 points**), 'A' to position 2 (earning **1 point**), and anything else (or blank) to 0.

---

### Step 3: Finalizing the Raw Score (Cell G5)

Now that your standard correct choices are tallied in `D5` (each worth 2 points) and your partial-credit points are isolated in `H5`, your Raw Score formula in **`G5`** becomes very straightforward:

```xlsx
= (D5 * 2) + H5 + E5 + F5
```

* **`D5 * 2`**: Points from all standard M/C questions (worth 2 points each).
* **`H5`**: The points from your partial-credit question (either 2, 1, or 0).
* **`E5` and `F5**`: Any other score components you have (like short answers or other sections).
