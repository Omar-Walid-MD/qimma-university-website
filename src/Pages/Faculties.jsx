import React, { useState } from 'react';
import {Container,Row,Col,Button,Form} from "react-bootstrap";
import { Link } from 'react-router-dom';

function Faculties({}) {

    const faculties = [
        {
            name: "الطب",
            img: "medicine"
        },
        {
            name: "الهندسة",
            img: "engineering"
        },
        {
            name: "الأعمال",
            img: "business"
        },
        {
            name: "الاداب",
            img: "humanities"
        },
        {
            name: "العلوم",
            img: "sciences"
        },
        {
            name: "طب الأسنان",
            img: "dentistry"
        }
    ]

    const [facSearch,setFacSearch] = useState("");

    return (
        <div className='page-container'>
            <section className='bg-dark' style={{height:400}}>

            </section>
            <section>
                <Container className='p-5'>
                    <h3 className='w-100 text-center mb-5'>الكليات في الجامعة</h3>
                    <Form className='d-flex align-items-center gap-2 mb-3'>
                        <Form.Control type="text" placeholder="ابحث عن كلية" value={facSearch} onChange={(e)=>setFacSearch(e.target.value)} />
                        <Button>بحث</Button>
                    </Form>
                    <hr />
                    <Row className='g-3'>
                    {
                        faculties.filter((fac) => fac.name.includes(facSearch)) .map((fac,i)=>

                            <Col className='col-12 col-md-6'>
                                <div className='home-fac-bg w-100 text-center bg-dark text-white p-5 rounded-3 shadow overflow-hidden'
                                style={{backgroundImage: `url(${require(`../assets/img/faculties/${fac.img}.jpg`)}`}}
                                >
                                    <h4>كلية {fac.name}</h4>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates non corporis, excepturi saepe magnam voluptas qui quaerat.</p>
                                    <hr />
                                    <Link className='link' to={"/faculty/default"}>اقرا المزيد</Link>
                                </div>
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