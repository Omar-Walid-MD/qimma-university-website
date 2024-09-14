import axios from "axios";

async function performQuery(table,condition="",columns="*")
{
    const res = await axios.get(`http://${process.env.REACT_APP_SQL_HOST}:${process.env.REACT_APP_SQL_PORT}/${table}`,{params:{condition,columns}});
    
    for (let i = 0; i < res.data.length; i++)
    {
        const item = res.data[i];
        Object.keys(item).forEach((key)=>{
            item[key.toLowerCase()] = item[key];
            delete item[key];
        })    
    }
    return res.data;
}

export async function getFaculties()
{
    const res = await performQuery("faculties");
    return res;
}

export async function getDepartments()
{
    return await performQuery("departments");
}


export async function getDepartmentCourses(department_id)
{
    return await performQuery("department-courses",`JOIN Courses ON Department_Courses.course_id = Courses.course_id WHERE department_id = "${department_id}"`);
}

export async function getStudent(student_id)
{
    return (await performQuery("students",`WHERE student_id = "${student_id}"`))[0];
}


export async function getStudentCourses(student_id)
{
    return await performQuery("student-courses",`JOIN Courses ON Student_Courses.course_id = Courses.course_id WHERE student_id = "${student_id}"`);
}

export async function getParent(parent_id)
{
    return (await performQuery("parents",`WHERE parent_id = "${parent_id}"`))[0];
}

export async function getStudentAvailableCourses(student)
{
    return await performQuery("department-courses",`JOIN Courses ON Department_Courses.course_id = Courses.course_id WHERE Department_Courses.department_id = "${student.department_id}" AND level = ${student.level} AND semester = 1`);
}

export async function getStudentRegisteredCourses(student)
{
    return await performQuery("student-courses",`JOIN Courses ON Student_Courses.course_id = Courses.course_id WHERE student_id = "${student.student_id}" AND level = ${student.level} AND semester = 1`);
}

export async function insertStudentSelectedCourses(student,selectedCourses)
{
    selectedCourses.forEach(async (selectedCourse)=>{
        await axios.post(`http://{${process.env.REACT_APP_SQL_HOST}}:${process.env.REACT_APP_SQL_PORT}/student-courses`,
            [student.student_id, selectedCourse.course_id, student.department_id, student.Section_Number, student.level, 2024, 1, null, null, null]
        );
    });
}

export async function getStudentsFiltered(args)
{
    const query = "WHERE " + Object.keys(args).filter((key) => args[key]).map((key)=> `${key} LIKE "%${args[key]}%"`).join(" AND ");
    return await performQuery("students",query);

}


export async function getProfessors()
{
    return await performQuery("professors");
}

export async function getProfessorCourses(prof_id)
{
    return await performQuery("professor-courses",`JOIN Courses ON Professor_Courses.course_id = Courses.course_id WHERE prof_id = "${prof_id}"`);    
}

export async function getProfessorsFiltered(args)
{
    const query = "WHERE " + Object.keys(args).filter((key) => args[key]).map((key)=> `${key} LIKE "%${args[key]}%"`).join(" AND ");
    return await performQuery("professors",query);

}


export async function getRegisteredLogin(email)
{
    return (await performQuery("login",`WHERE email = "${email}"`))[0];
}

export async function getAllParentsIds()
{
    return await performQuery("parents","","Parent_ID");
}

export async function getAllStudentsIds()
{
    return await performQuery("students","","Student_ID");
}

export async function addParent(parent)
{
    return await axios.post(`http://${process.env.REACT_APP_SQL_HOST}:${process.env.REACT_APP_SQL_PORT}/parents`,parent);
}

export async function addStudent(student)
{
    return await axios.post(`http://${process.env.REACT_APP_SQL_HOST}:${process.env.REACT_APP_SQL_PORT}/students`,student);
}

export async function addLogin(login)
{
    return await axios.post(`http://${process.env.REACT_APP_SQL_HOST}:${process.env.REACT_APP_SQL_PORT}/login`,login);
}

export async function getRandomStudentLogin()
{
    return (await performQuery("login","ORDER BY RAND() LIMIT 1"))[0];
}