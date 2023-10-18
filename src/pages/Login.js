import Cookies from 'universal-cookie';
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useFormik } from "formik";
import { logInSchema } from "../schemas/logIn.js";
import axios from "axios";

const server = process.env.REACT_APP_SERVER;

let initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const navigate = useNavigate();
  const cookies = new Cookies(null, { path: '/' });
  
  useEffect(()=>{
    if(cookies.get("jwt") != undefined) {
      navigate(`/dashboard`);
    }
  }, []);

  let { values, errors, touched, handleBlur, handleChange, handleSubmit } =
    useFormik({
      initialValues,
      validationSchema: logInSchema,
      onSubmit: async (values, action) => {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const resp = await axios.post(
            `${server}/api/user/login`,
            values,
            config
          );
          const data = resp.data;
          cookies.set('jwt', data.jwt, { maxAge: data.maxAge });
          alert("Logged In Successful");
          navigate(`/dashboard`);
        } catch (err) {
          console.log(err);
          alert(err.response.data);
        }
        action.resetForm();
      },
    });

  return (
    <div className="bg-light flex items-center justify-center">
      <div className=" bg-white w-[600px] h-[600px] shadow-lg rounded-lg flex flex-col justify-center items-center">
        <div className=" text-4xl font-extrabold">Welcome to Chat App</div>
        <div className=" text-2xl font-light mb-14">Sign In</div>
        <form
          className="flex flex-col items-center w-full"
          onSubmit={handleSubmit}
        >
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Your Email..."
            className="mb-6 w-[75%]"
          />
          {errors.email && touched.email ? (
            <p className=" text-red-600">{errors.email}</p>
          ) : null}

          <Input
            label="Password"
            type="password"
            name="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Your Password...."
            className="mb-6 w-[75%]"
          />
          {errors.password && touched.password ? (
            <p className=" text-red-600">{errors.password}</p>
          ) : null}

          <Button label="Sign In" type="submit" className="w-[75%] mb-2" />
        </form>
        <div>
          Not a User?
          <span
            className=" text-primary cursor-pointer underline"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
