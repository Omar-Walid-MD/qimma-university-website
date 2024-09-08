export const makeId = function(length)
{
    let s = "1234567890";
    let id = "";

    for (let i = 0; i < length; i++) {
        let char = s[parseInt(Math.random()*(s.length-1))];
        id += char;
    }

    return id;
}

export const makeUniqueId = function(list,length=5)
{
    let id = "";
    do {
        id = makeId(length)
    } while (list.map((object) => object.id).includes(id));
    
    return id;
}

export function getGPA(courses)
{
    let gradePoints = 0;
    let credits = 0;
    courses.forEach((course)=>{
        const t = course.classwork_grade+course.midterm_grade+course.finals_grade;
        gradePoints += t/25*course.credit_hours;
        credits += course.credit_hours;
    });

    return (gradePoints/credits).toFixed(2);
}