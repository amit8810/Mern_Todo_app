import React, { createContext, useState } from "react";

export const GlobalContext = createContext(null);

export const GlobalProvider = (props) => {
  const [setNewTodo, setGlobalNewTodo] = useState("");
  return (
    <GlobalContext.Provider value={{ setNewTodo, setGlobalNewTodo }}>
      {props.children}
    </GlobalContext.Provider>
  );
};
