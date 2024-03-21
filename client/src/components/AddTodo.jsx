import React from "react";
import { useState } from "react";
import { useContext } from "react";
import {GlobalContext} from '../context/Global'

export default function AddTodo() {
  const [content, setContent] = useState("");
  const {setNewTodo, setGlobalNewTodo} = useContext(GlobalContext);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents default form submission behavior
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/todos/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
          credentials: "include",
        }
      );

      const jsonData = await response.json();
      if (jsonData.status === 200) {
        console.log("Todo Added successfully");
        setContent("");
        setGlobalNewTodo(content)
        // window.location.href('http://localhost:5173/todos')
      }
    } catch (error) {
      console.error("Error from server:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-white min-w-screen min-h-[50px] px-5 py-5 border-t">
        <div className="flex">
          <input
            type="text"
            className="min-w-[500px] rounded-l outline-none border-l border-y py-1 px-2"
            placeholder="Enter todo here"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-2 py-1 border rounded-r"
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
