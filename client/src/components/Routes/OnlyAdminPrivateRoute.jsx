import { useState } from "react";
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import AuthModal from "../Auth/AuthModal";

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector(state => state.user);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleOpenAuthModal = () => {
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  if (!currentUser || !currentUser.isAdmin) {
    handleOpenAuthModal();
  }

  return (
    <>
      {currentUser && currentUser.isAdmin ? <Outlet /> : (
        <AuthModal show={showAuthModal} onClose={handleCloseAuthModal} />
      )}
    </>
  );
}
