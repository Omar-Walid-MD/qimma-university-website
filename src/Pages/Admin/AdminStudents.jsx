import React, { useEffect, useState } from 'react';
import { Button, Carousel, Col, Container, Row, Accordion, Modal, Form } from 'react-bootstrap';
import { FaArrowLeftLong } from "react-icons/fa6";
import { getGPA } from '../../Utils/helpers';
import { Link, useNavigate } from 'react-router-dom';
import { BsPersonVcard } from 'react-icons/bs';
import { IoMdArrowDroprightCircle } from "react-icons/io";
import { FaPercent, FaFilter } from 'react-icons/fa';
import { FaFilterCircleXmark } from "react-icons/fa6";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSelector } from 'react-redux';
import { getParent, getStudentCourses, getStudentsFiltered } from '../../Utils/queryFunctions';

const filterSchema = yup.object({

    name: yup.string(),
    email: yup.string(),
    national_id: yup.string(),
    mobile_no: yup.string()
});

function AdminStudents({}) {

    const faculties = useSelector(store => store.data.faculties);
    const departments = useSelector(store => store.data.departments);

    const [filteredDepartments,setFilteredDepartments] = useState(departments);

    const [students,setStudents] = useState([]);

    const [studentInfo,setStudentInfo] = useState();
    const [studentInfoCourses,setStudentInfoCourses] = useState([]);
    const [studentInfoParent,setStudentInfoParent] = useState([]);

    const [studentModal, setStudentModal] = useState(false);
    const handleStudentInfoClose = () => setStudentModal(false);
    const handleStudentInfoShow = () => setStudentModal(true);

    const [filterModal,setFilterModal] = useState(false);
    const handleFilterClose = () => setFilterModal(false);
    const handleFilterShow = () => setFilterModal(true);

    const { register: registerStudentFilters, handleSubmit: handleSubmitStudentFilters, reset: resetStudentFilters, formState: { errors: errorsStudentFilters } } = useForm({ resolver: yupResolver(filterSchema) });

    async function onStudentFilterSubmit(data)
    {
        setSearchFilters(data)
        handleStudentInfoClose();
        if(Object.keys(data).some((key) => data[key]))
        {
            getStudentsFiltered(data);
            setStudents();
            handleFilterClose();
        }
    }


    const [filters,setFilters] = useState({
        fac: "",
        dep: "",
        level: null
    });

    const [searchFilters,setSearchFilters] = useState({
        name: "",
        national_id: "",
        mobile_no: "",
        email: ""
    });

    function handleFilters(prop,value)
    {
        setFilters(x => ({...x,[prop]:value}));
    }

    function getFacultyFromID()
    {
        let fac = faculties.find((fac)=>fac.faculty_id===filters.fac)
        return fac ? fac.faculty_name : "";
    }

    function getDepartmentFromID()
    {
        let dep = departments.find((dep)=>dep.department_id===filters.dep)
        return dep ? dep.department_name : "";
    }


    useEffect(()=>{
        if(filters.fac && !filters.dep)
        {
            setFilteredDepartments(departments.filter((dep) => dep.faculty_id === filters.fac))
        }

        if(filters.fac && filters.dep && filters.level!==null)
        {
            
            setStudents(getStudentsFiltered({
                "department_id": filters.dep,
                "level": filters.level
            }))
        }

    },[filters]);

    useEffect(()=>{
        async function getStudentInfo()
        {
            setStudentInfoCourses(getStudentCourses(studentInfo.student_id));

            setStudentInfoParent(getParent(studentInfo.parent_id));
        }
        if(studentInfo) getStudentInfo();
    },[studentInfo]);

    const navigate = useNavigate();

    const loggedIn = useSelector(store => store.auth.loggedIn);
    const loading = useSelector(store => store.auth.loading);


    useEffect(()=>{
        if (!loggedIn && !loading) navigate("/");
    },[loggedIn,loading]);

    return (
        <div className='page-container'>
            <Container className="p-3 p-md-5 d-flex flex-column align-items-center gap-4">
                <h2 className='border-bottom border-black border-2 pb-2'>بيانات الطلاب</h2>
                <div className="w-100 d-flex justify-content-center justify-content-md-start">
                    <Button as={Link} to="/dashboard" className='main-btn primary d-flex align-items-center gap-2'>
                    <IoMdArrowDroprightCircle size={20} />
                    إلى لوحة البيانات
                    </Button>
                </div>
                <div className='w-100 d-flex flex-column align-items-center border border-2 shadow rounded-3 p-4 gap-3'>
                    <div className="w-100 d-flex align-items-center justify-content-between">
                        <div className='d-flex gap-2 align-self-start text-primary'>
                            {
                                filters.fac && 
                                <Button variant='transparent' className='border-0 p-0'
                                onClick={()=>{
                                    setStudents([]);
                                    handleFilters("fac",null);
                                    handleFilters("dep",null);
                                    handleFilters("level",null);
                                }}>الرئيسية</Button>
                            }
                            {
                                filters.dep && 
                                <Button variant='transparent' className='border-0 p-0'
                                onClick={()=>{
                                    setStudents([]);
                                    // handleFilters("fac",null);
                                    handleFilters("dep",null);
                                    handleFilters("level",null);
                                }}><FaArrowLeftLong /> {getFacultyFromID()} </Button>
                            }
                            {
                                filters.level!==null &&
                                <Button variant='transparent' className='border-0 p-0'
                                onClick={()=>{
                                    setStudents([]);
                                    handleFilters("level",null);
                                }}><FaArrowLeftLong /> {getDepartmentFromID()}</Button>
                            }
                        </div>
                        <div>
                        {
                            !filters.fac &&
                            <>
                            {
                                !Object.keys(searchFilters).some((key) => searchFilters[key]) ?
                                <Button className='main-btn d-flex align-items-center gap-2' onClick={handleFilterShow}>
                                    <FaFilter  size={20}/>
                                    فلاتر البحث
                                </Button>
                                :
                                <Button className='main-btn danger d-flex align-items-center gap-2' 
                                onClick={()=>{
                                    setStudents([]);
                                    setSearchFilters({
                                        name: "",
                                        national_id: "",
                                        mobile_no: "",
                                        email: ""
                                    });
                                }}>
                                    <FaFilterCircleXmark size={20} />
                                    محو الفلاتر
                                </Button>
                            }
                            </>
                        }
                        
                        </div>
                    </div>
                    
                {
                    students.length ?
                    <>
                        <h3>الطلاب</h3>
                        <div className='table-column w-100 d-flex flex-column gap-3'>
                            <div className='table-column-scroll-wrapper'>
                                <Row className='bg-dark text-white p-2'>
                                    <Col className='col-2'>كود الطالب</Col>
                                    <Col className='col-3'>إسم الطالب</Col>
                                    <Col className='col-2'>الرقم القومي</Col>
                                    <Col className='col-2'>رقم الهاتف</Col>
                                    <Col className='col-2'>المجموعة</Col>

                                </Row>
                                {
                                    students.map((s,i)=>

                                    <Row className="py-3 px-2 border-2 border-bottom">
                                        <Col className='col-2'>{s.student_id}</Col>
                                        <Col className='col-3'>{s.name}</Col>
                                        <Col className='col-2'>{s.national_id}</Col>
                                        <Col className='col-2'>{s.mobile_no}</Col>
                                        <Col className='col-1'>{s.section_number}</Col>
                                        <Col className='col-2'>
                                            <Button className='main-btn primary' onClick={()=>{handleStudentInfoShow();setStudentInfo(s)}}>
                                                عرض المعلومات
                                            </Button>
                                        </Col>

                                    </Row>
                                    )
                                }
                            </div>
                        </div>
                    </> :
                    !filters.fac ?
                    <>
                        <h3 className='mb-2'>اختيار الكلية</h3>
                        <Row className='w-100'>
                        {
                            faculties.map((fac,i)=>
                            <Col className='col-12 col-md-6 p-1'>
                                <Button variant='transparent'
                                className='w-100 p-3 border border-2 border-black rounded-3 shadow'
                                onClick={()=>handleFilters("fac",fac.faculty_id)}
                                >
                                    <h4>{fac.faculty_name}</h4>
                                </Button>
                            </Col>
                        )
                        }
                        </Row>
                    </>
                    : !filters.dep ?
                    <>
                        <h3 className='mb-2'>اختيار القسم</h3>
                        <Row className='w-100'>
                        {
                            filteredDepartments.map((dep,i)=>
                            <Col className='col-12 col-md-6 p-1'>
                                <Button variant='transparent'
                                className='w-100 p-3 border border-2 border-black rounded-3 shadow'
                                onClick={()=>handleFilters("dep",dep.department_id)}
                                >
                                    <h4>{dep.department_name}</h4>
                                </Button>
                            </Col>
                        )
                        }
                        </Row>
                    </>
                    : filters.level===null &&
                    <>
                        <h3 className='mb-2'>اختيار الفرقة</h3>
                        <Row className='w-100'>
                        {
                            Array.from({length:faculties.find((f) => f.faculty_id === filters.fac).nooflevels || 0}).map((x,i)=>
                            <Col className='col-12 col-md-6 p-1'>
                                <Button variant='transparent'
                                className='w-100 p-3 border border-2 border-black rounded-3 shadow'
                                onClick={()=>handleFilters("level",i+1)}
                                >
                                    <h4>الفرقة {i+1}</h4>
                                </Button>
                            </Col>
                        )
                        }
                        </Row>
                    </>
                    
                }
                    
                </div>

            </Container>

            <Modal show={filterModal} onHide={handleFilterClose} centered className='info-modal'>
                <Modal.Header closeButton>
                <Modal.Title>بحث عن طالب</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                    <Form onSubmit={handleSubmitStudentFilters(onStudentFilterSubmit)} className="d-flex flex-column gap-3">
                        <div>
                            <div className='labeled-input'>
                                <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentFilters("name")} />
                                <span>اسم الطالب</span>
                            </div>
                        </div>
                        <div>
                            <div className='labeled-input'>
                                <input className='p-2 rounded-1 w-100' placeholder='' type="number" {...registerStudentFilters("national_id")} />
                                <span>الرقم القومي</span>
                            </div>
                        </div>
                        <div>
                            <div className='labeled-input'>
                                <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentFilters("email")} />
                                <span>البريد الالكتروني</span>
                            </div>
                        </div>

                        <div>
                            <div className='labeled-input'>
                                <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentFilters("mobile_no")} />
                                <span>رقم الهاتف</span>
                            </div>
                        </div>
                        
                        <Button type='submit' className='main-btn primary'>بحث عن طالب</Button>
                    </Form>
                </Modal.Body>

            </Modal>

            <Modal show={studentModal} onHide={handleStudentInfoClose} className='info-modal'>
                <Modal.Header closeButton>
                <Modal.Title>بيانات الطالب</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {
                    studentInfo && studentInfoCourses && studentInfoParent &&
                    <div className='w-100 d-flex flex-column gap-4'>
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
                                        <span className='fs-5'>{studentInfo.student_id}</span>
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
                                <BsPersonVcard size={45}/>
                                <h3 className=''>معلومات ولي الأمر</h3>
                            </div>
                            <div className='w-100 d-flex flex-column border border-1 border-dark shadow rounded-bottom p-3'>
                                    

                                <Row className='w-100 g-3'>
                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>إسم ولي الأمر:</span>
                                        <span className='fs-5'>{studentInfoParent.name}</span>
                                    </Col>

                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>تاريخ الميلاد:</span>
                                        <span className='fs-5'>{new Date(studentInfoParent.date_of_birth).toLocaleDateString()}</span>
                                    </Col>

                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>الرقم القومي:</span>
                                        <span className='fs-5'>{studentInfoParent.national_id}</span>
                                    </Col>

                                </Row>
                                <hr />
                                <Row className='w-100 g-3'>
                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>البريد الالكتروني:</span>
                                        <span className='fs-5'>{studentInfoParent.email}</span>
                                    </Col>

                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>رقم الهاتف:</span>
                                        <span className='fs-5'>{studentInfoParent.mobile_no}</span>
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
                                <Accordion defaultActiveKey={["0"]}>
                                {
                                    Array.from({length:studentInfo.level}).map((x,level)=>
                                    <Accordion.Item className='mb-3 border border-1 border-dark rounded-3 shadow' eventKey={`${level}`}>
                                        <Accordion.Header>
                                            <h4 className='w-100 text-center'>الفرقة {level+1}</h4>
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <div className='w-100 d-flex flex-column gap-4'>
                                                <div className='w-100'>
                                                    <h4>الفصل الدراسي الأول</h4>
                                                    <hr />
                                                    <div className='table-column mt-4 mb-5 border border-2 rounded-3 overflow-hidden'>
                                                        <div className="table-column-scroll-wrapper">
                                                            <Row className='bg-dark text-white p-2'>
                                                                <Col className='col-2'>كود المادة</Col>
                                                                <Col className='col-2'>إسم المادة</Col>
                                                                <Col className='col-2'>عدد ساعاتها</Col>

                                                                <Col className='col-2'>تقييم أعمال السنة</Col>
                                                                <Col className='col-2'>تقييم اختبار منتصف الفصل</Col>
                                                                <Col className='col-2'>تقييم الاختبار النهائي</Col>

                                                            </Row>
                                                            {
                                                                studentInfoCourses.filter((c)=>c.level === level+1 && c.semester === 1).map((c,i)=>

                                                                <Row className="py-3 px-2 border-2 border-bottom">
                                                                    <Col className='col-2'>{c.course_id}</Col>
                                                                    <Col className='col-2'>{c.course_name}</Col>
                                                                    <Col className='col-2'>{c.credit_hours} ساعات</Col>

                                                                    <Col className='col-2 fs-5'>{c.classwork_grade} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                    <Col className='col-2 fs-5'>{c.midterm_grade} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                    <Col className='col-2 fs-5'>{c.finals_grade} <span className='fs-6 text-black-50'>/60</span></Col>

                                                                </Row>
                                                                )
                                                            }
                                                        </div>
                                                        <Row className='bg-dark text-white text-white-50 fs-5 p-3'>
                                                            <Col>
                                                                المعدل التراكمي للفصل الدراسي: <span className='text-white'>
                                                                {
                                                                    getGPA(studentInfoCourses.filter((c)=>c.level === level+1 && c.semester === 1))
                                                                }
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                                <div className='w-100'>
                                                    <h4>الفصل الدراسي الثاني</h4>
                                                    <hr />
                                                    <div className='table-column mt-4 mb-5 border border-2 rounded-3 overflow-hidden'>
                                                        <div className="table-column-scroll-wrapper">
                                                            <Row className='bg-dark text-white p-2'>
                                                                <Col className='col-2'>كود المادة</Col>
                                                                <Col className='col-2'>إسم المادة</Col>
                                                                <Col className='col-2'>عدد ساعاتها</Col>

                                                                <Col className='col-2'>تقييم أعمال السنة</Col>
                                                                <Col className='col-2'>تقييم اختبار منتصف الفصل</Col>
                                                                <Col className='col-2'>تقييم الاختبار النهائي</Col>

                                                            </Row>
                                                            {
                                                                studentInfoCourses.filter((c)=>c.level === level+1 && c.semester === 2).map((c,i)=>

                                                                <Row className="py-3 px-2 border-2 border-bottom">
                                                                    <Col className='col-2'>{c.course_id}</Col>
                                                                    <Col className='col-2'>{c.course_name}</Col>
                                                                    <Col className='col-2'>{c.credit_hours} ساعات</Col>

                                                                    <Col className='col-2 fs-5'>{c.classwork_grade} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                    <Col className='col-2 fs-5'>{c.midterm_grade} <span className='fs-6 text-black-50'>/20</span></Col>
                                                                    <Col className='col-2 fs-5'>{c.finals_grade} <span className='fs-6 text-black-50'>/60</span></Col>

                                                                </Row>
                                                                )

                                                            }
                                                        </div>
                                                        <Row className='bg-dark text-white text-white-50 fs-5 p-3'>
                                                            <Col>
                                                                المعدل التراكمي للفصل الدراسي: <span className='text-white'>
                                                                {
                                                                    getGPA(studentInfoCourses.filter((c)=>c.level === level+1 && c.semester === 2))
                                                                }
                                                                </span>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                </div>
                                                <div className='bg-accent p-2 fs-4 text-center text-white-50 rounded-3 shadow'>
                                                    المعدل التراكمي للعام الدراسي: <span className='text-white fw-semibold'>
                                                    {
                                                        getGPA(studentInfoCourses.filter((c)=>c.level === level+1))
                                                    }
                                                    </span>
                                                </div>
                                            </div>
                                            
                                        </Accordion.Body>
                                    </Accordion.Item>
                                    )
                                }
                                </Accordion>

                            </div>
                        </div>
                    </div>
                }
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default AdminStudents;