import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GoTriangleLeft } from "react-icons/go";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaPhone } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

function Footer({})
{
  return (
    <footer className='bg-accent text-white'>
      <Container className='p-3 p-lg-5'>
        <Row className='m-0 g-5 g-md-0'>
          <Col className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-center">
            <h3 className='border-bottom border-1 border-white pb-2 mb-3'>روابط سريعة</h3>
            <div className="d-flex flex-column gap-2">

              <Link className='link hover-scale'><GoTriangleLeft/>الصفحة الرئيسية</Link>
              <Link className='link hover-scale'><GoTriangleLeft/>عن الجامعة</Link>
              <Link className='link hover-scale'><GoTriangleLeft/>الدورات</Link>
              <Link className='link hover-scale'><GoTriangleLeft/>القبول والتسجيل</Link>
              <Link className='link hover-scale'><GoTriangleLeft/>اتصل بنا</Link>
            </div>
          </Col>
          <Col className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-center">
            <h3 className='border-bottom border-1 border-white pb-2 mb-3'>اتصل بنا</h3>
            <div className='d-flex flex-column gap-2'>
              <div><FaMapMarkerAlt /> شارع القمة، الإسكندرية </div>
              <div><FaPhone /> +123456789 </div>
              <div><MdEmail /> qimma-uni@university.edu</div>
            </div>
          </Col>
        </Row>
      </Container>
      <div className="bg-black text-center p-2">
        <p className='m-0'>جميع الحقوق محفوظة &copy; {new Date().getFullYear()} جامعة القمة</p>
      </div>
    </footer>
  );
}

export default Footer;