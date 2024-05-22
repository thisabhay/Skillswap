import { React, useEffect, useState } from 'react'
import Axios from 'axios'
import { useNavigate } from 'react-router-dom'
import DataRow from './DataRow'
import { useUser } from '../../utils/UserProvider'
import { defaultUser } from '../../utils/defaultUser'
import { useAlert } from '../../utils/AlertProvider'

Axios.defaults.withCredentials = true


export default function Profile() {
    const { userData, setUserData } = useUser()
    const navigate = useNavigate()
    const fieldsNotToDisplay = ['notifications', 'matches']
    const {alert, setAlert} = useAlert()

    useEffect(() => {
        const handleFetch = async () => {
            try {
                const response = await Axios.post(`${import.meta.env.VITE_BACKEND_URL}user/profile`)

                if (response.status === 200) {
                    console.log('Profile fetched successfully:', response.data)
                    setUserData({
                        ...userData,
                        ...response.data
                    })
                } else {
                    console.log('Fetch not working')
                    setAlert({
                        message: "Couldn't fetch profile."
                    })
                }
            } catch (error) {
                if (error.response.status === 400) {
                    console.log('Token is invalid or expired.')
                    setAlert({
                        message: "Invalid token !"
                    })
                } else {
                    console.error('Fetching profile failed:', error.response.data)
                }
                setUserData({})
                console.log('Redirecting to login page.')
                setUserData({ ...defaultUser })
                navigate('/user/login')
            }
        }

        handleFetch()
    }, [])


    useEffect(() => {
        console.log('Updated userData:', userData);
    }, [userData])


    function handleClick() {
        navigate('/user/profile-update')
    }

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 my-10">
                <div className="flex flex-col items-center p-10">

                    <h1 className="text-right mb-1 text-xl font-medium text-gray-900 dark:text-white w-full">{`@ ${userData.username.toLowerCase()}`}</h1>


                    <div className="flex flex-col items-center p-5">
                        {Object.keys(userData).map((myKey, itr) => {
                            if (!fieldsNotToDisplay.includes(myKey))
                                return <DataRow key={itr} dataType={myKey} dataVal={userData[myKey]} />
                        })}
                    </div>

                    <button onClick={handleClick} className='rounded-lg border-2 border-black min-w-24'>EDIT</button>

                </div>
            </div>
        </div>
    )
}
