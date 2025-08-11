import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
    const [currState, setCurrState] = useState("Sign up");
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [bio, setBio] = useState("");
    const [isDataSubmitted, setIsDataSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { login, authUser } = useContext(AuthContext);

    useEffect(() => {
    if (authUser) {
        navigate("/"); // redirect to home after login/signup
    }
}, [authUser, navigate]);


    // Monitor authUser for debugging - router handles redirection automatically
    useEffect(() => {
        console.log('authUser state changed:', authUser);
        if (authUser) {
            console.log('User is authenticated, router should redirect automatically');
        } else {
            console.log('User is not authenticated');
        }
    }, [authUser]);

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        
        // For Sign up: first collect basic info, then bio, then actually sign up
        if (currState === 'Sign up' && !isDataSubmitted) {
            console.log('Moving to bio step for signup');
            setIsDataSubmitted(true);
            return;
        }

        setIsLoading(true);
        console.log('Attempting authentication:', { 
            type: currState === "Sign up" ? 'signUp' : 'signIn', 
            email,
            fullName: currState === "Sign up" ? fullName : undefined,
            hasBio: currState === "Sign up" ? !!bio : undefined
        });
        
        try {
            // Call login function - AuthContext handles the API call
            const result = await login(currState === "Sign up" ? 'signUp' : 'signIn', { 
                fullName, 
                email, 
                password, 
                bio 
            });
            
            console.log('Login function result:', result);
            console.log('Current authUser after login call:', authUser);
            
            // Add a small delay to check if authUser gets updated
            setTimeout(() => {
                console.log('AuthUser after 500ms delay:', authUser);
            }, 500);
            
        } catch (error) {
            console.error('Authentication error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
            {/* left  */}
            <img src={assets.logo_big} alt="" className='w-[min(30vw,250px)]' />
            {/* right  */}

            <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
                <h2 className='font-medium text-2xl flex justify-between items-center'>
                    {currState}
                    {isDataSubmitted && <img onClick={() => setIsDataSubmitted(false)}
                        src={assets.arrow_icon} alt="" className='w-5 cursor-pointer' />}
                </h2>
                
                {currState === "Sign up" && !isDataSubmitted && (
                    <input onChange={(e) => setFullName(e.target.value)} value={fullName}
                        type="text" className='p-2 border border-gray-500 rounded-md focus:outline-none' placeholder='Full Name' required />
                )}

                {!isDataSubmitted && (
                    <>
                        <input onChange={(e) => setEmail(e.target.value)} value={email}
                            type="email" placeholder='Email Address' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
                        <input onChange={(e) => setPassword(e.target.value)} value={password}
                            type="password" placeholder='Password' required className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' />
                    </>
                )}

                {currState === 'Sign up' && isDataSubmitted && (
                    <textarea onChange={(e) => setBio(e.target.value)} value={bio}
                        rows={4} className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='provide a short bio...' required></textarea>
                )}

                <button type='submit' disabled={isLoading} className='py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer disabled:opacity-50'>
                    {isLoading ? 'Processing...' : 
                     currState === "Sign up" && !isDataSubmitted ? "Continue" :
                     currState === "Sign up" && isDataSubmitted ? "Create Account" : 
                     "Login Now"}
                </button>

                <div className='flex items-center gap-2 text-sm text-gray-500'>
                    <input type="checkbox" />
                    <p>Agree to the terms of use & privacy policy</p>
                </div>

                <div className='flex flex-col gap-2'>
                    {currState === "Sign up" ? (
                        <p className='text-sm text-gray-600'>Already have an account? <span onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }}
                            className='font-medium text-violet-500 cursor-pointer'>Login here</span></p>
                    ) : (
                        <p className='text-sm text-gray-600'>Create an account <span onClick={() => { setCurrState("Sign up"); setIsDataSubmitted(false) }}
                            className='font-medium text-violet-500 cursor-pointer'>Click here</span></p>
                    )}
                </div>
            </form>
        </div>
    )
}

export default LoginPage