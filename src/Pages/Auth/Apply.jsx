import React, { useEffect, useState } from 'react';
import { Button, Carousel, FloatingLabel, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { makeUniqueId, performQuery } from '../../helpers';
import axios from 'axios';

const schemas = [
  yup.object({

    Name: yup.string().required("رجاءا أدخل إسم الطالب"),
    Date_Of_Birth: yup.date().typeError("رجاءا أدخل تاريخ صحيح").required("رجاءا أدخل تاريخ ميلاد الطالب").max(new Date("2006-1-1"),"تاريخ الميلاد يجب أن يكون قبل 2006"),
    National_ID: yup.string().required("رجاءا أدخل الرقم القومي للطالب").min(14,"الرقم القومي غير صالح").max(14,"الرقم القومي غير صالح"),
    Mobile_No: yup.string().required("رجاءا أدخل رقم هاتف للطالب"),
    Extra_Mobile_No: yup.string(),
    Address: yup.string().required("رجاءا أدخل عنوان الطالب"),
    Gender: yup.string().required("رجاءا أدخل النوع"),
    Email: yup.string().email("البريد الإلكتروني غير صالح").required("رجاءا أدخل البريد الإلكتروني للطالب"),
    Password: yup.string().required("رجاءا أدخل كلمة السر"),
    ConfirmPassword: yup.string().required("رجاءا أدخل تأكيد كلمة السر"),
  
}).required(),
  yup.object({


    Name: yup.string().required("رجاءا أدخل إسم ولي الأمر"),
    Date_Of_Birth: yup.date("").typeError("رجاءا أدخل تاريخ صحيح").required("رجاءا أدخل تاريخ ميلاد ولي الأمر"),
    National_ID: yup.string().required("رجاءا أدخل الرقم القومي لولي الأمر").min(14,"الرقم القومي غير صالح").max(14,"الرقم القومي غير صالح"),
    Mobile_No: yup.string().required("رجاءا أدخل رقم هاتف لولي الأمر"),
    Address: yup.string().required("رجاءا أدخل عنوان ولي الأمر"),
    Gender: yup.string().required("رجاءا أدخل النوع"),
    Email: yup.string().email("البريد الإلكتروني غير صالح").required("رجاءا أدخل البريد الإلكتروني لولي الأمر"),

    
  }).required(),
  yup.object({

    Faculty_ID: yup.string().required("رجاءا اختر الكلية"),
    Department_ID: yup.string().required("رجاءا اختر القسم العلمي"),
    Level: yup.number().required("رجاءا اختر المستوى")

  }).required(),
  

]

function Apply({}) {

    const navigate = useNavigate();
    
    const [formIndex,setFormIndex] = useState(1);

    const [faculties,setFaculties] = useState([]);
    const [departments,setDepartments] = useState([]);

    const [facultySelect,setFacultySelect] = useState("");

    const [applyInfo,setApplyInfo] = useState([
        {},{},{}
    ]);

    const { register: registerStudentInfo, handleSubmit: handleSubmitStudentInfo, reset: resetStudentInfo, formState: { errors: errorsStudentInfo } } = useForm({ resolver: yupResolver(schemas[0]) });
    const { register: registerParentInfo, handleSubmit: handleSubmitParentInfo, reset: resetParentInfo, formState: { errors: errorsParentInfo } } = useForm({ resolver: yupResolver(schemas[1]) });
    const { register: registerApplicationInfo, handleSubmit: handleSubmitApplicationInfo, reset: resetApplicationInfo, formState: { errors: errorsApplicationInfo }, setValue: setApplicationInfo } = useForm({ resolver: yupResolver(schemas[2]) });

    const [passwordErrorMessage,setPasswordErrorMessage] = useState("");

    function getFacultyLevels()
    {
        const fac = faculties.find((f) => f.Faculty_ID === facultySelect);
        return fac ? fac.NoOfLevels : 0;
    }

    function prevFormIndex()
    {
        if(formIndex > 0) setFormIndex(x => x-1)
    }

    async function onSubmit(data)
    {
        let updatedApplyInfo = applyInfo.map((info,index) => index===formIndex ? ({...info,...data}) : info);
        setApplyInfo(updatedApplyInfo);

        // if(updatedApplyInfo[0].Date_Of_Birth) updatedApplyInfo[0].Date_Of_Birth = updatedApplyInfo[0].Date_Of_Birth.split("T")[0]; 
        // if(updatedApplyInfo[1].Date_Of_Birth) updatedApplyInfo[1].Date_Of_Birth = updatedApplyInfo[1].Date_Of_Birth.split("T")[0];
        
        console.log(updatedApplyInfo);

        if(formIndex === 0)
        {
            if(updatedApplyInfo.Password !== updatedApplyInfo.ConfirmPassword)
            {
                setPasswordErrorMessage("كلمة المرور غير متوافقة.");
            }
            else
            {
                setPasswordErrorMessage("");
                setFormIndex(i => i+1);
            }
        }
        else if(formIndex === 1)
        {
            setFormIndex(i => i+1);
        }
        else if(formIndex === 2)
        {

            const parent_ID_List = (await performQuery("parents")).map((p)=>p.Parent_ID.slice(1));
            const new_parent_ID = "P"+makeUniqueId(parent_ID_List,8)
            await axios.post(`http://${process.env.REACT_APP_SQL_HOST}/parents`,
            {...updatedApplyInfo[1],Parent_ID:new_parent_ID}
            );
    
            const student_ID_List = (await performQuery("students")).map((s)=>s.Student_ID.slice(1));
            const new_student_ID = "S"+makeUniqueId(student_ID_List,8)
            await axios.post(`http://${process.env.REACT_APP_SQL_HOST}/students`,
            {...updatedApplyInfo[0],Student_ID:new_student_ID,Parent_ID:new_parent_ID,...updatedApplyInfo[2]}
            );

            await axios.post(`http://${process.env.REACT_APP_SQL_HOST}/login`,
                [updatedApplyInfo[0].Email,updatedApplyInfo[0].Password]
            );

            navigate("/");
        }


    }

    useEffect(()=>{
        async function getFaculties(){setFaculties(await performQuery("faculties"));}
        getFaculties();
    },[]);

    useEffect(()=>{
        async function getDepartments(){setDepartments(await performQuery("departments",`WHERE Faculty_ID = "${facultySelect}"`));}
        getDepartments();
    },[facultySelect]);


    return (
        <div className='page-container position-relative d-flex flex-column align-items-center justify-content-center h-100 py-3'>
            <div className='login-page-bg position-absolute'></div>
            <div className='form-container bg-white mb-3 border border-1 border-black rounded-2 shadow d-flex flex-column overflow-hidden'>
                
                <div className='bg-accent text-white text-center px-3 py-1 d-flex flex-column-reverse flex-md-row justify-content-between align-items-center'>
                    <h2 className='mb-4 mb-md-0'>طلب التحاق الطالب</h2>
                    <img src={require("../../assets/img/light-logo.png")} style={{height:"min(100px,20vw)"}} alt="" />
                </div>
                
                <div className='apply-progress-container m-4 rounded-pill overflow-hidden border border-1 border-black' style={{height:15}}>
                    <div className='apply-progress h-100' style={{width:`${(formIndex+1)*100/3}%`}}></div>
                </div>
                
                <Carousel activeIndex={formIndex} interval={null} indicators={false} controls={false} className='p-4 pb-0 w-100 h-100'>
                    <Carousel.Item className='bg-white'>
                        <div className="d-flex"><h4 className='border-bottom border-2 border-black pb-2 mb-4'>معلومات الطالب</h4></div>
                        <Form id='application-form-1' onSubmit={handleSubmitStudentInfo(onSubmit)} className="d-flex flex-column w-100 gap-3 p-2">
                            <div>
                                <div className='labeled-input'>
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentInfo("Name")} />
                                    <span>الإسم كاملا</span>
                                </div>
                                {errorsStudentInfo.Name ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.Name.message}</div> : ''}
                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>
                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="date" {...registerStudentInfo("Date_Of_Birth")} />
                                        <span>تاريخ الميلاد</span>
                                    </div>
                                    {errorsStudentInfo.Date_Of_Birth ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.Date_Of_Birth.message}</div> : ''}
                                </div>
                                <div className='w-100'>
                                    <div className='d-flex gap-3 align-items-center'>
                                        <p className='mb-2 text-black-50'>النوع:</p>
                                        <Form.Check
                                            type="radio"
                                            label="ذكر"
                                            name="gender-radio"
                                            value="m"
                                            {...registerStudentInfo("Gender")}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="أنثى"
                                            name="gender-radio"
                                            value="f"
                                            {...registerStudentInfo("Gender")}

                                        />
                                    </div>
                                    {errorsStudentInfo.Gender ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.Gender.message}</div> : ''}

                                </div>
                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="number" {...registerStudentInfo("National_ID")} />
                                        <span>الرقم القومي</span>
                                    </div>
                                    {errorsStudentInfo.National_ID ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.National_ID.message}</div> : ''}
                                </div>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentInfo("Address")} />
                                        <span>العنوان</span>
                                    </div>
                                    {errorsStudentInfo.Address ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.Address.message}</div> : ''}
                                </div>

                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentInfo("Mobile_No")} />
                                        <span>رقم هاتف الطالب</span>
                                    </div>
                                    {errorsStudentInfo.Mobile_No ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.Mobile_No.message}</div> : ''}
                                </div>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentInfo("Extra_Mobile_No")} />
                                        <span>رقم هاتف إحتياطي للطالب</span>
                                    </div>
                                    {errorsStudentInfo.Extra_Mobile_No ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.Extra_Mobile_No.message}</div> : ''}
                                </div>

                            </div>

                            <hr className='m-0' />

                            <div className='w-100'>
                                <div className='labeled-input'>
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="email" {...registerStudentInfo("Email")} />
                                    <span>البريد الإلكتروني للطالب</span>
                                </div>
                                {errorsStudentInfo.Email ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.Email.message}</div> : ''}
                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>
                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="password" {...registerStudentInfo("Password")} />
                                        <span>كلمة المرور</span>
                                    </div>
                                    {errorsStudentInfo.Password ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.Password.message}</div> : ''}
                                </div>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="password" {...registerStudentInfo("ConfirmPassword")} />
                                        <span>تأكيد كلمة المرور</span>
                                    </div>
                                    {errorsStudentInfo.ConfirmPassword ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.ConfirmPassword.message}</div> : ''}
                                    {passwordErrorMessage ? <div className='error-message text-danger mt-2'>{passwordErrorMessage}</div> : ''}
                                </div>

                            </div>

                        </Form>
                    </Carousel.Item>
                    
                    <Carousel.Item className='bg-white'>
                        <div className="d-flex"><h4 className='border-bottom border-2 border-black pb-2 mb-4'>معلومات ولي الأمر</h4></div>
                        <Form id='application-form-2' onSubmit={handleSubmitParentInfo(onSubmit)} className="d-flex flex-column w-100 gap-3 p-2">
                            <div className='w-100'>
                                <div className='labeled-input'>
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerParentInfo("Name")} />
                                    <span>إسم ولي الأمر كاملا</span>
                                </div>
                                {errorsParentInfo.Name ? <div className='error-message text-danger mt-2'>{errorsParentInfo.Name.message}</div> : ''}
                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="date" {...registerParentInfo("Date_Of_Birth")} />
                                        <span>تاريخ الميلاد</span>
                                    </div>
                                    {errorsParentInfo.Date_Of_Birth ? <div className='error-message text-danger mt-2'>{errorsParentInfo.Date_Of_Birth.message}</div> : ''}
                                </div>

                                <div className='w-100'>
                                    <div className='d-flex gap-3 align-items-center'>
                                        <p className='mb-2 text-black-50'>النوع:</p>
                                        <Form.Check
                                            type="radio"
                                            label="ذكر"
                                            name="gender-radio"
                                            value="m"
                                            {...registerParentInfo("Gender")}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="أنثى"
                                            name="gender-radio"
                                            value="f"
                                            {...registerParentInfo("Gender")}
                                        />
                                    </div>
                                    {errorsParentInfo.Gender ? <div className='error-message text-danger mt-2'>{errorsParentInfo.Gender.message}</div> : ''}
                                </div>
                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>


                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="number" {...registerParentInfo("National_ID")} />
                                        <span>الرقم القومي لولي الأمر</span>
                                    </div>
                                    {errorsParentInfo.National_ID ? <div className='error-message text-danger mt-2'>{errorsParentInfo.National_ID.message}</div> : ''}
                                </div>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerParentInfo("Address")} />
                                        <span>عنوان ولي الأمر</span>
                                    </div>
                                    {errorsParentInfo.Address ? <div className='error-message text-danger mt-2'>{errorsParentInfo.Address.message}</div> : ''}
                                </div>

                            </div>

                            <div className='w-100'>
                                <div className='labeled-input'>
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerParentInfo("Mobile_No")} />
                                    <span>رقم هاتف ولي الأمر</span>
                                </div>
                                {errorsParentInfo.Mobile_No ? <div className='error-message text-danger mt-2'>{errorsParentInfo.Mobile_No.message}</div> : ''}
                            </div>
                        
                            <div className='w-100'>
                                <div className='labeled-input'>
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerParentInfo("Email")} />
                                    <span>البريد الإلكتروني لولي الأمر</span>
                                </div>
                                {errorsParentInfo.Email ? <div className='error-message text-danger mt-2'>{errorsParentInfo.Email.message}</div> : ''}
                            </div>

                        </Form>
                    </Carousel.Item>

                    <Carousel.Item className='bg-white'>
                        <div className="d-flex"><h4 className='border-bottom border-2 border-black pb-2 mb-4'>معلومات المجال الدراسي</h4></div>
                        <Form id='application-form-3' onSubmit={handleSubmitApplicationInfo(onSubmit)} className="d-flex flex-column w-100 gap-3 p-2">                            
                            <Form.Select name="Faculty_ID" {...registerApplicationInfo("Faculty_ID")} onChange={(e)=>{
                                setFacultySelect(e.target.value)
                                setApplicationInfo("Department_ID","");
                                }}>
                                <option value="">اختر الكلية</option>
                                {
                                    faculties.map((fac)=>
                                    <option value={fac.Faculty_ID}>{fac.Faculty_Name}</option>
                                    )
                                }
                            </Form.Select>    

                            <Form.Select name="Department_ID" {...registerApplicationInfo("Department_ID")} >
                                <option value="">اختر القسم</option>
                                {
                                    departments.map((dep)=>
                                    <option value={dep.Department_ID}>{dep.Department_Name}</option>
                                    )
                                }
                            </Form.Select>

                            <div className='w-100'>
                                <Form.Select {...registerApplicationInfo("Level")} >
                                    <option value="">اختر المستوى الدراسي</option>
                                    {
                                        Array.from({length:getFacultyLevels()}).map((x,i)=>
                                        <option value={i+1}>المستوى {i+1}</option>
                                        )
                                    }
                                </Form.Select>
                                {errorsApplicationInfo.Level ? <div className='error-message text-danger mt-2'>{errorsApplicationInfo.Level.message}</div> : ''}
                            </div>

                            {/* <div className='w-100'>
                                <div className='labeled-input'>
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="number" {...registerApplicationInfo("Level")} />
                                    <span>المستوى الدراسي</span>
                                </div>
                            </div>                 */}

                        </Form>
                    </Carousel.Item>

                </Carousel>
                
                <div className='w-100 p-4 pt-2 mt-3'>
                    {
                        formIndex>0 &&
                        <Button variant='transparent' className='mb-2 text-primary' onClick={prevFormIndex}>السابق</Button>
                    }
                    <Button className='w-100 fs-5 main-btn primary' type='submit' form={`application-form-${formIndex+1}`}>
                    {
                        formIndex === schemas.length-1 ? "تسليم طلب الإلتحاق" : "التالي"
                    }
                    </Button>
                </div>
            </div>
            <div>
                <Button variant='white' to={"/"} as={Link}>الرجوع الى الرئيسية</Button>
            </div>
        </div>
    );
}

export default Apply;