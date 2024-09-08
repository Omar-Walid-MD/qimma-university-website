import React, { useState } from 'react';
import {Form,Container,FloatingLabel,Button} from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { setLoginID } from '../../Store/Auth/authSlice';
import { getRegisteredLogin, getStudentsFiltered } from '../../Utils/queryFunctions';

function Login({}) {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [loginType,setLoginType] = useState("student");
    const [loginInfo,setLoginInfo] = useState({
        email: "",
        password: ""
    });

    const [errorMessage,setErrorMessage] = useState("");

    async function onLogin()
    {
        if(loginType==="admin")
        {
            if(loginInfo.email==="admin@email.com" && loginInfo.password==="admin123")
            {
                dispatch(setLoginID("admin"));
                navigate("/");
                return;
            }
        }
        else
        {
            const registeredLogin = await getRegisteredLogin(loginInfo.email);
            if(registeredLogin && loginInfo.password === registeredLogin.password)
            {
                const studentID = (await getStudentsFiltered({email: loginInfo.email}))[0].student_id;
                dispatch(setLoginID(studentID));
                navigate("/");
                return;
            }
        }
        setErrorMessage("المعلومات غير صحيحة")
    }

    function handleLoginInfo(e)
    {
        setLoginInfo(l => ({...l,[e.target.name]:e.target.value}));
    }


    return (
        <div className='page-container position-relative d-flex flex-column align-items-center justify-content-center h-100'>
            <div className='login-page-bg position-absolute'></div>
            <Form className='form-container bg-white mb-3 border border-1 border-black rounded-2 shadow d-flex overflow-hidden'>
                <div className='login-form-bg w-50 d-none d-md-block'></div>
                <div className='login-form gap-4 d-flex flex-column align-items-center p-4'>
                    <img src={require("../../assets/img/logo.png")} style={{width:150}} className='rounded-4 shadow border border-2 border-black' />
                    
                    <h3>تسجيل الدخول</h3>
                    <div className='d-flex gap-3'>
                        <Form.Check
                            type="radio"
                            label="طالب"
                            name="login-radio"
                            value="student"
                            defaultChecked
                            onClick={()=>setLoginType("student")}

                        />
                        <Form.Check
                            type="radio"
                            label="مدير"
                            name="login-radio"
                            value="admin"
                            onClick={()=>setLoginType("admin")}
                        />
                    </div>
                    <div className='w-100 d-flex flex-column align-items-center gap-3'>
                        <FloatingLabel
                            controlId="floatingInput"
                            label="البريد الإلكتروني"
                            className="w-100"
                        >
                            <Form.Control type="email" placeholder="name@example.com" value={loginInfo.email} name='email' onChange={handleLoginInfo} />
                        </FloatingLabel>
                        <FloatingLabel
                            controlId="floatingPassword"
                            label="كلمة المرور"
                            className="w-100"
                        >
                            <Form.Control type="password" placeholder="Password" value={loginInfo.password} name='password' onChange={handleLoginInfo} />
                        </FloatingLabel>
                        {errorMessage && <p className='text-danger'>{errorMessage}</p>}
                        <div className='w-100'>
                            <Link>نسيت كلمة المرور؟</Link>
                        </div>
                        <Button className='main-btn primary text-dark fs-5 w-100' onClick={()=>onLogin()}>تسجيل الدخول</Button>
                    </div>
                </div>
            </Form>
            <div>
                <Button variant='white' to={"/"} as={Link}>الرجوع الى الرئيسية</Button>
            </div>
        </div>
    );
}

export default Login;