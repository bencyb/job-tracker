// // import { Link, useNavigate } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import API from "../services/api";

// // export default function Navbar() {
// //   const navigate = useNavigate();

// //   const [token, setToken] = useState(localStorage.getItem("token"));
// //   const [darkMode, setDarkMode] = useState(
// //     localStorage.getItem("theme") === "dark"
// //   );

// //   useEffect(() => {
// //     setToken(localStorage.getItem("token"));
// //   }, []);

// //   // const handleLogout = () => {
// //   //   localStorage.removeItem("token");
// //   //   localStorage.removeItem("user");

// //   //   setToken(null);

// //   //   navigate("/login");
// //   // };
// //   const handleLogout = async () => {
// //   try {
// //     const refresh = localStorage.getItem("refresh");

// //     await API.post("logout/", {
// //       refresh,
// //     });

// //   } catch (error) {
// //     console.log(error);
// //   } finally {
// //     localStorage.removeItem("token");
// //     localStorage.removeItem("refresh");
// //     localStorage.removeItem("user");

// //     navigate("/login");
// //   }
// // };

// //   return (
// //     <div className="flex justify-between items-center p-4 bg-gray-900 text-white">
// //       <h1 className="text-xl font-bold">Job Tracker</h1>

// //       <div className="flex gap-4 items-center">
// //         <Link className="hover:text-gray-300" to="/">
// //           Home
// //         </Link>

// //         {token && (
// //           <>
// //             <Link className="hover:text-gray-300" to="/dashboard">
// //               Dashboard
// //             </Link>
// //             <Link to="/profile">
// //               <button className="bg-gray-700 text-white px-4 py-2 rounded-lg">
// //                 Profile
// //               </button>
// //             </Link>
// //           </>
// //         )}

// //         {!token ? (
// //           <>
// //             <Link className="hover:text-gray-300" to="/login">
// //               Login
// //             </Link>

// //             <Link className="hover:text-gray-300" to="/register">
// //               Register
// //             </Link>
// //           </>
// //         ) : (
// //           <button
// //             onClick={handleLogout}
// //             className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md"
// //           >
// //             Logout
// //           </button>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }

// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function Navbar() {
//   const [open, setOpen] = useState(false);

//   const navigate = useNavigate();

//   const user = JSON.parse(localStorage.getItem("user"));

//   const logout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");

//     navigate("/login");
//   };

//   return (
//     <nav className="bg-white dark:bg-gray-800 shadow px-6 py-4">
//       <div className="max-w-7xl mx-auto flex justify-between items-center">

//         {/* Logo */}
//         <h1 className="text-2xl font-bold text-indigo-600">
//           Job Tracker
//         </h1>

//         {/* Profile Dropdown */}
//         <div className="relative">

//           <button
//             onClick={() => setOpen(!open)}
//             className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg"
//           >
//             <img
//               src={
//                 user?.profile_image ||
//                 "https://i.pravatar.cc/40"
//               }
//               alt="profile"
//               className="w-10 h-10 rounded-full object-cover"
//             />

//             <span>{user?.username}</span>
//           </button>

//           {open && (
//             <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-50">

//               <Link
//                 to="/profile/username"
//                 className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 Update Username
//               </Link>

//               <Link
//                 to="/profile/password"
//                 className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 Change Password
//               </Link>

//               <Link
//                 to="/profile/image"
//                 className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 Upload Profile Image
//               </Link>

//               <button
//                 onClick={logout}
//                 className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 Logout
//               </button>

//             </div>
//           )}

//         </div>

//       </div>
//     </nav>
//   );
// }

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dropdownRef = useRef();

  // Safe user parsing
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = localStorage.getItem("token");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  // const logout = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("refresh");
  //   localStorage.removeItem("user");

  //   navigate("/login");
  // };
  const logout = async () => {

  try {

    const refresh =
      localStorage.getItem("refresh");

    await API.post(
      "logout/",
      {
        refresh,
      }
    );

  } catch (error) {

    console.log(error);

  } finally {

    // Clear storage
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");

    // Redirect
    navigate("/login");
  }
};

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold text-indigo-600">
            Job Tracker
          </h1>
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">

          {/* Public Links */}
          <Link
            to="/"
            className="text-gray-700 dark:text-gray-200 hover:text-indigo-600"
          >
            Home
          </Link>

          {token ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600"
              >
                Dashboard
              </Link>

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setOpen(!open)}
                  className="flex items-center gap-3 bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg"
                >
                  <img
                    src={
                      user?.profile_image ||
                      "https://i.pravatar.cc/40"
                    }
                    alt="profile"
                    className="w-10 h-10 rounded-full object-cover"
                  />

                  <span className="text-gray-800 dark:text-white">
                    {user?.username || "User"}
                  </span>
                </button>

                {open && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden z-50 border border-gray-200 dark:border-gray-700">

                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Profile
                    </Link>

                    <Link
                      to="/profile/username"
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Update Username
                    </Link>

                    <Link
                      to="/profile/password"
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Change Password
                    </Link>

                    <Link
                      to="/profile/image"
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Upload Profile Image
                    </Link>
                    <Link
                      to="/profile/resume"
                      className="block px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Upload Resume
                    </Link>

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 dark:text-gray-200 hover:text-indigo-600"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}