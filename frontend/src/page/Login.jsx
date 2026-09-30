import React from 'react'
import { Navigate,BrowserRouter as Router, Route, NavLink ,Routes} from "react-router-dom";
import "../App.css";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
export default function Login() {
  return (
    <div className="App">
        <div className="appAside" />
        <div className="appForm">
          <div className="pageSwitcher">
            <NavLink
              exact
              className={({ isActive }) => (isActive ? 'pageSwitcherItem-active' : 'pageSwitcherItem')}
              to="/sign-in"
            >
              Sign In
            </NavLink>
            <NavLink
              to="/"
              
              className={({ isActive }) => (isActive ? 'pageSwitcherItem-active' : 'pageSwitcherItem')}
            >
              Sign Up
            </NavLink>
          </div>

          <div className="formTitle" style={{margin:'0'}}>
            <NavLink
              to="/sign-in"
              className={({ isActive }) => (isActive ? 'formTitleLink-active' : 'formTitleLink')}
            >
              Sign In
            </NavLink>{" "}
            or{" "}
            <NavLink
              exact
              to="/"
              className={({ isActive }) => (isActive ? 'formTitleLink-active' : 'formTitleLink')}
            >
              Sign Up
            </NavLink>
          </div>
          
             <Routes>
            
             <Route path="/sign-in" element={<SignInForm />} />
             <Route exact path="/" element={<SignUpForm />} />
             <Route path="*" element={<Navigate to='/sign-in' />} />
             </Routes>
        </div>
      </div>
  )
}
