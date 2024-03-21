import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { FaUser, FaLock } from "react-icons/fa";
import { useForm } from "react-hook-form";
import github from "/github-grise.png";

export default function Signup() {
  const form = useForm();
  const { register, handleSubmit, reset, formState } = form;
  const { errors } = formState;
  const [showNotification, setShowNotification] = useState(false);
  const [serverErrors, setServerErrors] = useState(null);

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/users/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 201) {
        console.log("Data successfully submitted");
        setShowNotification(true);
        setTimeout(() => {
          setShowNotification(false);
        }, 3000); // Hide the notification after 3 seconds
      } else {
        const errorData = await response.json();
        setServerErrors(errorData);
        console.error(`Error ${response.status} from server: `, errorData);
      }
    } catch (error) {
      console.error("error: ", error);
    } finally {
      reset();
    }
  };

  return (
    <section className="absolute inset-0 h-full w-full bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]">
      {/* header */}
      <nav className="bg-[#36454F] flex justify-between items-center px-10 py-3">
        <h2 className="text-white font-bold text-xl">Todos</h2>
        <NavLink to="/login">
          <button className="bg-[#017bfe] rounded px-3 py-2 text-white">
            Sign in
          </button>
        </NavLink>
      </nav>
      {/* register body */}
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="flex flex-col h-auto min-w-[400px] border rounded">
          <p className="text-center py-2 font-semibold bg-[#f6f7f6] text-xl">
            Register
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
        {/* Notification */}
        {showNotification && (
          <div className="fixed top-24 right-0 mb-4 mr-4 bg-green-500 text-white py-2 px-4 rounded">
            You have successfully registered!
          </div>
        )}
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
