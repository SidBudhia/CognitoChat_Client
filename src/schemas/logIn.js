import * as Yup from "yup";

export const logInSchema = Yup.object({
    email: Yup.string().email().required("enter your email"),
    password: Yup.string().min(4).required("enter your password"),
});