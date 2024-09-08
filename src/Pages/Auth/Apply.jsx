import React, { useEffect, useState } from 'react';
import { Button, Carousel, FloatingLabel, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from 'react-hook-form';
import { makeUniqueId } from '../../Utils/helpers';
import axios from 'axios';
import { addLogin, addParent, addStudent, getAllParentsIds, getAllStudentsIds } from '../../Utils/queryFunctions';
import { useSelector } from 'react-redux';

const schemas = [
  yup.object({

    name: yup.string().required("رجاءا أدخل إسم الطالب"),
    date_of_birth: yup.date().typeError("رجاءا أدخل تاريخ صحيح").required("رجاءا أدخل تاريخ ميلاد الطالب").max(new Date("2006-1-1"),"تاريخ الميلاد يجب أن يكون قبل 2006"),
    national_id: yup.string().required("رجاءا أدخل الرقم القومي للطالب").min(14,"الرقم القومي غير صالح").max(14,"الرقم القومي غير صالح"),
    mobile_no: yup.string().required("رجاءا أدخل رقم هاتف للطالب"),
    extra_mobile_no: yup.string(),
    address: yup.string().required("رجاءا أدخل عنوان الطالب"),
    gender: yup.string().required("رجاءا أدخل النوع"),
    email: yup.string().email("البريد الإلكتروني غير صالح").required("رجاءا أدخل البريد الإلكتروني للطالب"),
    password: yup.string().required("رجاءا أدخل كلمة السر"),
    confirmpassword: yup.string().required("رجاءا أدخل تأكيد كلمة السر"),
  
}).required(),
  yup.object({


    name: yup.string().required("رجاءا أدخل إسم ولي الأمر"),
    date_of_birth: yup.date("").typeError("رجاءا أدخل تاريخ صحيح").required("رجاءا أدخل تاريخ ميلاد ولي الأمر"),
    national_id: yup.string().required("رجاءا أدخل الرقم القومي لولي الأمر").min(14,"الرقم القومي غير صالح").max(14,"الرقم القومي غير صالح"),
    mobile_no: yup.string().required("رجاءا أدخل رقم هاتف لولي الأمر"),
    address: yup.string().required("رجاءا أدخل عنوان ولي الأمر"),
    gender: yup.string().required("رجاءا أدخل النوع"),
    email: yup.string().email("البريد الإلكتروني غير صالح").required("رجاءا أدخل البريد الإلكتروني لولي الأمر"),

    
  }).required(),
  yup.object({

    faculty_id: yup.string().required("رجاءا اختر الكلية"),
    department_id: yup.string().required("رجاءا اختر القسم العلمي"),
    level: yup.number().required("رجاءا اختر المستوى")

  }).required(),
  

]

function Apply({}) {

    const navigate = useNavigate();
    
    const [formIndex,setFormIndex] = useState(1);

    const faculties = useSelector(store => store.data.faculties);
    const departments = useSelector(store => store.data.departments);

    const [filteredDepartments,setFilteredDepartments] = useState(departments);

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
        const fac = faculties.find((f) => f.faculty_id === facultySelect);
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

        // if(updatedApplyInfo[0].date_of_birth) updatedApplyInfo[0].date_of_birth = updatedApplyInfo[0].date_of_birth.split("T")[0]; 
        // if(updatedApplyInfo[1].date_of_birth) updatedApplyInfo[1].date_of_birth = updatedApplyInfo[1].date_of_birth.split("T")[0];
        
        console.log(updatedApplyInfo);

        if(formIndex === 0)
        {
            if(updatedApplyInfo.password !== updatedApplyInfo.confirmpassword)
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

            const parent_ID_List = await getAllParentsIds().map((p_id)=>p_id.slice(1));
            const new_parent_ID = "P"+makeUniqueId(parent_ID_List,8)
            await addParent({...updatedApplyInfo[1],parent_id:new_parent_ID});
    
            const student_ID_List = await getAllStudentsIds().map((s_id)=>s_id.slice(1));
            const new_student_ID = "S"+makeUniqueId(student_ID_List,8)

            await addStudent({...updatedApplyInfo[0],student_id:new_student_ID,parent_id:new_parent_ID,...updatedApplyInfo[2]});

            await addLogin([updatedApplyInfo[0].email,updatedApplyInfo[0].password]);

            navigate("/");
        }


    }

    useEffect(()=>{
        setFilteredDepartments(departments.filter((dep) => dep.faculty_id === facultySelect))
    },[facultySelect])



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
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentInfo("name")} />
                                    <span>الإسم كاملا</span>
                                </div>
                                {errorsStudentInfo.name ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.name.message}</div> : ''}
                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>
                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="date" {...registerStudentInfo("date_of_birth")} />
                                        <span>تاريخ الميلاد</span>
                                    </div>
                                    {errorsStudentInfo.date_of_birth ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.date_of_birth.message}</div> : ''}
                                </div>
                                <div className='w-100'>
                                    <div className='d-flex gap-3 align-items-center'>
                                        <p className='mb-2 text-black-50'>النوع:</p>
                                        <Form.Check
                                            type="radio"
                                            label="ذكر"
                                            name="gender-radio"
                                            value="m"
                                            {...registerStudentInfo("gender")}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="أنثى"
                                            name="gender-radio"
                                            value="f"
                                            {...registerStudentInfo("gender")}

                                        />
                                    </div>
                                    {errorsStudentInfo.gender ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.gender.message}</div> : ''}

                                </div>
                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="number" {...registerStudentInfo("national_id")} />
                                        <span>الرقم القومي</span>
                                    </div>
                                    {errorsStudentInfo.national_id ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.national_id.message}</div> : ''}
                                </div>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentInfo("address")} />
                                        <span>العنوان</span>
                                    </div>
                                    {errorsStudentInfo.address ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.address.message}</div> : ''}
                                </div>

                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentInfo("mobile_no")} />
                                        <span>رقم هاتف الطالب</span>
                                    </div>
                                    {errorsStudentInfo.mobile_no ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.mobile_no.message}</div> : ''}
                                </div>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerStudentInfo("extra_mobile_no")} />
                                        <span>رقم هاتف إحتياطي للطالب</span>
                                    </div>
                                    {errorsStudentInfo.extra_mobile_no ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.extra_mobile_no.message}</div> : ''}
                                </div>

                            </div>

                            <hr className='m-0' />

                            <div className='w-100'>
                                <div className='labeled-input'>
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="email" {...registerStudentInfo("email")} />
                                    <span>البريد الإلكتروني للطالب</span>
                                </div>
                                {errorsStudentInfo.email ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.email.message}</div> : ''}
                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>
                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="password" {...registerStudentInfo("password")} />
                                        <span>كلمة المرور</span>
                                    </div>
                                    {errorsStudentInfo.password ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.password.message}</div> : ''}
                                </div>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="password" {...registerStudentInfo("confirmpassword")} />
                                        <span>تأكيد كلمة المرور</span>
                                    </div>
                                    {errorsStudentInfo.confirmpassword ? <div className='error-message text-danger mt-2'>{errorsStudentInfo.confirmpassword.message}</div> : ''}
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
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerParentInfo("name")} />
                                    <span>إسم ولي الأمر كاملا</span>
                                </div>
                                {errorsParentInfo.name ? <div className='error-message text-danger mt-2'>{errorsParentInfo.name.message}</div> : ''}
                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="date" {...registerParentInfo("date_of_birth")} />
                                        <span>تاريخ الميلاد</span>
                                    </div>
                                    {errorsParentInfo.date_of_birth ? <div className='error-message text-danger mt-2'>{errorsParentInfo.date_of_birth.message}</div> : ''}
                                </div>

                                <div className='w-100'>
                                    <div className='d-flex gap-3 align-items-center'>
                                        <p className='mb-2 text-black-50'>النوع:</p>
                                        <Form.Check
                                            type="radio"
                                            label="ذكر"
                                            name="gender-radio"
                                            value="m"
                                            {...registerParentInfo("gender")}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="أنثى"
                                            name="gender-radio"
                                            value="f"
                                            {...registerParentInfo("gender")}
                                        />
                                    </div>
                                    {errorsParentInfo.gender ? <div className='error-message text-danger mt-2'>{errorsParentInfo.gender.message}</div> : ''}
                                </div>
                            </div>

                            <div className='w-100 d-flex flex-column flex-md-row gap-3'>


                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="number" {...registerParentInfo("national_id")} />
                                        <span>الرقم القومي لولي الأمر</span>
                                    </div>
                                    {errorsParentInfo.national_id ? <div className='error-message text-danger mt-2'>{errorsParentInfo.national_id.message}</div> : ''}
                                </div>

                                <div className='w-100'>
                                    <div className='labeled-input'>
                                        <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerParentInfo("address")} />
                                        <span>عنوان ولي الأمر</span>
                                    </div>
                                    {errorsParentInfo.address ? <div className='error-message text-danger mt-2'>{errorsParentInfo.address.message}</div> : ''}
                                </div>

                            </div>

                            <div className='w-100'>
                                <div className='labeled-input'>
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerParentInfo("mobile_no")} />
                                    <span>رقم هاتف ولي الأمر</span>
                                </div>
                                {errorsParentInfo.mobile_no ? <div className='error-message text-danger mt-2'>{errorsParentInfo.mobile_no.message}</div> : ''}
                            </div>
                        
                            <div className='w-100'>
                                <div className='labeled-input'>
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="text" {...registerParentInfo("email")} />
                                    <span>البريد الإلكتروني لولي الأمر</span>
                                </div>
                                {errorsParentInfo.email ? <div className='error-message text-danger mt-2'>{errorsParentInfo.email.message}</div> : ''}
                            </div>

                        </Form>
                    </Carousel.Item>

                    <Carousel.Item className='bg-white'>
                        <div className="d-flex"><h4 className='border-bottom border-2 border-black pb-2 mb-4'>معلومات المجال الدراسي</h4></div>
                        <Form id='application-form-3' onSubmit={handleSubmitApplicationInfo(onSubmit)} className="d-flex flex-column w-100 gap-3 p-2">                            
                            <Form.Select name="faculty_id" {...registerApplicationInfo("faculty_id")} onChange={(e)=>{
                                setFacultySelect(e.target.value)
                                setApplicationInfo("department_id","");
                                }}>
                                <option value="">اختر الكلية</option>
                                {
                                    faculties.map((fac)=>
                                    <option value={fac.faculty_id}>{fac.faculty_name}</option>
                                    )
                                }
                            </Form.Select>    

                            <Form.Select name="department_id" {...registerApplicationInfo("department_id")} >
                                <option value="">اختر القسم</option>
                                {
                                    filteredDepartments.map((dep)=>
                                    <option value={dep.department_id}>{dep.department_name}</option>
                                    )
                                }
                            </Form.Select>

                            <div className='w-100'>
                                <Form.Select {...registerApplicationInfo("level")} >
                                    <option value="">اختر المستوى الدراسي</option>
                                    {
                                        Array.from({length:getFacultyLevels()}).map((x,i)=>
                                        <option value={i+1}>المستوى {i+1}</option>
                                        )
                                    }
                                </Form.Select>
                                {errorsApplicationInfo.level ? <div className='error-message text-danger mt-2'>{errorsApplicationInfo.level.message}</div> : ''}
                            </div>

                            {/* <div className='w-100'>
                                <div className='labeled-input'>
                                    <input className='p-2 rounded-1 w-100' placeholder='' type="number" {...registerApplicationInfo("level")} />
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