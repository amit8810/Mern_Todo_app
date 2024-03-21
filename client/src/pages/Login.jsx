import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import github from "/github-grise.png";
import { useContext } from "react";
import { AuthContext } from "../context/Auth";
import { UserContext } from "../context/User";

export default function Login() {
  const form = useForm();
  const { register, handleSubmit, formState } = form;
  const { errors } = formState;
  const [serverErrors, setServerErrors] = useState(null);
  const navigate = useNavigate();
  const {setAuth} = useContext(AuthContext);
  const {setUser} = useContext(UserContext);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        }
      );

      let jsonData = await response.json();
      if (jsonData.status === 200) {
        setAuth(true)
        setUser(jsonData.user)
        setServerErrors(null)
        navigate('/todos')
        
      } else {
        setServerErrors(jsonData);
        console.error(`Error ${response.status} from server: `, jsonData);
      }
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <section className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      {/* header */}
      <nav className="bg-[#36454F] flex justify-between items-center px-10 py-3">
        <h2 className="text-white font-bold text-xl">Todos</h2>
        <NavLink to="/signup">
          <button className="bg-green-500 rounded px-3 py-2 text-white">
            Sign up
          </button>
        </NavLink>
      </nav>
      {/* register body */}
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col h-auto min-w-[400px] border rounded">
          <p className="text-center py-2 font-semibold bg-[#f6f7f6] text-xl">
            Login
          </p>
          <div className="flex items-center justify-center py-4 border-t bg-white">
            <img src={github} alt="github-logo" className="w-[150px]" />
          </div>
          <div className="px-7 bg-white">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* username */}
              <div className="flex border item-center rounded">
                <div className="flex justify-center items-center px-3 py-2 border-r text-[#36454F]">
                  <FaUser />
                </div>
                <input
                  type="text"
                  className="px-3 py-2 outline-none"
                  placeholder="Username"
                  {...register("username", {
                    required: {
                      value: true,
                      message: "* username is required",
                    },
                  })}
                />
              </div>
              <p className="text-red-500">{errors.username?.message}</p>
              {/* Password */}
              <div className="mt-5 flex border item-center rounded">
                <div className="flex justify-center items-center px-3 py-2 border-r text-[#36454F]">
                  <FaLock />
                </div>
                <input
                  type="password"
                  className="px-3 py-2 outline-none"
                  placeholder="Password"
                  {...register("password", {
                    required: {
                      value: true,
                      message: "* password is required",
                    },
                  })}
                />
              </div>
              <p className="text-red-500">{errors.password?.message}</p>

              {/* to display server side error in ui */}
              {serverErrors && (
                <div className="text-red-500 ">{serverErrors.error}</div>
              )}

              {/* enter button */}
              <div className="mt-5 mb-8 grid">
                <button
                  type="submit"
                  className="bg-blue-500 rounded py-2 text-white"
                >
                  Enter
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* view project on github */}
        <div className="grid mt-5 border min-w-[400px] rounded">
          <Link
            to="https://github.com/amit8810"
            className="text-center py-2 bg-[#f6f7f6]"
          >
            View the project on GitHub
          </Link>
        </div>
      </div>
    </section>
  );
}
