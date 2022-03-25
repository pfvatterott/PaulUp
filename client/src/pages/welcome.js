import React, { useState, useEffect } from "react";
import API from "../utils/API";
import GoogleLogin from "react-google-login";
import { Redirect } from "react-router-dom";
import "materialize-css";
import "./styles/welcomeStyle.css"
import { Button } from "react-materialize";

function Welcome() {

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const [redirect, setRedirect] = useState(false);
const [userID, setUserID] = useState('')

useEffect(() => {
    console.log('jih')
    console.log(googleClientId)
} , [])


const googleSuccess = async (response) => {
    const userObj = response.profileObj
    
    const user = {
        email: userObj.email,
        firstName: userObj.givenName,
        lastName: userObj.familyName,
        image: userObj.imageUrl,
        googleId: userObj.googleId,
        listedItems: [],
        favorites: []
    }
    API.getUserByGoogleId(userObj.googleId).then(res => {
        if (res.data.length > 0) {
            setUserID(res.data[0]._id)
            setRedirect(true)
        }
        else {
            API.saveUser(user).then(saveUserRes => {
                setUserID(saveUserRes.data._id)
                setRedirect(true)
            })
        }
    }).catch(error => console.log(error))

}

const googleFailure = (response) => {
console.log("please enable cookies to access this app");
alert("please enable cookies to access this app");
console.log(response);
};

return (
  

    <div className="row login">
        {redirect ? <Redirect push to={{pathname: `/workspace`, state: userID}} /> : null}
        <GoogleLogin
        className="loginBtn"
        clientId={googleClientId}
        buttonText="Log in"
        onSuccess={googleSuccess}
        onFailure={googleFailure}
        cookiePolicy={"single_host_origin"}
        isSignedIn={true}
        render={(renderProps) => (
            <Button
                onClick={renderProps.onClick}
            >
                Log in
            </Button>
        )}
        />
    </div>
 
);
}

export default Welcome;