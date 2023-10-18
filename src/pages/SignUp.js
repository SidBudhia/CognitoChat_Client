import React, {useEffect} from "react";
import Cookies from 'universal-cookie';
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useFormik } from "formik";
import { signUpSchema } from "../schemas/signUp.js";
import axios from "axios";

const server = process.env.REACT_APP_SERVER;
//console.log(server);

let initialValues = {
  name: "",
  email: "",
  password: "",
  confirm_password: "",
};

const SignUp = () => {
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
      validationSchema: signUpSchema,
      onSubmit: async (values, action) => {
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
          const { data } = await axios.post(
            `${server}/api/user/signup`,
            values,
            config
          );
          console.log(data);
          alert("Registration Successful");
          navigate("/");
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
        <div className=" text-2xl font-light mb-14">Sign Up</div>
        <form
          className="flex flex-col items-center w-full"
          onSubmit={handleSubmit}
        >
          <Input
            label="Full Name"
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter Your Full Name..."
            className="mb-6 w-[75%]"
          />
          {errors.name && touched.name ? (
            <p className=" text-red-600">{errors.name}</p>
          ) : null}
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
          <Input
            label="Password"
            type="password"
            name="confirm_password"
            value={values.confirm_password}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Confirm Your Password...."
            className="mb-6 w-[75%]"
          />
          {errors.confirm_password && touched.confirm_password ? (
            <p className=" text-red-600">{errors.confirm_password}</p>
          ) : null}
          <Button label="Sign Up" type="submit" className="w-[75%] mb-2" />
        </form>
        <div>
          Already a User?
          <span
            className=" text-primary cursor-pointer underline"
            onClick={() => navigate("/")}
          >
            Sign In
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
