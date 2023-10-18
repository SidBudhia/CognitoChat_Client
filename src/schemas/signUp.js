import * as Yup from "yup";

export const signUpSchema = Yup.object({
    name: Yup.string().min(2).max(25).required("enter your name"),
    email: Yup.string().email().required("enter your email"),
    password: Yup.string().min(4).required("enter your password"),
    confirm_password: Yup.string().required("confirm your password").oneOf([Yup.ref("password"), null], "password must match"),
});