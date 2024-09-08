import React, { useEffect, useState } from 'react';
import { Button, Carousel, Col, Container, Row, Accordion, Spinner } from 'react-bootstrap';
import { BsPersonVcard } from "react-icons/bs";
import { FaPercent } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { getGPA } from '../Utils/helpers';
import { useSelector } from 'react-redux';
import { getStudent, getStudentCourses, getStudentDepartment, getStudentFaculty } from '../Utils/mysqlQueryFunctions';

function Student({}) {

    const faculties = useSelector(store => store.data.faculties);
    const departments = useSelector(store => store.data.departments);

    const navigate = useNavigate();
    const studentID = useSelector(store => store.auth.loginID);
    const loading = useSelector(store => store.auth.loading);
    const [studentInfo,setStudentInfo] = useState();
    const [courses,setCourses] = useState([]);

    useEffect(()=>{
        if(!loading && faculties.length && departments.length)
        {
            async function getStudentInfo()
            {
                const res = await getStudent(studentID);
    
                if(res)
                {
                    setStudentInfo(res);
    
                    const department = departments.find((dep) => dep.department_id === res.department_id);
                    console.log(res);
                    const facName = faculties.find((fac) => fac.faculty_id === department.faculty_id).faculty_name;
                    setStudentInfo(s =>({...s,depName:department.department_name,facName}));
    
                    setCourses(await getStudentCourses(studentID));
    
                }
                else navigate("/");
            }
            getStudentInfo();

        }
    },[loading,faculties,departments]);

    return (
        <div className='page-container'>
            <section>
            {
                loading || !studentInfo ?
                <Spinner size={200}/>
                : studentInfo &&
                <Container className='py-5 d-flex flex-column gap-5'>
                    <div className='d-flex flex-column'>
                        <div className='d-flex align-items-center gap-3 bg-accent text-white p-2 px-3 rounded-top'>
                            <BsPersonVcard size={45}/>
                            <h3 className=''>معلومات الطالب</h3>
                        </div>
                        <div className='w-100 d-flex flex-column border border-1 border-dark shadow rounded-bottom p-3'>
                                

                            <Row className='w-100 g-3'>
                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>إسم الطالب:</span>
                                    <span className='fs-5'>{studentInfo.name}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>كود الطالب:</span>
                                    <span className='fs-5'>{studentID}</span>
                                </Col>


                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>تاريخ الميلاد:</span>
                                    <span className='fs-5'>{new Date(studentInfo.date_of_birth).toLocaleDateString()}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>الرقم القومي:</span>
                                    <span className='fs-5'>{studentInfo.national_id}</span>
                                </Col>

                            </Row>
                            <hr />
                            <Row className='w-100 g-3'>
                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>الإيميل الجامعي:</span>
                                    <span className='fs-5'>{studentInfo.email}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'> العنوان:</span>
                                    <span className='fs-5'>{studentInfo.address}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>رقم الهاتف:</span>
                                    <span className='fs-5'>{studentInfo.mobile_no}</span>
                                </Col>


                                <Col className="col-12 col-md-6 d-flex flex-column">
                                <span className='fs-6 text-black-50'>رقم هاتف اخر:</span>
                                    <span className='fs-5'>{studentInfo.extra_mobile_no}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                <span className='fs-6 text-black-50'>عام الالتحاق:</span>
                                    <span className='fs-5'>{studentInfo.year_of_enrollment}</span>
                                </Col>

                            </Row>
                            <hr />
                            <Row className='w-100 g-3'>
                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>الكلية:</span>
                                    <span className='fs-5'>{studentInfo.facName}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                <span className='fs-6 text-black-50'>القسم العلمي:</span>
                                    <span className='fs-5'>{studentInfo.depName}</span>
                                </Col>


                                <Col className="col-12 col-md-6 d-flex flex-column">
                                <span className='fs-6 text-black-50'>الفرقة الدراسية:</span>
                                    <span className='fs-5'>{studentInfo.level}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                <span className='fs-6 text-black-50'>المجموعة:</span>
                                    <span className='fs-5'>{studentInfo.section_number}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                <span className='fs-6 text-black-50'>المعدل التراكمي:</span>
                                    <span className='fs-5'>{studentInfo.gpa.toFixed(2)}</span>
                                </Col>

                            </Row>

                        </div>
                    </div>
                    <div className='d-flex flex-column'>
                        <div className='d-flex align-items-center gap-3 bg-accent text-white p-2 px-3 rounded-top'>
                            <FaPercent size={25}/>
                            <h3 className=''>التقييمات</h3>
                        </div>
                        <div className='w-100 d-flex flex-column border border-1 border-dark shadow rounded-bottom p-3'>
                        {
                            courses.length ?
                            <Accordion defaultActiveKey={["0"]}>
                            {
                                Array.from({length:studentInfo.level}).map((x,level)=>
                                courses.filter((c)=>c.level === level+1).length>0 &&
                                <Accordion.Item className='mb-3 border border-1 border-dark rounded-3 shadow' eventKey={`${level}`}>
                                    <Accordion.Header>
                                        <h4 className='w-100 text-center'>الفرقة {level+1}</h4>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className='w-100 d-flex flex-column gap-4'>
                                        {
                                            courses.filter((c)=>c.level === level+1 && c.semester === 1).length>0 &&
                                            <div className='w-100'>
                                                <h4>الفصل الدراسي الأول</h4>
                                                <hr />
                                                <div className='table-column mt-4 mb-5 border border-2 rounded-3 overflow-hidden'>
                                                    <div className='table-column-scroll-wrapper'>
                                                        <Row className='bg-dark text-white p-2'>
                                                            <Col className='col-2'>كود المادة</Col>
                                                            <Col className='col-2'>إسم المادة</Col>
                                                            <Col className='col-2'>عدد ساعاتها</Col>

                                                            <Col className='col-2'>تقييم أعمال السنة</Col>
                                                            <Col className='col-2'>تقييم اختبار منتصف الفصل</Col>
                                                            <Col className='col-2'>تقييم الاختبار النهائي</Col>

                                                        </Row>
                                                        {
                                                            courses.filter((c)=>c.level === level+1 && c.semester === 1).map((c,i)=>

                                                            <Row className="py-3 px-2 border-2 border-bottom">
                                                                <Col className='col-2'>{c.course_id}</Col>
                                                                <Col className='col-2'>{c.course_name}</Col>
                                                                <Col className='col-2'>{c.credit_hours} ساعات</Col>

                                                                <Col className='col-2 fs-5'>{c.classwork_grade!==null ? c.classwork_grade : "--"} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                <Col className='col-2 fs-5'>{c.midterm_grade!==null ? c.midterm_grade : "--"} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                <Col className='col-2 fs-5'>{c.finals_grade!==null ? c.finals_grade : "--"} <span className='fs-6 text-black-50'>/60</span></Col>

                                                            </Row>
                                                            )
                                                        }
                                                    </div>
                                                    <Row className='bg-dark text-white text-white-50 fs-5 p-3'>
                                                        <Col>
                                                            المعدل التراكمي للفصل الدراسي: <span className='text-white'>
                                                            {
                                                                getGPA(courses.filter((c)=>c.level === level+1 && c.semester === 1))
                                                            }
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        }
                                        {
                                            courses.filter((c)=>c.level === level+1 && c.semester === 2).length>0 &&
                                            <div className='w-100'>
                                                <h4>الفصل الدراسي الثاني</h4>
                                                <hr />
                                                <div className='table-column mt-4 mb-5 border border-2 rounded-3 overflow-hidden'>
                                                    <div className='table-column-scroll-wrapper'>
                                                        <Row className='bg-dark text-white p-2'>
                                                            <Col className='col-2'>كود المادة</Col>
                                                            <Col className='col-2'>إسم المادة</Col>
                                                            <Col className='col-2'>عدد ساعاتها</Col>

                                                            <Col className='col-2'>تقييم أعمال السنة</Col>
                                                            <Col className='col-2'>تقييم اختبار منتصف الفصل</Col>
                                                            <Col className='col-2'>تقييم الاختبار النهائي</Col>

                                                        </Row>
                                                        {
                                                            courses.filter((c)=>c.level === level+1 && c.semester === 2).map((c,i)=>

                                                            <Row className="py-3 px-2 border-2 border-bottom">
                                                                <Col className='col-2'>{c.course_id}</Col>
                                                                <Col className='col-2'>{c.course_name}</Col>
                                                                <Col className='col-2'>{c.credit_hours} ساعات</Col>

                                                                <Col className='col-2 fs-5'>{c.classwork_grade!==null ? c.classwork_grade : "--"} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                <Col className='col-2 fs-5'>{c.midterm_grade!==null ? c.midterm_grade : "--"} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                <Col className='col-2 fs-5'>{c.finals_grade!==null ? c.finals_grade : "--"} <span className='fs-6 text-black-50'>/60</span></Col>

                                                            </Row>
                                                            )

                                                        }
                                                    </div>
                                                    <Row className='bg-dark text-white text-white-50 fs-5 p-3'>
                                                        <Col>
                                                            المعدل التراكمي للفصل الدراسي: <span className='text-white'>
                                                            {
                                                                getGPA(courses.filter((c)=>c.level === level+1 && c.semester === 2))
                                                            }
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>

                                        }
                                            <div className='bg-accent p-2 fs-4 text-center text-white-50 rounded-3 shadow'>
                                                المعدل التراكمي للعام الدراسي: <span className='text-white fw-semibold'>
                                                {
                                                    getGPA(courses.filter((c)=>c.level === level+1))
                                                }
                                                </span>
                                            </div>
                                        </div>
                                        
                                    </Accordion.Body>
                                </Accordion.Item>
                                )
                            }
                            </Accordion>
                            : <h3 className='text-center w-100 p-3'>لا يوجد تقييمات للطالب حتى الان.</h3>
                        }

                        </div>
                    </div>

                </Container>
            }
            </section>
        </div>
    );
}

export default Student;