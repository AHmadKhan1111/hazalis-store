import { Outlet } from "react-router-dom";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      
      {/* Spline Wrapper */}
      <div className="relative w-1/2 h-screen overflow-hidden">
        <iframe
          className="w-full h-full"
          src="https://my.spline.design/zerogravityphysicslandingpage-UTd3peOTgZnmBzkLu8z2aCuv/"
        ></iframe>

        {/* Watermark Hide Overlay */}
        <div className="absolute bottom-4 right-4 w-40 h-10 bg-[#cbcccb]/90 backdrop-blur-md"></div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
