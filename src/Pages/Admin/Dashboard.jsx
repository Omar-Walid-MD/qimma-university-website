import React, { useEffect } from 'react';
import { Button, Carousel, Col, Container, Row, Accordion } from 'react-bootstrap';
import { PiStudentFill } from "react-icons/pi";
import { RiBuilding2Fill } from "react-icons/ri";
import { ImBooks } from "react-icons/im";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FaWpforms } from "react-icons/fa";

import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Dashboard({}) {

    const navigate = useNavigate();

    const loggedIn = useSelector(store => store.auth.loggedIn);
    const loading = useSelector(store => store.auth.loading);


    useEffect(()=>{
        if (!loggedIn && !loading) navigate("/");
    },[loggedIn,loading]);

    return (
        <div className='page-container'>
            <Container className="p-5 d-flex flex-column align-items-center gap-5">
                <h2 className='border-bottom border-black border-2 pb-2'>لوحة البيانات</h2>
                <Row className='w-100 g-4'>
                    <Col className='col-12 col-md-6'>
                        <Link to={"students"} className='d-flex hover-scale link flex-column align-items-center border border-2 shadow rounded-3 p-4'>
                            <PiStudentFill size={70} />
                            <h3>الطلاب</h3>
                        </Link>
                    </Col>

                    <Col className='col-12 col-md-6'>
                        <Link to={"professors"} className='d-flex hover-scale link flex-column align-items-center border border-2 shadow rounded-3 p-4'>
                            <FaChalkboardTeacher size={70} />
                            <h3>الأساتذة</h3>
                        </Link>
                    </Col>

                    <Col className='col-12 col-md-6'>
                        <Link to={"professors"} className='d-flex hover-scale link flex-column align-items-center border border-2 shadow rounded-3 p-4'>
                            <FaWpforms size={70} />
                            <h3>طلبات الالتحاق</h3>
                        </Link>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Dashboard;