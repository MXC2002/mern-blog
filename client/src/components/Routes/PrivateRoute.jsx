import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import AuthModal from "../Auth/AuthModal";
import { useState } from "react";

export default function PrivateRoute() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useSelector(state => state.user)

  const handleOpenAuthModal = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  if (!currentUser) {
    handleOpenAuthModal();
  }
  
  return currentUser ? <Outlet /> : (
    <AuthModal show={showAuthModal} onClose={handleCloseAuthModal} />
  )
}
