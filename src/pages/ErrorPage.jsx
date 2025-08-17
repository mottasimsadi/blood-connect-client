import { Link, useLocation } from "react-router";
import animation from "../assets/PageNotFound404.json";
import Lottie from "lottie-react";
import { useEffect } from "react";

const ErrorPage = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: Page not found →", location.pathname);
  }, [location.pathname]);

  return (
    <div className="bg-white min-h-screen flex flex-col justify-center items-center px-4 py-8">
      <div className="max-w-3xl">
        <Lottie animationData={animation} loop={true} />
      </div>

      <div className="text-center space-y-8 max-w-2xl">
        <p className="text-lg leading-relaxed text-black">
          The page at
          <code className="px-2 py-1 rounded mx-1 text-[#ef4343]">
            {location.pathname}
          </code>
          doesn't exist or has been moved.
        </p>

        <div className="pt-4">
          <Link to="/" aria-label="Return to home page">
            <button className="px-8 py-3 rounded-lg font-semibold text-lg shadow-md text-[#ef4343] border cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 hover:bg-[#ef4343] hover:text-white">
              ← Return to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
