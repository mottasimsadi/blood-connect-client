import axios from "axios";
import {
  createUserWithEmailAndPassword,
  deleteUser,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import app from "../firebase/firebase.config";
import useAxiosPublic from "../hooks/axiosPublic";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosPublic = useAxiosPublic();

  // Updated createUser function
  const createUser = (email, password, name, photoURL) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password).then(
      (userCredential) => {
        return updateProfile(userCredential.user, {
          displayName: name,
          photoURL: photoURL,
        }).then(() => {
          // Manually update the user to trigger onAuthStateChanged with the correct data
          setUser({
            ...userCredential.user,
            displayName: name,
            photoURL: photoURL,
          });
          return userCredential;
        });
      }
    );
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleProvider = new GoogleAuthProvider();

  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUser = (updatedData) => {
    return updateProfile(auth.currentUser, updatedData).then(() => {
      // Force the state to reflect the updated profile
      const updatedUser = {
        ...auth.currentUser,
        displayName: updatedData.displayName,
        photoURL: updatedData.photoURL,
      };
      setUser(updatedUser);
    });
  };

  const removeUser = (user) => {
    return deleteUser(user);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🚀 ~ onAuthStateChanged ~ currentUser:", currentUser);

      if (currentUser) {
        const userInfo = {
          email: currentUser.email,
          name: currentUser.displayName,
          role: "donor",
        };

        axiosPublic
          .post("/add-user", userInfo)
          .then((res) => {
            console.log("User synced with backend:", res.data);
            setUser(currentUser);
          })
          .catch((error) => {
            console.error("Failed to sync user with backend:", error);
            setUser(currentUser);
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [axiosPublic]);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    setUser,
    logOut,
    googleSignIn,
    updateUser,
    removeUser,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
