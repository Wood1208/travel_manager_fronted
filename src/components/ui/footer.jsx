export const Footer = () => {
  return (
    <div className="w-full h-auto px-2 z-10 bg-gradient-to-br from-gray-900 via-green-900	to-emerald-900
    flex items-center justify-center">
      <div className="md:max-w-screen-2xl mx-auto flex flex-col items-center
      justify-center space-y-2 mb-10 mt-5">
        <p className="text-base text-white mt-6">
          ©2024 By Wood——GXNU的未来之星
        </p>
        <p className="text-base text-white flex gap-x-2">
          框架:
          <a 
            href="https://nextjs.org/"
            className="text-gray-200 hover:text-blue-400 transition hover:underline">
            Vite + React + tailwindcss
          </a>
          主题:
          <a 
            href="https://butterfly.js.org/"
            className="text-gray-200 hover:text-blue-400 transition hover:underline">
            究极混搭风格
          </a>
        </p>
        <p className="text-base text-white">
          Thank for you support~
        </p>
      </div>
    </div>
  );
};

