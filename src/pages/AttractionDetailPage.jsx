import axios from 'axios';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

import { Box, Button, Typography, Chip, Card } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import { Phone } from 'lucide-react';

import { Navbar } from '../components/ui/navbar';
import { Footer } from '../components/ui/footer';
import LoadingSpinner from '../components/LoadingSpinner';

const AttractionDetailPage = () => {
  const { id } = useParams();
  const [attraction, setAttraction] = useState(null);
  const [engagements, setEngagements] = useState(null); // 用于存储点赞、收藏和转发数量
  const [tickets, setTickets] = useState([]); // 用于存储景点预约数据
  const [isLiked, setIsLiked] = useState(false); //是否点赞
  const [isFavorited, setIsFavorited] = useState(false); //是否收藏

  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = localStorage.getItem('authToken');
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // 获取景点详情数据
  useEffect(() => {
    axios.get(`http://localhost:5000/attraction/getAttractionById/${id}`)
      .then(response => {
        const attractionData = response.data;
        setAttraction(attractionData);
        setEngagements(attractionData.engagements && attractionData.engagements[0]); // 设定互动数据
        setTickets(attractionData.tickets); // 设定预约数据
      })
      .catch(error => {
        console.log('Error fetching attraction details:', error);
      });
  }, [id]);

  // 前端获取是否收藏过该景点
  useEffect(() => {
    if (isAuthenticated) {
      axios.get(`http://localhost:5000/user/getUserFavoriteById/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
          setIsFavorited(response.data.isFavorited);
        })
        .catch(error => {
          console.log('Error checking favorite status:', error);
        });
    }
    console.log(isFavorited);
  }, [id, isAuthenticated]);

  // 处理点赞
  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error("您还没有登录，请登录后再尝试!");
      return;
    }
     try {
      if (isLiked) {
        // 取消点赞
        await axios.put(`http://localhost:5000/user/decrementLike/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubmitting(true);
        setEngagements(prev => ({
          ...prev,
          likes: prev.likes - 1
        }));
        toast.success("已取消点赞~");
      } else {
        // 点赞
        await axios.put(`http://localhost:5000/user/incrementLike/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubmitting(true);
        setEngagements(prev => ({
          ...prev,
          likes: prev.likes + 1
        }));
      }
      setIsLiked(!isLiked); // 切换点赞状态
      toast.success("成功点赞！")
    } catch (error) {
      console.error('用户点赞发生错误:', error);
      toast.error("点赞失败，请稍后再试！");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理收藏
  const handleBookmark = async () => {
    if (!isAuthenticated) {
      toast.error("您还没有登录，请登录后再尝试!");
      return;
    }
    try {
      if (isFavorited) {
        // 取消收藏
        await axios.put(`http://localhost:5000/user/removeFavorite/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubmitting(true);
        setEngagements(prev => ({
          ...prev,
          favorites: prev.favorites - 1
        }));
        toast.success("已收藏点赞~");
      } else {
        // 收藏
        await axios.put(`http://localhost:5000/user/addFavorite/${id}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsSubmitting(true);
        setEngagements(prev => ({
          ...prev,
          favorites: prev.favorites + 1
        }));
      }
      setIsFavorited(!isFavorited); // 切换收藏状态
      toast.success("收藏该景点成功！");
    } catch (error) {
      console.error('用户收藏景点出现错误:', error);
      toast.error("收藏景点失败，请稍后再试！")
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理转发
  const handleShare = async () => {
  if (!isAuthenticated) {
    toast.error("您还没有登录，请登录后再尝试!");
    return;
  }
  try {
    await axios.put(`http://localhost:5000/user/incrementShare/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setIsSubmitting(true);
    setEngagements(prev => ({
      ...prev,
      shares: prev.shares + 1
    }));

    // 获取当前页面的 URL 或者指定的分享链接
    const shareLink = `${window.location.origin}/attraction/${id}`;
    // 复制链接到剪贴板
    await navigator.clipboard.writeText(shareLink);
    toast.success("链接已复制到剪贴板，可以分享给好友了！");
  } catch (error) {
    console.error('用户转发景点出现错误:', error);
    toast.error("转发失败，请稍后再试！");
  } finally {
    setIsSubmitting(false);
  }
};

  // 处理预约
  const handleReservation = async (date) => {
  if (!isAuthenticated) {
    toast.error("您还没有登录，请登录后再尝试!");
    return;
  }

  try {
    // 发送包含日期的请求
    await axios.post(`http://localhost:5000/user/addReservation/${id}`, { date }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setIsSubmitting(true);
    // 更新本地 tickets 状态中的相应门票数量
    setTickets(prevTickets => {
      return prevTickets.map(ticket => {
        // 如果是匹配的日期，减少剩余门票
        if (new Date(ticket.date).toISOString().split('T')[0] === date) {
          return {
            ...ticket,
            remainingTickets: ticket.remainingTickets - 1,
            currentFlow: ticket.currentFlow + 1, // 人流量增加
          };
        }
        return ticket;
      });
    });
      toast.success("成功预约该景点~");
    } catch (error) {
      console.log('用户预约景点出现错误', error);
      toast.error("预约失败，请稍后再试！");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!attraction) {
    return <div><LoadingSpinner /></div>;
  }

  return (
    <div className='flex flex-col min-h-screen relative w-full bg-gradient-to-br from-gray-800 via-gray-600 to-gray-800'>
      <Navbar />
      <main className="flex-1 mb-20 mt-32"> {/* 内容区域 */}
        <Box sx={{ maxWidth: 800, margin: '0 auto', padding: 2 }}>
          <Card sx={{ padding: 2, boxShadow: 3 }}>
            <img
              src={attraction.imageUrl}
              alt={attraction.name}
              style={{ width: '100%', height: 'auto', borderRadius: 8 }}
            />
            <Typography variant="h4" component="h1" sx={{ marginTop: 2 }}>
              {attraction.name}
            </Typography>
            {attraction.category && (
              <Typography variant="body1" color="textSecondary">
                {attraction.category}
              </Typography>
            )}
            <Typography variant="body1" sx={{ marginTop: 2 }}>
              {attraction.description}
            </Typography>

            <Box sx={{ marginTop: 2 }}>
              {attraction.tags?.map((tag, index) => (
                <Chip key={index} label={tag} sx={{ marginRight: 1, marginBottom: 1 }} />
              ))}
            </Box>

            {/* 显示点赞、收藏、转发数量 */}
            <Box sx={{ marginTop: 3, display: 'flex', gap: 2 }}>
              <Button
                variant={isLiked ? "outlined" : "contained"}
                color="primary"
                startIcon={<ThumbUpIcon />}
                onClick={handleLike}
                disabled={isSubmitting == true}
              >
                {isLiked ? `已点赞 ${engagements?.likes || 0}` : `点赞 ${engagements?.likes || 0}`}
              </Button>
              <Button
                variant={isFavorited ? "outlined" : "contained"}
                color="secondary"
                startIcon={<FavoriteIcon />}
                onClick={handleBookmark}
                disabled={isSubmitting == true}
              >
                {isFavorited ? `已收藏 ${engagements?.favorites || 0}` : `收藏 ${engagements?.favorites || 0}`}
              </Button>
              <Button 
                variant="contained" 
                color="default"
                startIcon={<ShareIcon />} 
                onClick={handleShare}
                disabled={isSubmitting == true}
              >
                转发 {engagements?.shares || 0}
              </Button>
            </Box>

            {/* 显示预约数据 */}
            <div className='mt-3 flex flex-col'>
              <h6 className='text-black/80 font-semibold text-xl mb-2'>目前开放门票情况：每个用户每个日期只能预约一次，否则自动拦截！</h6>
              {Array.isArray(tickets) && tickets.length > 0 ? (
                tickets.map((ticket, index) => {
                  // 格式化日期为 YYYY-MM-DD 格式
                  const formattedDate = new Date(ticket.date).toISOString().split('T')[0];
                  
                  return (
                    <div className='mt-2 ' key={index}>
                    预约日期: {formattedDate}, 可预约门票: {ticket.remainingTickets}, 人流量: {ticket.currentFlow}
                    <button
                      onClick={() => handleReservation(formattedDate)} 
                      className='ml-4 text-black/80 font-semibold border-2 rounded-2xl 
                      border-blue-400 bg-blue-300 hover:bg-blue-100 cursor-pointer'
                      disabled={ticket.remainingTickets <= 0 || isSubmitting == true}
                    >
                      预约
                    </button>
                  </div>
                  );
                })
              ) : (
                <Typography>暂无预约记录</Typography>
              )}
            </div>
          </Card>
        </Box>
      </main>
      <Footer /> {/* 页脚 */}
    </div>
  );
};

export default AttractionDetailPage;
