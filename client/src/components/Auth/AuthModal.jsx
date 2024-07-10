/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import VerifyModal from "./VerifyModal";


export default function AuthModal({ show, onClose}) {
    const [showSignInModal, setShowSignInModal] = useState(true);
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [showVerifyModal, setShowVerifyModal] = useState(false);

    const handleOpenSignUp = () => {
        setShowSignInModal(false);
        setShowSignUpModal(true);
    };

    const handleOpenSignIn = () => {
        setShowSignUpModal(false);
        setShowSignInModal(true);
    }

    const handleOpenVerify = () => {
        setShowSignUpModal(false);
        setShowVerifyModal(true);
    }

    return (
        <>
            <SignInModal show={show && showSignInModal} onClose={onClose} onOpenSignUp={handleOpenSignUp}/>
            <SignUpModal show={show && showSignUpModal} onClose={onClose} onOpenSignIn={handleOpenSignIn} onOpenVerify={handleOpenVerify}/>
            <VerifyModal show={show && showVerifyModal} onClose={onClose} onOpenSignIn={handleOpenSignIn}/>
        </>
    )
}
