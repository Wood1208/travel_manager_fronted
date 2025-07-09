import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Calendar1, House, Menu, Settings } from "lucide-react";

import { useIsMobile } from "../../hooks/useIsMobile";
import { useScrollDirection } from "../../hooks/useScrollDirection";
import { Sidebar } from "./sidebar";
import { Logo } from "../Logo";
import { useAuthStore } from "../../store/authStore";

export const Navbar = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  // 使用自定义 hook 来检测是否是手机屏幕
  const isMobile = useIsMobile();
  
  // 使用自定义 hook 获取滚动方向
  const { direction, isTop } = useScrollDirection();
  const isHidden = direction === "down";

  // 登出
  const { logout } = useAuthStore();
  const handleLogout = async (e) => {
    e.preventDefault();
    await logout();

    navigate('/');
  }

  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  const navigate = useNavigate();
  const handleLoginClick = () => {
    navigate('/login');
  }

  return (
    <div
      className={`fixed top-0 w-full h-14 px-2 z-10 shadow-sm flex items-center bg-black/70 transition duration-500 ${
        isHidden ? "-translate-y-full" : "translate-y-0"
      } ${isTop ? "bg-transparent" : ""}`}
    >
      <div className="md:max-w-screen-2xl mx-auto flex items-center w-full justify-between">
        <Logo />
        <div className="flex items-center md:hidden text-gray-200/80 font-semibold ml-auto">
          {/* phone */}
          <div
            className="flex items-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6 mr-2" />
          </div>
          <Sidebar isOpen={isOpen} onClosed={handleCloseSidebar} />
        </div>
        <div className="flex items-center space-x-6 text-gray-200/80 font-semibold">
          <div>
            {/* 显示登录状态 */}
            {isAuthenticated ? (
              <div className="flex flex-row space-x-2">
                <p>欢迎回来, {user?.username}</p> {/* 显示用户的用户名 */}
                <button 
                  onClick={handleLogout}
                  className="hover:text-sky-400 cursor-pointer"
                >
                  注销
                </button>
              </div>
            ) : (
              <div className="flex flex-row space-x-2">
                <p>未登录</p>
                <button 
                  onClick={handleLoginClick}
                  className="hover:text-sky-400 cursor-pointer"
                >
                  登录
                </button>
              </div>
            )}
          </div>
          <Link
            to="/"
            className={`md:flex group items-center cursor-pointer hover:text-gray-200 transition relative ${
              isMobile ? "hidden" : "block"
            }`}
          >
          <House className="h-5 w-5 mr-2 text-gray-200/80" />
          <p className="text-gray-200/80">首页</p>
          <div className="absolute bottom-[-4px] left-0 h-[3px] bg-white duration-300 w-0 group-hover:w-full transition-all" />
          </Link>
          {/* 只在 isAuthenticated 为 true 时显示 */}
          {isAuthenticated && (
            <>
              <Link
                to="/UserReservations"
                className={`md:flex group items-center cursor-pointer hover:text-gray-200 transition relative ${
                  isMobile ? "hidden" : "block"
                }`}
              >
                <Calendar1 className="h-5 w-5 mr-2 text-gray-200/80" />
                <p className="text-gray-200/80">个人预约</p>
                <div className="absolute bottom-[-4px] left-0 h-[3px] bg-white duration-300 w-0 group-hover:w-full transition-all" />
              </Link>
              <Link
                to="/UserFavorites"
                className={`md:flex group items-center cursor-pointer hover:text-gray-200 transition relative ${
                  isMobile ? "hidden" : "block"
                }`}
              >
                <Box className="h-5 w-5 mr-2 text-gray-200/80" />
                <p className="text-gray-200/80">个人收藏</p>
                <div className="absolute bottom-[-4px] left-0 h-[3px] bg-white duration-300 w-0 group-hover:w-full transition-all" />
              </Link>
            </>
          )}
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className={`md:flex group items-center cursor-pointer hover:text-gray-200 transition relative ${
                isMobile ? "hidden" : "block"
              }`}
            >
              <Settings className="h-5 w-5 mr-2 text-gray-200/80" />
              <p className="text-gray-200/80">管理景点</p>
              <div className="absolute bottom-[-4px] left-0 h-[3px] bg-white duration-300 w-0 group-hover:w-full transition-all" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
