/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import VerifyModal from "./VerifyModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import ResetPasswordModal from "./ResetPasswordModal";


export default function AuthModal({ show, onClose}) {
    const [showSignInModal, setShowSignInModal] = useState(true);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);
    const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
    const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
    

    const handleOpenSignUp = () => {
        setShowSignInModal(false);
        setShowVerifyModal(false);
        setShowSignUpModal(true);
    };

    const handleOpenSignIn = () => {
        setShowSignUpModal(false);
        setShowVerifyModal(false);
        setShowForgotPasswordModal(false);
        setShowSignInModal(true);
    }

    const handleOpenVerify = () => {
        setShowSignUpModal(false);
        setShowVerifyModal(true);
    }

    const handleOpenForgotPassword = () => {
        setShowSignInModal(false);
        setShowResetPasswordModal(false);
        setShowForgotPasswordModal(true);
    }

    const handleOpenResetPassword = () => {
        setShowForgotPasswordModal(false);
        setShowResetPasswordModal(true);
    }

    return (
        <>
            <SignInModal show={show && showSignInModal} onClose={onClose} onOpenSignUp={handleOpenSignUp} onOpenForgotPassword={handleOpenForgotPassword}/>

            <SignUpModal show={show && showSignUpModal} onClose={onClose} onOpenSignIn={handleOpenSignIn} onOpenVerify={handleOpenVerify}/>

            <VerifyModal show={show && showVerifyModal} onClose={handleOpenSignUp} onOpenSignIn={handleOpenSignIn}/>

            <ForgotPasswordModal show={show && showForgotPasswordModal} onClose={handleOpenSignIn} onOpenResetPassword={handleOpenResetPassword}/>

            <ResetPasswordModal show={show && showResetPasswordModal} onClose={handleOpenForgotPassword} onOpenSignIn={handleOpenSignIn}/>
        </>
    )
}
