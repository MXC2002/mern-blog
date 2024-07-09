import { Button } from "flowbite-react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from "../../firebase";
import { useDispatch } from "react-redux";
import { SignInSuccess } from "../../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {

    const auth = getAuth(app);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleGoogleClick = async () => {
        const provider = new GoogleAuthProvider()
        provider.setCustomParameters({ prompt: 'select_account'})
        try {
            const resultFromGoogle = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: resultFromGoogle.user.displayName,
                    email: resultFromGoogle.user.email,
                    googlePhotoUrl: resultFromGoogle.user.photoURL,
                })
            })
            const data = await res.json();
            if(res.ok) {
                dispatch(SignInSuccess(data))
                navigate('/')
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <Button className="capitalize w-full" type="button" gradientDuoTone="tealToLime" onClick={handleGoogleClick}>
            <FcGoogle className="w-6 h-6 mr-2"/>
            <p className="self-center">Tiếp tục với Google</p>
        </Button>
    );
}
