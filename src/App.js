import { Outlet } from 'react-router';
import 'bootstrap/dist/css/bootstrap.rtl.min.css';
import './App.css';
import ScrollToTop from './Layout/ScrollToTop';
import NavBar from './Layout/NavBar';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getLoginID } from './Store/Slice/auth';

function App() {

  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getLoginID());

  })

  return (
    <div>
      <ScrollToTop />
      <Outlet />
    </div>
  );
}

export default App;
