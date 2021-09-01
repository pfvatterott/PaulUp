import React, { useState } from "react";
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

const googleSuccess = async (response) => {
    console.log(response)
    const userObj = response.profileObj
    
    const user = {
        email: userObj.email,
        firstName: userObj.givenName,
        lastName: userObj.familyName,
        image: userObj.imageUrl,
        googleId: userObj.googleId,
        listedItems: []
    }
    API.getUserByGoogleId(userObj.googleId).then(res => {
        setUserID(res.data[0]._id)
        if (res.data.length > 0) {
            setRedirect(true)
        }
        else {
            API.saveUser(user)
            setRedirect(true)
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
        {redirect ? <Redirect push to={{pathname: `/taskview`, state: userID}} /> : null}
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
                large
                className="loginBtn z-depth-3"
                node="a"
                style={{
                marginRight: "5px",
                }}
                waves="light"
                onClick={renderProps.onClick}
            >
                Start Swap'n!
            </Button>
        )}
        />
    </div>
 
);
}

export default Welcome;