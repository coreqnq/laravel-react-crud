import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Users(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false)
    const {setNotification} = useStateContext()

    useEffect( ( ()=> {
        getUsers();
    }), [])

    const onDeleteClick = user => {
        if (!window.confirm("Are you sure you want to delete this user?")) {
            return
        }
        axiosClient.delete(`/users/${user.id}`)
            .then(() => {
                setNotification('User was successfully deleted')
                getUsers()
            })
    }


    const getUsers = () => {
        setLoading(true)
        axiosClient.get('/users')
            .then(({data}) => {
                setLoading(false)
                setUsers(data.data)
                console.log(data);
            })
            .catch(() => {
                setLoading(false)
            })

    }


    return (
        <div>
            <div style={{display: 'flex', justifyContent: "space-between", alignItems: "center"}}>
                <h1>Users</h1>
                <Link className="btn-add" to="/users/new">Add new</Link>
            </div>
            <div className="card animated fadeInDown">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Gender</th>
                        <th>Year of birth</th>
                        <th>Marital status</th>
                        <th>email</th>
                        <th>create at</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    {loading &&
                        <tbody>
                        <tr>
                            <td colSpan="5" className="text-center">
                                Loading...
                            </td>
                        </tr>
                        </tbody>
                    }
                    {!loading &&
                        <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.name}</td>

                                <td>{u.gender==1?'Male':''}{u.gender==2?'Female':''}</td>
                                <td>{u.date}</td>
                                <td>
                                    {(() => {
                                        switch (u.status) {
                                            case 1:
                                                return 'Single'
                                            case 2:
                                                return 'Married'
                                            case 3:
                                                return 'Divorced'
                                            default:
                                                return ''
                                        }
                                    })()}

                                </td>

                                <td>{u.email}</td>
                                <td>{u.created_at}</td>
                                <td>
                                    <Link className="btn-edit" to={'/users/' + u.id}>Edit</Link>
                                    &nbsp;
                                    <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    }
                </table>
            </div>
        </div>
    )
}
