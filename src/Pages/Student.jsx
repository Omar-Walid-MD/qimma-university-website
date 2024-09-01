import React, { useEffect, useState } from 'react';
import { Button, Carousel, Col, Container, Row, Accordion, Spinner } from 'react-bootstrap';
import { BsPersonVcard } from "react-icons/bs";
import { FaPercent } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { getGPA, performQuery } from '../helpers';
import { useSelector } from 'react-redux';

function Student({}) {

    const navigate = useNavigate();
    const studentID = useSelector(store => store.auth.loginID);
    const loading = useSelector(store => store.auth.loading);
    const [studentInfo,setStudentInfo] = useState();
    const [courses,setCourses] = useState([]);

    useEffect(()=>{
        async function getSudentInfo()
        {
            const res = await performQuery("students",`WHERE Student_ID = "${studentID}"`);
            if(res.length)
            {
                setStudentInfo(res[0]);
                const dep = (await performQuery("students",`
                    JOIN Departments ON Students.Department_ID = Departments.Department_ID
                    WHERE Students.Student_ID = "${studentID}"
                `))[0];

                const facName = (await performQuery("departments",
                `JOIN Faculties ON Departments.Faculty_ID = Faculties.Faculty_ID
                WHERE Departments.Department_ID = '${dep.Department_ID}'
                `))[0].Faculty_Name;

                setStudentInfo(s =>({...s,depName:dep.Department_Name,facName}));

                setCourses(await performQuery("student-courses",
                `JOIN Courses ON Student_Courses.Course_ID = Courses.Course_ID WHERE Student_ID = "${studentID}"`));

            }
            else navigate("/");

        }
        if(!loading) getSudentInfo();
    },[loading]);



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
                                    <span className='fs-5'>{studentInfo.Name}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>كود الطالب:</span>
                                    <span className='fs-5'>{studentID}</span>
                                </Col>


                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>تاريخ الميلاد:</span>
                                    <span className='fs-5'>{new Date(studentInfo.Date_Of_Birth).toLocaleDateString()}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>الرقم القومي:</span>
                                    <span className='fs-5'>{studentInfo.National_ID}</span>
                                </Col>

                            </Row>
                            <hr />
                            <Row className='w-100 g-3'>
                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>الإيميل الجامعي:</span>
                                    <span className='fs-5'>{studentInfo.Email}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'> العنوان:</span>
                                    <span className='fs-5'>{studentInfo.Address}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                    <span className='fs-6 text-black-50'>رقم الهاتف:</span>
                                    <span className='fs-5'>{studentInfo.Mobile_No}</span>
                                </Col>


                                <Col className="col-12 col-md-6 d-flex flex-column">
                                <span className='fs-6 text-black-50'>رقم هاتف اخر:</span>
                                    <span className='fs-5'>{studentInfo.Extra_Mobile_No}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                <span className='fs-6 text-black-50'>عام الالتحاق:</span>
                                    <span className='fs-5'>{studentInfo.Year_Of_Enrollment}</span>
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
                                    <span className='fs-5'>{studentInfo.Level}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                <span className='fs-6 text-black-50'>المجموعة:</span>
                                    <span className='fs-5'>{studentInfo.Section_Number}</span>
                                </Col>

                                <Col className="col-12 col-md-6 d-flex flex-column">
                                <span className='fs-6 text-black-50'>المعدل التراكمي:</span>
                                    <span className='fs-5'>{studentInfo.GPA.toFixed(2)}</span>
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
                                Array.from({length:studentInfo.Level}).map((x,level)=>
                                courses.filter((c)=>c.Level === level+1).length>0 &&
                                <Accordion.Item className='mb-3 border border-1 border-dark rounded-3 shadow' eventKey={`${level}`}>
                                    <Accordion.Header>
                                        <h4 className='w-100 text-center'>الفرقة {level+1}</h4>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <div className='w-100 d-flex flex-column gap-4'>
                                        {
                                            courses.filter((c)=>c.Level === level+1 && c.Semester === 1).length>0 &&
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
                                                            courses.filter((c)=>c.Level === level+1 && c.Semester === 1).map((c,i)=>

                                                            <Row className="py-3 px-2 border-2 border-bottom">
                                                                <Col className='col-2'>{c.Course_ID}</Col>
                                                                <Col className='col-2'>{c.Course_Name}</Col>
                                                                <Col className='col-2'>{c.Credit_Hours} ساعات</Col>

                                                                <Col className='col-2 fs-5'>{c.Classwork_Grade!==null ? c.Classwork_Grade : "--"} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                <Col className='col-2 fs-5'>{c.Midterm_Grade!==null ? c.Midterm_Grade : "--"} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                <Col className='col-2 fs-5'>{c.Finals_Grade!==null ? c.Finals_Grade : "--"} <span className='fs-6 text-black-50'>/60</span></Col>

                                                            </Row>
                                                            )
                                                        }
                                                    </div>
                                                    <Row className='bg-dark text-white text-white-50 fs-5 p-3'>
                                                        <Col>
                                                            المعدل التراكمي للفصل الدراسي: <span className='text-white'>
                                                            {
                                                                getGPA(courses.filter((c)=>c.Level === level+1 && c.Semester === 1))
                                                            }
                                                            </span>
                                                        </Col>
                                                    </Row>
                                                </div>
                                            </div>
                                        }
                                        {
                                            courses.filter((c)=>c.Level === level+1 && c.Semester === 2).length>0 &&
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
                                                            courses.filter((c)=>c.Level === level+1 && c.Semester === 2).map((c,i)=>

                                                            <Row className="py-3 px-2 border-2 border-bottom">
                                                                <Col className='col-2'>{c.Course_ID}</Col>
                                                                <Col className='col-2'>{c.Course_Name}</Col>
                                                                <Col className='col-2'>{c.Credit_Hours} ساعات</Col>

                                                                <Col className='col-2 fs-5'>{c.Classwork_Grade!==null ? c.Classwork_Grade : "--"} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                <Col className='col-2 fs-5'>{c.Midterm_Grade!==null ? c.Midterm_Grade : "--"} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                <Col className='col-2 fs-5'>{c.Finals_Grade!==null ? c.Finals_Grade : "--"} <span className='fs-6 text-black-50'>/60</span></Col>

                                                            </Row>
                                                            )

                                                        }
                                                    </div>
                                                    <Row className='bg-dark text-white text-white-50 fs-5 p-3'>
                                                        <Col>
                                                            المعدل التراكمي للفصل الدراسي: <span className='text-white'>
                                                            {
                                                                getGPA(courses.filter((c)=>c.Level === level+1 && c.Semester === 2))
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
                                                    getGPA(courses.filter((c)=>c.Level === level+1))
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