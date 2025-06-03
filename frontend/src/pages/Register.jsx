import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import useRegisterGoogle from "../hooks/authHooks/useRegisterGoogle.jsx";
import useRegister from "../hooks/authHooks/useRegister.jsx";
import {Link} from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

function Register() {
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const {register,loading,error} = useRegister()


    const handleSubmit = async (e) => {
        e.preventDefault();
        await register(formData)
    };

    const {registerGoogle,loading:loadingGoogle,error:errorG} = useRegisterGoogle()

    const handleGoogleSuccess = async (credentialResponse) => {
        const token = credentialResponse.credential;

      await  registerGoogle(token)

    };


    return (
        <div className="min-h-screen relative w-full bg- bg-[#5E5E5E] flex items-center justify-center">
            <Navbar/>
            <div className="max-w-md mx-auto  mt-10 bg-white p-8 rounded-xl shadow-lg text-black">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded bg-white"
                    />
                    <input
                        type="text"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded bg-white"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border p-2 rounded bg-white"
                    />
                    <div className="w-full flex items-center justify-center mt-4 text-gray-500">
                        <p>Have an account already? <Link className={'text-blue-600 underline'} to={'/login'}>Login</Link></p>
                    </div>
                    {error && <div className={'w-full p-2 border-red-500 border-[1px] text-red-500 flex items-center justify-center rounded-lg'}>
                        {error}
                    </div>}
                    {errorG && <div className={'w-full p-2 border-red-500 border-[1px] text-red-500 flex items-center justify-center rounded-lg'}>
                        {errorG}
                    </div>}
                    <button
                        type="submit"
                        className="w-full bg-cyanG text-white py-2 rounded hover:bg-blue-600 transition"
                    >
                        {!loading?"Register":<span className={'loading loading-spinner  loading-sm'}></span>}
                    </button>
                </form>

                <div className="my-6 text-center text-gray-500">or</div>

                <div className="flex justify-center">
                    <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => console.log("Google Signup Failed")} />
                </div>
            </div>
        </div>
    );
}

export default Register;
