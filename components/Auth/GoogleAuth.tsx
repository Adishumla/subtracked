/* import React from "react";
import GoogleButton from "react-google-button";

const GoogleAuth = () => {
  const handleSuccess = (response: any) => {
    console.log("Google login success:", response);
    // Handle successful login here
  };

  const handleFailure = (error: any) => {
    console.error("Google login error:", error);
    // Handle login error here
  };

  return (
    <GoogleButton
      onClick={() => {
        window.gapi.auth2
          .getAuthInstance()
          .signIn()
          .then(handleSuccess, handleFailure);
      }}
    />
  );
};

export default GoogleAuth;
 */
