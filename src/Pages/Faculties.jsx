import React, { useEffect, useState } from 'react';
import {Container,Row,Col,Button,Form} from "react-bootstrap";
import { Link } from 'react-router-dom';
import { performQuery } from '../helpers';

function Faculties({}) {

    const [faculties,setFaculties] = useState([]);
      
    useEffect(()=>{
        async function getFaculties(){setFaculties(await performQuery("faculties"));}
        getFaculties();
    },[]);

    const [facSearch,setFacSearch] = useState("");

    return (
        <div className='page-container'>
            <section>
                <Container className='p-3 p-lg-5'>
                    <h3 className='w-100 text-center mb-5'>الكليات في الجامعة</h3>
                    <Form className='d-flex align-items-center gap-4'>
                        <Form.Control type="text" placeholder="ابحث عن كلية" value={facSearch} onChange={(e)=>setFacSearch(e.target.value)} />
                        <Button className='main-btn primary'>بحث</Button>
                    </Form>
                    <hr/>
                    <Row className='g-3'>
                    {
                        faculties.filter((fac) => fac.Faculty_Name.includes(facSearch)) .map((fac,i)=>

                            <Col className='col-12 col-lg-6'>
                                <Link to={`/faculty/${fac.Faculty_ID}`} className='link'>
                                    <div className='fac-bg d-flex flex-column align-content-center justify-content-center w-100 text-center text-shadow bg-dark text-white p-3 p-lg-5 rounded-3 shadow overflow-hidden'
                                    style={{backgroundImage: `url(${require(`../assets/img/faculties/${fac.Faculty_ID}.jpg`)}`}}
                                    >
                                        <h3 className='py-2 py-lg-4'>{fac.Faculty_Name}</h3>
                                        <hr className='m-2'/>
                                        <p >اعرف المزيد</p>
                                    </div>
                                </Link>
                            </Col>
                        )
                    }
                    </Row>
                </Container>
            </section>
        </div>
    );
}

export default Faculties;