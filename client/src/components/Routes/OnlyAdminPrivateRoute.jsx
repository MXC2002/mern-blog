import { useEffect, useState } from "react";
import { useSelector } from "react-redux"
import { Outlet } from "react-router-dom"
import AuthModal from "../Auth/AuthModal";

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector(state => state.user);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (!currentUser || !currentUser.isAdmin) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [currentUser, currentUser.isAdmin])

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return (
    <>
      {currentUser && currentUser.isAdmin ? <Outlet /> : (
        <AuthModal show={showAuthModal} onClose={handleCloseAuthModal} />
      )}
    </>
  );
}
