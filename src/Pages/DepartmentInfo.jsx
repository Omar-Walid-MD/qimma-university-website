import React, { useEffect, useState } from 'react';
import { Button, Carousel, Col, Container, Row, Accordion } from 'react-bootstrap';
import { FaUsers } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { Link, useParams } from 'react-router-dom';
import { getDepartment, getDepartmentCourses, getFaculty } from '../Utils/queryFunctions';
import { useSelector } from 'react-redux';

function DepartmentInfo({}) {

    const {departmentID} = useParams();

    const faculties = useSelector(store => store.data.faculties)
    const departments = useSelector(store => store.data.departments);

    const department = departments.find((dep) => dep.department_id === departmentID);

    const [faculty,setFaculty] = useState();
    const [courses,setCourses] = useState([]);

    const [levelCount,setLevelCount] = useState(0);

    function getLevelCount(courses)
    {
        return courses.reduce((max,c) => {return Math.max(max,c.level)},0);
    }

    useEffect(()=>{
        if(department)
        {
            setFaculty(faculties.find((fac) => fac.faculty_id === department.faculty_id));
        }
    },[department])

    useEffect(()=>{

        async function getCourses()
        {
            const res = await getDepartmentCourses(departmentID);
            setCourses(res);
            setLevelCount(getLevelCount(res));
        }
        getCourses();
        
    },[department]);



    return (
        <div>
            <header className='home-header fac-bg w-100 bg-dark text-white text-shadow p-5 d-flex align-items-center justify-content-between'
            style={{backgroundImage: `url(${require(`../assets/img/departments/${departmentID}.jpg`)}`}}

            >
                <Container className='d-flex w-100 h-100 d-flex justify-content-center justify-content-md-start'>
                {
                        department && faculty &&
                        <div className='text-center text-md-start'>
                            <h4 className='mb-3 text-white-50'>{faculty.faculty_name}</h4>
                            <h1 className='mb-4'>{department.department_name}</h1>
                            <Link className='link text-white-50' to={`/faculty/${faculty.faculty_id}`}>الرجوع الى الكلية</Link>
                        </div>
                    }
                </Container>
            </header>
            <section className='p-3 p-lg-5'>
                <Container className='d-flex flex-column gap-3 gap-lg-5'>
                    <div>
                        <h2 className='mb-4 mb-lg-5 text-center'>المقررات الدراسية</h2>
                        <Accordion defaultActiveKey={["0"]}>
                        {
                            Array.from({length:levelCount}).map((x,level)=>
                            <Accordion.Item className='mb-3 border border-1 border-dark rounded-3 shadow' eventKey={`${level}`}>
                                <Accordion.Header>
                                    <h4 className='w-100 text-center'>الفرقة {level+1}</h4>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <div className='w-100 d-flex flex-column flex-lg-row gap-4'>
                                        <div className='w-100'>
                                            <h4>الفصل الدراسي الأول</h4>
                                            <hr />
                                            <div className='table-column mt-4 mb-5 border border-2 rounded-3 overflow-hidden'>
                                                <Row className='bg-dark text-white p-2'>
                                                    <Col className='col-3'>كود المادة</Col>
                                                    <Col className='col-6'>إسم المادة</Col>
                                                    <Col className='col-3'>عدد ساعاتها</Col>
                                                </Row>
                                                {
                                                    courses.filter((c)=>c.level === level+1 && c.semester === 1).map((c,i)=>

                                                    <Row className={`py-3 px-2 border-2 border-bottom`}>
                                                        <Col className='col-3'>{c.course_id}</Col>
                                                        <Col className='col-6'>{c.course_name}</Col>
                                                        <Col className='col-3'>{c.credit_hours} ساعات</Col>
                                                    </Row>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        <div className='w-100'>
                                            <h4>الفصل الدراسي الثاني</h4>
                                            <hr />
                                            <div className='table-column mt-4 mb-5 border border-2 rounded-3 overflow-hidden'>
                                                <Row className='bg-dark text-white p-2'>
                                                    <Col className='col-3'>كود المادة</Col>
                                                    <Col className='col-6'>إسم المادة</Col>
                                                    <Col className='col-3'>عدد ساعاتها</Col>
                                                </Row>
                                                {
                                                    courses.filter((c)=>c.level === level+1 && c.semester === 2).map((c,i)=>

                                                    <Row className={`py-3 px-2 border-2 border-bottom`}>
                                                        <Col className='col-3'>{c.course_id}</Col>
                                                        <Col className='col-6'>{c.course_name}</Col>
                                                        <Col className='col-3'>{c.credit_hours} ساعات</Col>
                                                    </Row>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    
                                </Accordion.Body>
                            </Accordion.Item>
                            )
                        }
                        </Accordion>
                    </div>
                </Container>
            </section>
        </div>
    );
}

export default DepartmentInfo;