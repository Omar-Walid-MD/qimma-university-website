import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { performQuery } from '../helpers';
import axios from 'axios';
import { useNavigate } from 'react-router';

function CourseSelection({}) {

    const navigate = useNavigate();
    const studentID = useSelector(store => store.auth.loginID);

    const [courses,setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [studentInfo,setStudentInfo] = useState();

    const [registeredCourses,setRegisteredCourses] = useState([]);

    function getSelectedHours()
    {
        let sum = 0;
        selectedCourses.forEach((sc)=>{
            sum += sc.Credit_Hours;
        });
        return sum;
    }

    useEffect(()=>{
        async function getStudentInfo()
        {
            const res = await performQuery("students",`WHERE Student_ID = "${studentID}"`);
            setStudentInfo(res[0]);
        }
        getStudentInfo();
    },[studentID]);


    useEffect(()=>{

        async function getCourses()
        {
            setCourses(await performQuery("department-courses",
            `JOIN Courses ON Department_Courses.Course_ID = Courses.Course_ID WHERE Department_Courses.Department_ID = "${studentInfo.Department_ID}" AND Level = ${studentInfo.Level} AND Semester = 1`))
        }
        async function getRegisteredCourse()
        {
            setRegisteredCourses(await performQuery("student-courses",
            `JOIN Courses ON Student_Courses.Course_ID = Courses.Course_ID WHERE Student_ID = "${studentID}" AND Level = ${studentInfo.Level} AND Semester = 1`))
        }
        if(studentInfo)
        {
            getCourses();
            getRegisteredCourse();

        }

    },[studentInfo]);

    function submitCourses()
    {
        selectedCourses.forEach(async (selectedCourse)=>{
            await axios.post("http://localhost:8000/student-courses",
                [studentID, selectedCourse.Course_ID, studentInfo.Department_ID, studentInfo.Section_Number, studentInfo.Level, 2024, 1, null, null, null]
            );
        });
        navigate("/");
    }

   
    return (
        <div className='page-container'>
            <Container className='py-5 d-flex flex-column gap-3'>
            {
                courses && registeredCourses.length ?
                <>
                    <h1>
                        تم بالفعل تسجيل المقررات
                    </h1>
                </>
                :
                <>
                    <h3>اختيار المقررات</h3>
                    <div className='shadow rounded-3 p-4'>
                        <div className='border border-2 border-black rounded-3 overflow-hidden'>
                            <Row className='bg-black text-white p-2'>
                                <Col className='col-3'>كود المادة</Col>
                                <Col className='col-5'>إسم المادة</Col>
                                <Col className='col-2'>عدد الساعات</Col>
                            </Row>
                        {
                            courses.map((course,i)=>
                            !selectedCourses.includes(course) &&
                            <Row className='p-2 border-bottom border-2 border-black'>
                                <Col className='col-3'>{course.Course_ID}</Col>
                                <Col className='col-5'>{course.Course_Name}</Col>
                                <Col className='col-2'>{course.Credit_Hours}</Col>
                                <Col className='col-2'>
                                    <Button className='main-btn primary'
                                    onClick={()=>{
                                        setSelectedCourses(s => ([...s,course]))
                                    }}
                                    >اختيار</Button>
                                </Col>
                            </Row>
                            )
                        }
                        </div>
                    </div>
                    <div className='shadow rounded-3 p-4'>
                        <div className="w-100 d-flex justify-content-between mb-3">
                            <h4>عدد الساعات المختارة: {getSelectedHours()}/15</h4>
                        </div>
                        <div className='border border-2 border-black rounded-3 overflow-hidden'>
                            <Row className='bg-black text-white p-2'>
                                <Col className='col-3'>كود المادة</Col>
                                <Col className='col-5'>إسم المادة</Col>
                                <Col className='col-2'>عدد الساعات</Col>
                            </Row>
                        {
                            selectedCourses.map((selectedCourse,i)=>
                            
                            <Row className='p-2 border-bottom border-2 border-black'>
                                <Col className='col-3'>{selectedCourse.Course_ID}</Col>
                                <Col className='col-6'>{selectedCourse.Course_Name}</Col>
                                <Col className='col-2'>{selectedCourse.Credit_Hours}</Col>
                                <Col className='col-1 px-3'>
                                    <Button className='main-btn danger'
                                    onClick={()=>{
                                        setSelectedCourses(s => s.filter((sc) => sc.Course_ID !== selectedCourse.Course_ID))
                                    }}
                                    
                                    >إزالة</Button>
                                </Col>
                            </Row>
                            )
                        }
                        </div>

                    </div>
                    <Button className='main-btn' disabled={getSelectedHours()<15} onClick={()=>submitCourses()}>حفظ المقررات</Button>
                </>
            }

            </Container>
        </div>
    );
}

export default CourseSelection;