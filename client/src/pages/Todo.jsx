import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { UserContext } from "../context/User";
import AddTodo from "../components/AddTodo";
import { TiEdit } from "react-icons/ti";
import { RiDeleteBinLine } from "react-icons/ri";
import { GlobalContext } from "../context/Global";


export default function Todo() {
  const navigate = useNavigate();
  const { setAuth } = useContext(AuthContext);
  const { user, setUser } = useContext(UserContext);
  const [todos, setTodos] = useState([]);
  const {setNewTodo} = useContext(GlobalContext);

  // fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/users/current-user`,
          {
            credentials: "include",
          }
        );

        const jsonData = await response.json();
        if (response.status !== 200) {
          navigate("/login");
        } else {
          setUser(jsonData.user);
          setAuth(true);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, setAuth, setUser, setTodos]);

  // fetch all todos of the user
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/v1/todos/${user?._id}`
        );
        const jsonData = await response.json();
        setTodos(jsonData.todos);
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    };

    // Fetch todos only if user is available
    if (user) {
      fetchTodos();
    }
  }, [user, setNewTodo]);

  // logout logic
  const handleLogout = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/logout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.status === 200) {
        setAuth(false); // Reset authentication state
        setUser(null); // Reset user state
        navigate("/login");
      } else {
        console.error("Logout failed:", response.statusText);
        // Handle logout failure
      }
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle logout error
    }
  };

  //handle delete
  const handleDeleteTodo = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this todo?"
    );
    if (confirmDelete) {
      const response = await fetch(
        `http://localhost:8000/api/v1/todos/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const jsonData = await response.json();
      if (jsonData.status === 200) {
        const updatedTodos = todos.filter((todo) => todo._id !== id);
        setTodos(updatedTodos);
      }
    }
  };

  //handle updateTodo
  const handleUpdateTodo = async (id, content) => {
    try {
      const updateTodo = prompt("Rename the todo:", content);
      if (updateTodo !== null) {
        const response = await fetch(`http://localhost:8000/api/v1/todos/edit/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: updateTodo }) // Corrected the body to send updated content
        });
  
        if (response.status === 200) {
          //! Attention to this logic
          const updatedTodo = {...todos.find((todo) => todo._id === id), content: updateTodo};
          const updatedTodos = todos.map((todo) => todo._id === id ? updatedTodo : todo);
          setTodos(updatedTodos);
          
          console.log("Data updated successfully");
        } else {
          const jsonData = await response.json();
          console.log("Error response from server", jsonData);
        }
      }
    } catch (error) {
      console.error("Error updating data", error);
    }
  }

  return (
    <div className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      {/* header */}
      <nav className="bg-[#36454F] flex justify-between items-center px-10 py-3">
        <h2 className="text-white font-bold text-xl">{user?.username}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 rounded px-3 py-2 text-white"
        >
          Logout
        </button>
      </nav>
      {/* outer main body  */}
      <section className="flex flex-col justify-center items-center mt-24">
        <div className="flex flex-col h-auto min-w-[600px] border rounded bg-white">
          {/* todo heading */}
          <p className="px-5 py-2 bg-[#f6f7f6] font-semibold">Todos ({todos?.length})</p>
          {/* input box body */}
          <AddTodo />
          {/* todos */}
          <div className="px-5 mb-5 bg-white">
            {todos?.map((todo) => (
              <div
                key={todo._id}
                className="flex border justify-between items-center p-2"
              >
                <div className="flex gap-3">
                  <input type="checkbox" name="" id="" />
                  <p>{todo.content}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleUpdateTodo(todo._id, todo.content)} className="px-3 py-2 text-white bg-green-500 rounded">
                    <TiEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(todo._id)}
                    className="px-3 py-2 text-white bg-red-500 rounded"
                  >
                    <RiDeleteBinLine />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
