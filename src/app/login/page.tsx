"use client"
import Image from "next/image";
import FieldText from "../component/FieldText";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/ReactToastify.css';
import { setLogin } from "../../../services/auth";
import Cookies from 'js-cookie';

export default function Login(){

  const router = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const token = Cookies.get('token');

  if(token) {
    router.replace('/dashboard');
    }

  const loginHandler = async () => {
    const formData = {
      email,
      password
    }

    if(!email || !password){
      toast.error('Email dan Password wajib di isi')
    } else {
      const response = await setLogin(formData);
      if(response.error){
        toast.error(response.message)
      }else{
        toast.success("Berhasil")
        const {token} = response.data.token;
   
        Cookies.set('token', token, {expires : 1})
  
        router.replace('/dashboard');
      }
    }
  };



  return(
    <>
     <section className="flex items-center justify-center">
      <div className="m-auto">
        <Image 
          src="/logo.png"
          width={200}
          height={100}
          alt="Logo Invite You"
          className="m-auto"
        />
        <h1 className="font-bold text-2xl mt-2 text-center">Login</h1>
        <div  className="mt-5 text-center">
          <FieldText usefor='email' label='Email'  value={email} onChange={setEmail}  type="text"/>
          <FieldText usefor='password' label='Password' value={password} onChange={setPassword} type="password"/>
          <button className="px-8 py-2 text-white font-bold mx-auto bg-gold mt-6 text-xs " onClick={loginHandler} type="submit">Login</button>
        </div>
      </div>
    </section>
    <ToastContainer></ToastContainer>
    </>  
  );
 
}

