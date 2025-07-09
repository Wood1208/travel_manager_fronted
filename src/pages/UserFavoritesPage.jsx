import axios from "axios";
import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

import { Navbar } from '../components/ui/navbar';
import { Footer } from '../components/ui/footer';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from "react-hot-toast";

const UserFavoritesPage = () => {
  const token = localStorage.getItem('authToken');
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 获取用户收藏的景点数据
  useEffect(() => {
    if (isAuthenticated) {
      axios
        .get("http://localhost:5000/user/getUserFavorites", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
          setFavorites(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  const handleUnfavorite = async (attractionId) => {
    try {
      const response = await axios.put(`http://localhost:5000/user/removeFavorite/${attractionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    
      // 检查响应的状态码
      if (response.status === 200) {
        // 如果成功，更新页面记录
        setFavorites(prevFavorites => prevFavorites.filter(attraction => attraction.id !== attractionId));
        toast.success("取消收藏成功~");
      } else {
        toast.error("取消收藏失败，请稍后再试！");
      }
    } catch(error) {
      console.log("移除收藏时错误:" + error);
      toast.error("取消收藏失败，请稍后再试！");
    }
  };

  const handleViewDetails = (attractionId) => {
    navigate(`/attraction/${attractionId}`)
  };

  if (loading) {
    return <div><LoadingSpinner /></div>;
  }

  return (
  <>
    <Navbar />
    <div className="flex flex-col min-h-screen relative w-full p-32 bg-gradient-to-br from-gray-800 via-gray-600 to-gray-800">
      <h1 className="flex text-3xl text-white font-semibold mt-5 mb-5">
        我的收藏景点
      </h1>
      
      {/* 如果 favorites 数组为空，显示提示信息 */}
      {favorites.length === 0 ? (
        <div className="text-white text-xl">你没有收藏任何景点</div>
      ) : (
        <div className="space-y-4">
          {favorites.map((attraction) => (
            <div
              key={attraction.id}
              className="flex h-32 items-center justify-between p-4 px-8 bg-gray-800 rounded-lg shadow-md"
            >
              <div className="flex items-center space-x-4">
                <img
                  src={attraction.imageUrl}
                  alt={attraction.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold text-white">{attraction.name}</h2>
                  <p className="text-sm text-gray-400 truncate max-w-3xl">{attraction.description}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleUnfavorite(attraction.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer"
                >
                  取消收藏
                </button>
                <button
                  onClick={() => handleViewDetails(attraction.id)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                >
                  查看详细信息
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    <Footer />
  </>
  );
};

export default UserFavoritesPage;
