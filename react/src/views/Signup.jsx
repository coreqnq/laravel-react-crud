import {Link} from "react-router-dom";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import {useRef, useState} from "react";

export default function Signup(){

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();

    const {setUser, setToken} = useStateContext();
    const [errors, setErrors] = useState(null);

    const onSubmit = (ev) => {
        ev.preventDefault();
        const payload={
           name: nameRef.current.value,
           email: emailRef.current.value,
           password: passwordRef.current.value,
           password_confirmation: passwordConfirmRef.current.value,
        }

        axiosClient.post('signup', payload).
            then(({data}) => {
                console.log(data)
            setUser(data.user)
            setToken(data.token)
        }).catch( err=> {
            const response = err.response;
            if(response && response.status === 422){
                console.log(response.data.errors);
                setErrors(response.data.errors);
            }
        })

    }

    return (
        <form onSubmit={onSubmit}>
            <h1 className="title">
                Signup for free
            </h1>
            {errors && <div className='alert'>
                {Object.keys(errors).map(key => (
                    <p key={key}> {errors[key][0]}</p>
                ))}
                </div>
            }
            <input ref={nameRef} type="text" placeholder='Full Name' />
            <input ref={emailRef} type="email" placeholder='Email' />
            <input ref={passwordRef} type="password" placeholder='Password' />
            <input ref={passwordConfirmRef} type="password" placeholder='Password Confirmation' />
            <button className="btn btn-block">Login</button>
            <p className="message">
                Already Registered? <Link to='/login'>Sign in</Link>
            </p>

        </form>
    )
}
