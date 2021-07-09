import React, { createContext, useContext, useReducer } from "react";
import jwtdecode from "jwt-decode";

const AuthStateContex = createContext();
const AuthDispatchContex = createContext();

let user = null;
const token = localStorage.getItem("token");
if (token) {
  const decodedToken = jwtdecode(token);
  const expireAt = new Date(decodedToken.exp * 1000);
  if (new Date() > expireAt) {
    localStorage.removeItem("token");
  } else {
    user = decodedToken;
  }
} else {
  console.log("token not present.");
}

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { user });
  return (
    <AuthDispatchContex.Provider value={dispatch}>
      <AuthStateContex.Provider value={state}>
        {children}
      </AuthStateContex.Provider>
    </AuthDispatchContex.Provider>
  );
};

export const useAuthState = () => useContext(AuthStateContex);
export const useAuthDispatch = () => useContext(AuthDispatchContex);
