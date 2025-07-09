import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import toast from "react-hot-toast";
import LoadingSpinner from "../components/LoadingSpinner";
import { Navbar } from "../components/ui/navbar";
import { Footer } from "../components/ui/footer";

const AdminControllerPage = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [attractions, setAttractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 获取数据
  useEffect(() => {
    if(isAuthenticated) {
      axios
        .get("http://localhost:5000/attraction/getAttractionList")
        .then((response) => {
          setAttractions(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching favorites:", error);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  // 删除景点
  const handleDeleteAttraction = async (attractionId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/attraction/delete-attraction/${attractionId}`);
    
      // 检查响应的状态码
      if (response.status === 201) {
        // 如果成功，更新页面记录
        setAttractions(prevAttractions => prevAttractions.filter(attraction => attraction.id !== attractionId));
        toast.success("删除景点成功~");
      } else {
        toast.error("删除景点失败，请稍后再试！");
      }
    } catch(error) {
      console.log("删除景点时错误:" + error);
      toast.error("删除景点失败，请稍后再试！");
    }
  }

  // 跳转到修改
  const handleUpdateAttraction = (attractionId) => {
    navigate(`/admin/update-attraction/${attractionId}`);
  };

  // 跳转到新增
  const handleCreateAttraction = (attractionId) => {
    navigate(`/admin/create-attraction/${attractionId}`);
  }

  // 跳转到修改门票记录
  const handleUpdateTicket = (attractionId) => {
    navigate(`/admin/update-tickets/${attractionId}`);
  }

  // 查看详细信息
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
        <div className="flex flex-row items-center space-x-4">
          <h1 className="flex text-3xl text-white font-semibold mt-5 mb-5">
            管理景点
          </h1>
          <button
            onClick={handleCreateAttraction}
            className="h-10 px-4 py-2 bg-emerald-500 text-white font-semibold rounded-md hover:bg-emerald-700 cursor-pointer"
          >
            添加景点
          </button>
        </div>
        {/* 如果 attractions 数组为空，显示提示信息 */}
        {attractions.length === 0 ? (
          <div className="text-white text-xl">还没有创建任何景点</div>
        ) : (
          <div className="space-y-4">
            {attractions.map((attraction) => (
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
                    onClick={() => handleViewDetails(attraction.id)}
                    className="px-4 py-2 font-semibold bg-purple-500 text-white rounded-md hover:bg-purple-700 cursor-pointer"
                  >
                    详细信息
                  </button>
                  <button
                    onClick={() => handleDeleteAttraction(attraction.id)}
                    className="px-4 py-2 font-semibold bg-red-500 text-white rounded-md hover:bg-red-700 cursor-pointer"
                  >
                    删除景点
                  </button>
                  <button
                    onClick={() => handleUpdateAttraction(attraction.id)}
                    className="px-4 py-2 font-semibold bg-blue-500 text-white rounded-md hover:bg-blue-700 cursor-pointer"
                  >
                    修改景点
                  </button>
                  <button
                    onClick={() => handleUpdateTicket(attraction.id)}
                    className="px-4 py-2 font-semibold bg-orange-500 text-white rounded-md hover:bg-orange-700 cursor-pointer"
                  >
                    修改门票
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  )
};

export default AdminControllerPage;