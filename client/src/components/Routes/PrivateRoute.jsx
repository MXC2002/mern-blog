import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import AuthModal from "../Auth/AuthModal";
import { useState, useEffect } from "react";

export default function PrivateRoute() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) {
      setShowAuthModal(true);
    } else {
      setShowAuthModal(false);
    }
  }, [currentUser]);

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  return currentUser ? <Outlet /> : <AuthModal show={showAuthModal} onClose={handleCloseAuthModal} />;
}
