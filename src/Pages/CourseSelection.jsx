import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { getStudent, getStudentAvailableCourses, getStudentRegisteredCourses, insertStudentSelectedCourses } from '../Utils/mysqlQueryFunctions';

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
            sum += sc.credit_hours;
        });
        return sum;
    }

    useEffect(()=>{
        async function getStudentInfo()
        {
            setStudentInfo(await getStudent(studentID));
        }
        getStudentInfo();
    },[studentID]);


    useEffect(()=>{

        if(studentInfo)
        {
            async function getStudentCourses()
            {
                setCourses(await getStudentAvailableCourses(studentInfo));
                setRegisteredCourses(await getStudentRegisteredCourses(studentInfo));
            }
            getStudentCourses();

        }

    },[studentInfo]);

    async function submitCourses()
    {
        await insertStudentSelectedCourses(studentInfo,selectedCourses);
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
                                <Col className='col-3'>{course.course_id}</Col>
                                <Col className='col-5'>{course.course_name}</Col>
                                <Col className='col-2'>{course.credit_hours}</Col>
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
                                <Col className='col-3'>{selectedCourse.course_id}</Col>
                                <Col className='col-6'>{selectedCourse.course_name}</Col>
                                <Col className='col-2'>{selectedCourse.credit_hours}</Col>
                                <Col className='col-1 px-3'>
                                    <Button className='main-btn danger'
                                    onClick={()=>{
                                        setSelectedCourses(s => s.filter((sc) => sc.course_id !== selectedCourse.course_id))
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