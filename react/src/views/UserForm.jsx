import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function UserForm() {
    const navigate = useNavigate();
    let {id} = useParams();
    const [user, setUser] = useState({
        id: null,
        name: '',
        email: '',
        status: '',
        gender: '',
        date: '',
        password: '',
        password_confirmation: ''
    })
    const [errors, setErrors] = useState(null)
    const [loading, setLoading] = useState(false)
    const {setNotification} = useStateContext()

    if (id) {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
                .then(({data}) => {
                    setLoading(false)
                    setUser(data.data)
                })
                .catch(() => {
                    setLoading(false)
                })
        }, [])
    }

    const onSubmit = ev => {
        ev.preventDefault()
        if (user.id) {
            axiosClient.put(`/users/${user.id}`, user)
                .then(() => {
                    setNotification('User was successfully updated')
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        } else {
            axiosClient.post('/users', user)
                .then(() => {
                    setNotification('User was successfully created')
                    navigate('/users')
                })
                .catch(err => {
                    const response = err.response;
                    if (response && response.status === 422) {
                        setErrors(response.data.errors)
                    }
                })
        }
    }

    return (
        <>
            {user.id && <h1>Update User: {user.name}</h1>}
            {!user.id && <h1>New User</h1>}
            <div className="card animated fadeInDown">
                {loading && (
                    <div className="text-center">
                        Loading...
                    </div>
                )}
                {errors &&
                    <div className="alert">
                        {Object.keys(errors).map(key => (
                            <p key={key}>{errors[key][0]}</p>
                        ))}
                    </div>
                }
                {!loading && (
                    <form onSubmit={onSubmit}>
                        <input value={user.name} onChange={ev => setUser({...user, name: ev.target.value})} placeholder="Name"/>
                        <input value={user.email} onChange={ev => setUser({...user, email: ev.target.value})} placeholder="Email"/>

                        <input type="date"   value={user.date}  onChange={ev => setUser({...user, date: ev.target.value})}  />

                        <select value={user.status} onChange={ev => setUser({...user, status: ev.target.value})}>
                            <option value="1">Single</option>
                            <option value="2">Married</option>
                            <option value="3">Divorced</option>
                        </select>

                        <input type="radio" value="1" name="gender" onChange={ev => setUser({...user, gender: ev.target.value})} checked={user.gender == "1"}  /> Male
                        <input type="radio" value="2" name="gender" onChange={ev => setUser({...user, gender: ev.target.value})} checked={user.gender == "2"}  /> Female



                        <input type="password" onChange={ev => setUser({...user, password: ev.target.value})} placeholder="Password"/>
                        <input type="password" onChange={ev => setUser({...user, password_confirmation: ev.target.value})} placeholder="Password Confirmation"/>
                        <button className="btn">Save</button>
                    </form>
                )}
            </div>
        </>
    )
}
