import React, { useEffect, useState } from 'react';
import { Button, Carousel, Col, Container, Row } from 'react-bootstrap';
import { FaUsers } from "react-icons/fa";
import { FiEye } from "react-icons/fi";
import { IoMdArrowDropleftCircle } from "react-icons/io";
import { Link } from 'react-router-dom';
import { performQuery } from '../helpers';

function Home({}) {

    const newsSample = [
        {
            title: "نتيجةُ امتحاناتِ نهايةِ الفصل الدراسي",
            desc: "جامعةُ القمة تُعلنُ عن التفاصيل (جامعة القمة تكشف عن نتائج امتحانات نهاية الفصل الدراسي مع تحليل مفصل للإحصائيات والأداء)"
        },
        {
            title: "انطلاقُ فعاليات أسبوعُ الريادةِ والإبداعِ في جامعة القمة",
            desc: "استعدوا لأسبوع مليء بالمحادثات الملهمة وورش العمل وفرص التواصل! تنطلق جامعة القمة في فعاليات أسبوع الريادة والابتكار الذي يوفر للطلاب منصة لتطوير أفكارهم والتواصل مع المحترفين في المجال."
        },
        {
            title: "جامعة القمة تُعلنُ عن منح دراسية جديدة للطلاب الدوليين",
            desc: "بشارة للطلاب الدوليين! يسر جامعة القمة الإعلان عن إطلاق منح دراسية جديدة للبكالوريوس والدراسات العليا. لا تفوت هذه الفرصة لتحقيق أهدافك الأكاديمية في مؤسسة تعليمية عالمية المستوى."
        },
        {
            title: "باحثونَ من جامعة القمة يُحققونَ اختراقًا علميًا مهمًا في مجالِ [المجال العلمي]",
            desc: "خبار رائعة من جامعة القمة! حقق فريق من الباحثين اختراقًا علميًا مهمًا في مجال [المجال العلمي]. يمتلك هذا الاكتشاف القدرة على [شرح موجز للتأثير المحتمل للاختراق]."
        },
        {
            title: "بدءُ التسجيلِ في مؤتمر التكنولوجيا الذي تستضيفه جامعة القمة",
            desc: "احجزوا تواريخكم! أصبح التسجيل مفتوحًا الآن لمؤتمر [اسم المؤتمر]، وهو حدث مهم في مجال التكنولوجيا. الذي تستضيفه جامعة القمة، سيجمع المؤتمر كبار الخبراء لإجراء المناقشات والعروض التقديمية. لا تفوت هذه الفرصة للتعلم من الأفضل!"
        }
        
    ]

    const facultiesPlaceholder = [
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

    const certificates = [
        {
            img: "iso_9001_2015.png",
            name: "شهادة ISO-21001",
            desc: "تعكس جودة إدارة التعليم وتعزز التفاعل الفعّال مع الطلاب والمجتمع المدرسي، مما يسهم في تعزيز تجربة التعلم وتحقيق النجاح الأكاديمي."
        },
        {
            img: "iso_14001.png",
            name: "شهادة ISO-14001",
            desc: "تؤكد التزام الجامعة بحماية البيئة وتعزيز الاستدامة من خلال ممارسات الإدارة البيئية المبتكرة والمستدامة."
        },
        {
            img: "iso_21001.jpg",
            name: "ISO-9001:2015",
            desc: "تعكس التزام الجامعة بتحقيق أعلى معايير الجودة في تقديم خدماتها التعليمية وإدارتها بكفاءة لضمان تلبية احتياجات الطلاب والمجتمع."
        },
        {
            img: "iso_45001.png",
            name: "ISO 45001",
            desc: "تؤكد التزام الجامعة بتوفير بيئة عمل آمنة وصحية للموظفين والطلاب، وتعزز ممارسات السلامة المهنية والوقاية من الحوادث والأمراض المهنية."
        }
    ]

    const [faculties,setFaculties] = useState([]);
      
    useEffect(()=>{
        async function getFaculties(){setFaculties(await performQuery("faculties",`LIMIT 6`));}
        getFaculties();
    },[]);


    return (
        <div>
            <header className='home-header home-bg-1 w-100 text-white p-5 d-flex align-items-center justify-content-between'>
                <Container className='d-flex h-100 justify-content-between gap-5'>
                    <img src={require("../assets/img/logo.png")} style={{width:350}} className='h-100 rounded-4 shadow' />
                    <div>
                        <h2 className='mb-5' style={{textShadow:"3px 3px 2px rgba(0,0,0,0.8)"}}>مرحباً بكم في جامعة القمة: مكان لاستكشاف عوالم العلم والتفكير المتجددة</h2>
                        <p className='fs-5' style={{textShadow:"3px 3px 2px rgba(0,0,0,0.8)"}}>تعد جامعة القمة بيتاً للعلم والمعرفة، حيث يتجسد التميز في كل جانب من جوانبها. نقدم لكم بيئة تعليمية متطورة تمكنكم من التفاعل مع أفكار جديدة وتحديات ملهمة.</p>
                        <p className='fs-5' style={{textShadow:"3px 3px 2px rgba(0,0,0,0.8)"}}>هنا، تمتزج الثقافات والتجارب لتصنع مستقبلًا مشرقًا لكل طالب يسعى إلى التميز والنجاح. انضموا إلينا اليوم واستعدوا للانطلاق نحو عالم الاكتشاف والإبداع.</p>
                    </div>
                </Container>
            </header>

            <section className='pt-5'>
                <Container className='d-flex flex-column align-items-start'>
                    <h1 className='mb-5 border-bottom border-4 border-black pb-3'>أخر الأخبار</h1>
                    <Carousel interval={null} variant="dark" className='w-100 h-100 home-news-carousel' controls={false}>
                    {
                        newsSample.map((news,i)=>
                        
                        <Carousel.Item style={{marginBottom:100}} key={`news-${i}`}>
                            <div className='w-100 d-flex align-items-center justify-content-center m-0'>
                                <Row className='g-0'>
                                    <Col className='col-5'>
                                        <div className='image-border p-2 w-100'>
                                            <img src={require(`../assets/img/home-news/${i}.jpg`)} className='w-100 rounded-2 border shadow border-3 border-black' alt="" />
                                        </div>
                                    </Col>
                                    <Col className='px-5 py-2'>
                                        <div className='h-100 rounded-3 border border-2 border-black shadow d-flex flex-column justify-content-between overflow-hidden'>
                                            <div className='p-3 '>
                                                <h2 className='mb-4'>{news.title}</h2>
                                                <hr />
                                                <p className='fs-5 w-100'>{news.desc}</p>
                                            </div>
                                            <div className='bg-accent text-white d-flex justify-content-between align-items-center p-2'>
                                                <h5 className='mb-0'><FiEye className='mb-1' /> 100 مشاهدات</h5>
                                                <Button variant='transparent' as={Link} className='border-0 rounded-0 p-0 link text-start' to={"/faculty/default"}>
                                                    اعرف المزيد
                                                    <IoMdArrowDropleftCircle className='ms-2' size={25} />
                                                </Button>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Carousel.Item>
                        )
                    }
                        
                    </Carousel>
                </Container>
            </section>

            <section className='home-section home-bg-2 text-white d-flex flex-column align-items-center justify-content-center bg-dark' style={{height:650}}>
                <Container className='d-flex align-items-center flex-column text-center gap-5'>
                    <div className='d-flex flex-column align-items-center'>
                        <h1 style={{textShadow:"3px 3px 2px rgba(0,0,0,0.8)"}} className='mb-4 pb-3 border-bottom border-4 border-white'>قدّم الآن للالتحاق</h1>
                        <h4 style={{textShadow:"3px 3px 2px rgba(0,0,0,0.8)"}}>اكتسب مستقبلك الواعد وانضمّ إلى مجتمعنا الأكاديمي المتميّز.</h4>
                    </div>
                    <Button as={Link} to={"/apply"} className='main-btn'>سجل التحاقك الان</Button>
                </Container>
            </section>

            <section className='home-section'>
                <Container className='d-flex flex-column align-items-center p-5 gap-5'>
                    <h1 className='pb-3 border-bottom border-4 border-black'>الكليات</h1>
                    <Row className='g-5'>
                    {
                        faculties.map((fac,i)=>
                        <Col className='col-12 col-lg-6' key={`fac-${i}`} >
                            <div className='w-100 border border-2 border-black rounded-2 d-flex flex-column shadow overflow-hidden'
                            style={{height:250}}
                            >
                                <div className='home-fac-bg w-100 h-100 d-flex align-items-center justify-content-center'
                                // style={{backgroundImage: `url(${require(`../assets/img/faculties/${fac.Faculty_ID}.jpg`)}`}}
                                >
                                    <h3 className='text-white'>{fac.Faculty_Name}</h3>
                                </div>
                                <Button variant='transparent' as={Link} className='border-0 rounded-0 bg-white p-2 link w-100 text-start' to={`/faculty/${fac.Faculty_ID}`}>
                                    اعرف المزيد
                                    <IoMdArrowDropleftCircle className='ms-2' size={25} />
                                </Button>

                            </div>
                        </Col>
                    )
                    }
                    </Row>
                    <Button to={"/faculties"} as={Link} className='main-btn'>الاطلاع على جميع الكليات</Button>
                </Container>
            </section>

            <section className='home-section home-cert-bg d-flex flex-column align-items-center p-5 gap-5'>
                <Container className='d-flex flex-column align-items-center p-5 gap-5'>
                    <h1 className='py-3 border-bottom border-4 border-black'>امتيازات الجودة لدينا</h1>
                    <Row className='w-100 g-5 d-flex justify-content-center'>
                    {
                        certificates.map((cert,i)=>
                        <Col className='col-12 col-md-6 d-flex flex-column gap-3 align-items-center justify-content-center text-center hover-scale' key={`cer-${i}`}>
                            <div className='d-flex align-items-center justify-content-between bg-white rounded-3 shadow p-3 border border-2 border-black overflow-hidden' style={{height:150,aspectRatio:1}}>
                                <img src={require(`../assets/img/home-certificates/${cert.img}`)}
                                className='h-100 w-100'
                                alt="" />
                            </div>
                            <h4 className='border-bottom border-1 border-black pb-2'>{cert.name}</h4>
                            <p className='fs-5'>{cert.desc}</p>
                        </Col>
                        )
                    }
                    </Row>
                </Container>
            </section>

        </div>
    );
}

export default Home;