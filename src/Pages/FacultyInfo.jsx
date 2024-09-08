import React, { useEffect, useState } from 'react';
import { Button, Carousel, Col, Container, Row, Accordion } from 'react-bootstrap';
import { FaUsers } from "react-icons/fa";
import { FaChalkboardTeacher } from "react-icons/fa";
import { IoMdArrowDropleftCircle } from 'react-icons/io';
import { Link, useLocation, useParams } from 'react-router-dom';
import { getDepartments, getFaculty } from '../Utils/queryFunctions';
import { useSelector } from 'react-redux';

function FacultyInfo({}) {

    const {facultyID} = useParams();
    const faculty = useSelector(store => store.data.faculties).find((fac) => fac.faculty_id === facultyID);
    const departments = useSelector(store => store.data.departments).filter((dep) => dep.faculty_id === facultyID);
      
    return (
        <div>
            <header className='home-header fac-bg w-100 bg-dark text-white text-shadow p-3 p-lg-5 d-flex align-items-center justify-content-between'
            style={{backgroundImage: `url(${require(`../assets/img/faculties/${facultyID}.jpg`)}`}}
            >
                <Container className='d-flex w-100 h-100 d-flex justify-content-center justify-content-md-start'>
                {
                    faculty &&
                    <div className='text-shadow text-center text-md-start'>
                        <h1 className='mb-4'>{faculty.faculty_name}</h1>
                        <p className='fs-5'>{faculty.subtitle}</p>
                        <hr className='mt-4' />
                        <Link className='link text-white-50 d-block' to={`/faculties`}>الرجوع الى الكليات</Link>
                    </div>
                }
                </Container>
            </header>
            <section className='p-3 p-lg-5'>
                <Container className='d-flex flex-column gap-3 gap-md-5'>
                    {
                        faculty &&
                        <div className='text-center'>
                            <h2 className='mb-4 '>عن الكلية</h2>
                            <p className='fs-5'>{faculty.description}</p>
                        </div>
                    }
                    <hr />
                    <div>
                        <h2 className='text-center mb-4 mb-lg-5'>الأقسام العلمية</h2>
                        <Row className='g-3'>
                        {
                            departments.map((department,i)=>
                            <Col className='col-12 col-md-6'>
                                <Link to={`/department/${department.department_id}`} className='link'>
                                    <div className='faculties fac-bg w-100 text-center bg-dark text-white p-5 rounded-3 shadow overflow-hidden text-shadow'
                                    style={{backgroundImage: `url(${require(`../assets/img/departments/${department.department_id}.jpg`)}`}}
                                    >
                                        <h3 className='py-2 py-lg-4'>{department.department_name}</h3>
                                        <hr className='m-2'/>
                                        <p >اعرف المزيد</p>
                                    </div>
                                </Link>
                            </Col>
                            )
                        }
                        </Row>
                    </div>
                </Container>
            </section>
        </div>
    );
}

export default FacultyInfo;