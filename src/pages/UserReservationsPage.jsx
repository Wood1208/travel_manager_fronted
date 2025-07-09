import axios from "axios";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

import LoadingSpinner from "../components/LoadingSpinner";
import { Navbar } from "../components/ui/navbar";
import { Footer } from "../components/ui/footer";
import toast from "react-hot-toast";

const UserReservationsPage = () => {
  const token = localStorage.getItem('authToken');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // 获取数据
  useEffect(() => {
    if(isAuthenticated) {
      axios.get("http://localhost:5000/user/getUserReservations", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((response) => {
        setReservations(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching Reservations:", error);
        setLoading(false);
      });
    }
  }, [isAuthenticated]);

  // 取消预约
  const handleUnReservations = async (attractionId, date) => {
    try {
      const response = await axios.put(`http://localhost:5000/user/removeReservation/${attractionId}`, {date}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 检查响应的状态码
      if (response.status === 200) {
        // 如果成功，更新页面记录
        setReservations(prevReservations => prevReservations.filter(reservation => reservation.attractionId !== attractionId));
        toast.success("取消预约成功~");
      } else {
        toast.error("取消预约失败，请稍后再试！");
      }
    } catch(error) {
      console.log("移除预约时错误:" + error);
      toast.error("取消预约失败，请稍后再试！");
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
          我的预约景点记录
        </h1>
        
        {/* 如果 reservations 数组为空，显示提示信息 */}
        {reservations.length === 0 ? (
          <div className="text-white text-xl">你没有预约任何景点</div>
        ) : (
          <div className="space-y-4">
            {reservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex h-32 items-center justify-between p-4 px-8 bg-gray-800 rounded-lg shadow-md"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={reservation.attractionImageUrl}
                    alt={reservation.attractionName}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-white">{reservation.attractionName}</h2>
                    <p className="text-sm text-gray-400 truncate max-w-3xl">
                      {new Date(reservation.reservationDate).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                  <p className="text-emerald-300 text-xl font-semibold ml-2">
                    {reservation.status}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleUnReservations(reservation.attractionId, reservation.reservationDate)}
                    className="px-4 py-2 bg-red-500 text-gray-200 font-semibold rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    取消预约
                  </button>
                  <button
                    onClick={() => handleViewDetails(reservation.attractionId)}
                    className="px-4 py-2 bg-blue-500 text-gray-200 font-semibold rounded-md hover:bg-blue-700 cursor-pointer"
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

export default UserReservationsPage;
