import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import './admin-view-page.css';



async function getData(userId) {
    try {
        console.log("Reached view page");
        const token = localStorage.getItem('token');
        console.log("view page token : ",token);
        const response = await axios.get(`http://localhost:2005/users/${userId}`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw error; // Rethrow the error to be caught by the caller
    }
}


function AdminViewPage() {
    console.log("reached view page");
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        getData(userId)
            .then(parsedData => setUser(parsedData.data))
            .catch(error => {
                console.error("Error fetching data: ", error);
                setUser(null); // Set user to null on error
            });
    }, [userId]);

    if (!user) {
        return <div>Loading...</div>; // Show loading indicator while fetching data
    }

    return (
        <>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <div>
            <h2>User Details</h2>
            <p>First Name: {user.firstname}</p>
            <p>Last Name: {user.lastname}</p>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            {/* Add other user details here */}
        </div>
        </>
    );
  
}

export default AdminViewPage;




