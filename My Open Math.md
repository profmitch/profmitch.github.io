# My Open Math Use

## Create Course

Add New Course --> three options

- start blank
- copy template or promoted course
- copy from my or colleague course

### Start Blank

Many things: indicate level, primary textbook, modality contents

### Copy from My or Colleague

- My Courses
- Group Course
- Our lookup Course ID

Enrollment key might be necessary to copy
Would create course name

**Availability and Access**

## Rearranging Content

Use the gear icon  and Move command
Can also use Quick Rearrange
Rather than deleting stuff during editing, create a section "Trash Can" and move items there. After your done you can delete.

## Common Tasks

### Making a Due Date Exception

- Select "List Students" from grey control box on course page.
- Next to student's name, click on "Make Exception" link.
- Select assessment for the exception.
- Enter new start and end date to be applied to the student
- Click "Submit"
  
### Enrolling Students

It is more common for students to self-enroll with instructor giving a course ID and enrollment key, which can be viewed on Admin page.

Instructors can enroll students who are registered on system by clicking "List Students" from grey control box on course page

- Select "Enroll student with known username"
- Enter the username to enroll

For registering and enrolling a large group, use "Import Students from File" on the "List Students" page. The appropriate input file is a CSV with list of student names

### Copying Course Items

Course items can be shared between users on the system, both on same installation and between servers. Sharing items on different servers is done with the **Import/Export Course Items** tool. For users on the same server, use **Copy Course Items**.

### Setting Up Assessments

#### Arranging and Grouping Questions

With questions added to an assessment, pulldown select boxes next to question to rearrange the question order. This is not necessary if the Shuffle assessment option is selected, which randomizes question order.

Questions can also be grouped into a "mini-pool" by changing at the beginning of the Questions in Assessment section the option "Use select boxes to" option to "Group Questions".

#### Changing Settings for Individual Questions

#### Categorizing Questions

## Writing Questions

### Common Control

In an example, the question will have three variables *a*, *b*, and *c*, and their values will be randomly chosen:

```php
$b,$c = nonzerodiffrands(-3,3,2)
$a = nonzerorand(-2,2)
$eqn = makepretty("$a*(x-$b)^2+$c")
```

In the first line, $b and $c are defined using a randomizer which returns different nonzero integers, with numbers between -3 and 3, and two of them are generated

