/* eslint-disable no-unused-vars */
import FormikForm from "../../components/FormikForm";
import { login } from "../../services/auth";
import { setUser } from "../../store/actions/user";
import Loader from "@/components/Loader";
import { useState, useRef, useEffect } from "react";
import { useCookies } from "react-cookie";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  let content;
  let load=false;
  const [error, setError] = useState("");
  const [_, setCookies] = useCookies(["access_token", "refresh_token"]);

  useEffect(()=>{
    const timeout=setTimeout(()=>{

        load=true
    },1000)

    return ()=>{
        clearTimeout(timeout)
        load=false
    }
  },[])
  const initialValues = {
    username: {
      tag: "input",
      type: "text",
      placeholder: "Kullanıcı adı Giriniz",
      label: "Kullanıcı adı",
      value: "",
    },
    password: {
      tag: "input",
      type: "password",
      placeholder: "Şifre Giriniz",
      label: "Şifre",
      value: "",
    },
  };

  const validate = (values) => {
    const errors = {};
    if (!values.username) errors.username = "Kullanıcı adı Gerekli";
    if (!values.password) errors.password = "Şifre Gerekli";
    return errors;
  };

  const onSubmitHandle = async (values) => {
    const response = await login(values.username, values.password);
    if (response?.error) return setError(response.error);

    const cookieOptions = {
      path: "/",
      secure: true,
      httpOnly: true,
      sameSite: "none",
    };
    console.log(response.tokens.access_token, "lifx acess token xd");
    console.log(response, "responseee ");
    setCookies("access_token", response.tokens.access_token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    });
    setCookies("refresh_token", response.tokens.refresh_token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
    });
    setUser(response);
    navigate("/dashboard");
  };
  

  content = (
    <>
      <Helmet>
        <title>Mesh Giriş</title>
      </Helmet>
      <div className="flex flex-col p-9 bg-card-bg-light dark:bg-card-bg-dark w-full rounded-md">
        <div className="text-center font-semibold uppercase mb-9 text-lg text-text-dark-light dark:text-text-dark-dark">
          Giriş Yap
        </div>
        <FormikForm
          initialValues={initialValues}
          onSubmit={onSubmitHandle}
          error={error}
          validate={validate}
        />
      </div>
      {/* <div className="flex flex-col">
    <div className="mt-6">
      <Link
        to="/auth/forget-password"
        className="flex gap-2 justify-center items-center"
      >
        <LockIcon size={16} strokeWidth={2} />
        {t("forgetYourPassword")}
      </Link>
    </div>
    <div className="mt-6">
      {t("dontHaveAnAccount")}
      <Link
        to="/auth/register"
        className="text-text-dark-light dark:text-text-dark-dark font-bold"
      >
        {` `}
        {t("signUp")}
      </Link>
    </div>
  </div> */}
    </>
  );
  return !load ? content : <Loader />;
};

export default Login;
