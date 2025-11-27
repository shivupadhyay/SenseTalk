import React from "react";
import { assets } from "../assets/assets";
import { Star } from "lucide-react";
import { SignIn } from "@clerk/clerk-react";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <img
        src={assets.BGImage}
        alt=""
        className="absolute top-0 left-0 -z-1 w-full h-full object-cover"
      />

      {/* Left Side : Branding  */}

      <div className="flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40">
        <img src={assets.SenseTalk} alt="" className="h-23 object-contain" />
        <div>
          <div className="flex items-center gap-3 mb-4 max-md:mt-10">
            {/* <img src={assets.group_users} alt="" className="h-8 md:h-10" /> */}
            <div>
              {/* <div className="flex">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 md:size-4.5 text-transparent fill-amber-500"
                    />
                  ))}
              </div> */}
              
            </div>
          </div>
          <h1 className="text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent">
            Discover people. Build connections. Create moments.
          </h1>
          <p className="text-xl md:text-2xl text-indigo-900 max-w-72 md:max-w-md">
            “Your gateway to a global community — SenseTalk.”
          </p>
        </div>
        <span className="md:h-10"></span>
      </div>
      {/* Right-side:login-form */}
      <div className="flex-1 flex items-center p-6 sm:p-10">
        <SignIn />
      </div>
    </div>
  );
};

export default Login;
