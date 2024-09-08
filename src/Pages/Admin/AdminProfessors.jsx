import React, { useEffect, useState } from 'react';
import { Button, Carousel, Col, Container, Row, Accordion, Modal, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useSelector } from 'react-redux';
import { IoMdArrowDroprightCircle } from 'react-icons/io';
import { FaFilter, FaFilterCircleXmark } from 'react-icons/fa6';
import { BsPersonVcard } from 'react-icons/bs';
import { getProfessorCourses, getProfessors, getProfessorsFiltered } from '../../Utils/queryFunctions';

const filterSchema = yup.object({

    name: yup.string(),
    email: yup.string(),
    national_id: yup.string(),
    Mobile_No: yup.string(),
    department_id: yup.string()
});

function AdminProfessors({}) {

   
    const [professors,setProfessors] = useState([]);
    const [professorInfo,setProfessorInfo] = useState();
    const [professorCourses,setProfessorCourses] = useState([]);

    const departments = useSelector(store => store.data.departments);

    const [searchFilters,setSearchFilters] = useState({
        name:"",
        national_id: "",
        Mobile_No: "",
        email: "",
        department_id: ""
    });

    const [filterModal,setFilterModal] = useState(false);
    const handleFilterClose = () => setFilterModal(false);
    const handleFilterShow = () => setFilterModal(true);

    const [profInfoModal,setProfInfoModal] = useState(false);
    const handleProfInfoClose = () => setProfInfoModal(false);
    const handleProfInfoShow = () => setProfInfoModal(true);


    const [profCoursesModal,setProfCoursesModal] = useState(false);
    const handleProfCoursesClose = () => setProfCoursesModal(false);
    const handleProfCoursesShow = () => setProfCoursesModal(true);

    const { register: registerProfFilters, handleSubmit: handleSubmitProfFilters, reset: resetProfFilters, formState: { errors: errorsProfFilters } } = useForm({ resolver: yupResolver(filterSchema) });

    async function onProfFilterSubmit(data)
    {
        setSearchFilters(data);
        if(Object.keys(data).some((key) => searchFilters[key]))
        {
            setProfessors(getProfessorsFiltered(data));

        }
        else
        {
            getProfessors();
        }
        handleFilterClose();

    }


    
    useEffect(()=>{
        setProfessors(getProfessors());
    },[]);

    useEffect(()=>{
        if(professorInfo)
        {
            setProfessorCourses(getProfessorCourses(professorInfo.prof_id))
        }
        else setProfessorCourses([]);

    },[professorInfo]);


    const navigate = useNavigate();

    const loggedIn = useSelector(store => store.auth.loggedIn);
    const loading = useSelector(store => store.auth.loading);


    useEffect(()=>{
        if (!loggedIn && !loading) navigate("/");
    },[loggedIn,loading]);

    return (
        <div className='page-container'>
            <Container className="p-3 p-md-5 d-flex flex-column align-items-center gap-4">
                <h2 className='border-bottom border-black border-2 pb-2'>بيانات الأساتذة</h2>
                <div className="w-100 d-flex justify-content-center justify-content-md-start">
                    <Button as={Link} to="/dashboard" className='main-btn primary d-flex align-items-center gap-2'>
                    <IoMdArrowDroprightCircle size={20} />
                    إلى لوحة البيانات
                    </Button>
                </div>
                {/* <Button className='w-100 main-btn primary fs-4' onClick={handleFilterShow}>فلاتر البحث</Button> */}
                <div className='w-100 d-flex flex-column align-items-center border border-2 shadow rounded-3 p-4 gap-3'>
                    {/* <div className='w-100'>
                        <Button variant='transparent' onClick={()=>{
                            getProfessors();
                        }}>محو الفلاتر</Button>
                    </div> */}
                    <div className='w-100 d-flex justify-content-end'>
                    {
                        !Object.keys(searchFilters).some((key) => searchFilters[key]) ?
                        <Button className='main-btn d-flex align-items-center gap-2' onClick={handleFilterShow}>
                            <FaFilter  size={20}/>
                            فلاتر البحث
                        </Button>
                        :
                        <Button className='main-btn danger d-flex align-items-center gap-2' 
                        onClick={()=>{
                            getProfessors();
                            setSearchFilters({
                                name:"",
                                national_id: "",
                                Mobile_No: "",
                                email: "",
                                department_id: ""
                            });
                        }}>
                            <FaFilterCircleXmark size={20} />
                            محو الفلاتر
                        </Button>
                    }
                    </div>
                    <div className='table-column w-100 d-flex flex-column gap-3'>
                        <div className="table-column-scroll-wrapper">
                            <Row className='bg-dark text-white p-2'>
                                <Col className='col-2'>كود الأستاذ</Col>
                                <Col className='col-2'>إسم الأستاذ</Col>
                                <Col className='col-2'>الرقم القومي</Col>
                                <Col className='col-2'>القسم</Col>
                                <Col className='col-4'>الخيارات</Col>

                            </Row>
                            {
                                professors.map((prof,i)=>
                                
                                    <Row className={`py-3 px-2 border-2 ${i<professors.length-1 ? "border-bottom" : ""}`}>
                                        <Col className='col-2'>{prof.prof_id}</Col>
                                        <Col className='col-2'>{prof.name}</Col>
                                        <Col className='col-2'>{prof.national_id}</Col>
                                        <Col className='col-2'>{prof.department_id}</Col>
                                        <Col className='col-2'>
                                            <Button className='main-btn primary mt-3'
                                            onClick={()=>{
                                                setProfessorInfo(prof);
                                                handleProfInfoShow();
                                            }}
                                            >
                                                عرض المعلومات
                                            </Button>
                                        </Col>
                                        <Col className='col-2'>
                                            <Button className='main-btn mt-3'
                                            onClick={()=>{
                                                setProfessorInfo(prof);
                                                handleProfCoursesShow();
                                            }}
                                            >
                                                عرض المقررات
                                            </Button>
                                        </Col>
                                    </Row>
                                )
                            }
                        </div>
                    </div>
                </div>
            </Container>

            <Modal show={filterModal} onHide={handleFilterClose} centered className='info-modal'>
                <Modal.Header closeButton>
                <Modal.Title>بحث عن أستاذ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitProfFilters(onProfFilterSubmit)} className="d-flex flex-column gap-3">
                        <div>
                            <div className='labeled-input'>
                                <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerProfFilters("name")} />
                                <span>اسم الأستاذ</span>
                            </div>
                        </div>
                        <div>
                            <div className='labeled-input'>
                                <input className='p-2 rounded-1 w-100' placeholder='' type="number" {...registerProfFilters("national_id")} />
                                <span>الرقم القومي</span>
                            </div>
                        </div>
                        <div>
                            <div className='labeled-input'>
                                <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerProfFilters("email")} />
                                <span>البريد الالكتروني</span>
                            </div>
                        </div>

                        <div>
                            <div className='labeled-input'>
                                <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerProfFilters("Mobile_No")} />
                                <span>رقم الهاتف</span>
                            </div>
                        </div>

                        <div>
                        <Form.Select aria-label="Default select example" {...registerProfFilters("department_id")}>
                            <option value={""}>اختر قسما</option>
                            {
                                departments.map((dep) => 
                                    <option value={dep.department_id}>{dep.Department_Name}</option>
                                
                                )
                            }
                        </Form.Select>
                        </div>
                        
                        <Button type='submit' className='main-btn primary'>بحث عن طالب</Button>
                    </Form>
                </Modal.Body>

            </Modal>

            <Modal show={profInfoModal} onHide={handleProfInfoClose} centered className='info-modal'>
                <Modal.Header closeButton>
                <Modal.Title>بيانات المعلم</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                {
                    professorInfo &&
                    <div className='w-100 d-flex flex-column gap-4'>
                        <div className='d-flex flex-column'>
                            <div className='d-flex align-items-center gap-3 bg-accent text-white p-2 px-3 rounded-top'>
                                <BsPersonVcard size={45}/>
                                <h3 className=''>معلومات المعلم</h3>
                            </div>
                            <div className='w-100 d-flex flex-column border border-1 border-dark shadow rounded-bottom p-3'>                                    
                                <Row className='w-100 g-3'>
                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>إسم المعلم:</span>
                                        <span className='fs-5'>{professorInfo.name}</span>
                                    </Col>

                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>كود المعلم:</span>
                                        <span className='fs-5'>{professorInfo.prof_id}</span>
                                    </Col>


                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>تاريخ الميلاد:</span>
                                        <span className='fs-5'>{new Date(professorInfo.date_of_birth).toLocaleDateString()}</span>
                                    </Col>

                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>الرقم القومي:</span>
                                        <span className='fs-5'>{professorInfo.national_id}</span>
                                    </Col>

                                </Row>
                                <hr />
                                <Row className='w-100 g-3'>
                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>الإيميل الجامعي:</span>
                                        <span className='fs-5'>{professorInfo.email}</span>
                                    </Col>

                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'> العنوان:</span>
                                        <span className='fs-5'>{professorInfo.address}</span>
                                    </Col>

                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>رقم الهاتف:</span>
                                        <span className='fs-5'>{professorInfo.Mobile_No}</span>
                                    </Col>

                                    <Col className="col-12 col-md-6 d-flex flex-column">
                                        <span className='fs-6 text-black-50'>القسم العلمي:</span>
                                        <span className='fs-5'>{professorInfo.department_id}</span>
                                    </Col>


                                </Row>

                            </div>
                        </div>
                    </div>
                }
                </Modal.Body>
            </Modal>

            <Modal show={profCoursesModal} onHide={handleProfCoursesClose} centered className='info-modal'>
                <Modal.Header closeButton>
                <Modal.Title>مقررات الأستاذ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-column gap-5">
                    {
                        Array.from({length:4}).map((x,index)=>
                        <div>
                            <h3 className='border-bottom border-2 border-black mb-2 pb-2'>عام {2023-index}</h3>
                            <div className='d-flex flex-column flex-lg-row gap-5'>
                            {
                                Array.from({length:2}).map((x,semester)=>
                                <div className='w-100 table-column d-flex flex-column gap-3'>
                                    <h4 className='mb-3'>الفصل الدراسي {semester+1}</h4>
                                    <div className="table-column-scroll-wrapper">
                                        <Row className='bg-dark text-white p-2'>
                                            <Col>كود المقرر</Col>
                                            <Col className='col-3'>اسم المقرر</Col>
                                            <Col>كود القسم</Col>
                                            <Col>المستوى</Col>
                                            <Col>المجموعة</Col>
                                        </Row>
                                        {
                                            professorCourses.filter((c) => c.Year === 2023-index && c.Semester === semester+1 ) .map((course)=>
                                            <Row className="border-bottom border-2 border-gray">
                                                <Col>{course.course_id}</Col>
                                                <Col className='col-5'>{course.course_name}</Col>
                                                <Col>{course.department_id}</Col>
                                                <Col>{course.level}</Col>
                                                <Col>{course.section_number}</Col>
                                            </Row>
                                            )
                                        }
                                    </div>
                               </div>
                                
                                
                                )
                            }
                            
                            </div>
                        </div>
                        )
                    }
                    </div>
                </Modal.Body>
            </Modal>


            
        </div>
    );
}

export default AdminProfessors;