import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion"; 
import React, { useEffect, useState } from "react";

import { Input } from "../components/Input";
import { Calendar, Ticket } from 'lucide-react';
import { Navbar } from "../components/ui/navbar";
import { useParams } from "react-router-dom";

const UpdateTicketsPage = () => {
  const { id } = useParams(); // 景点id
  const [tickets, setTickets] = useState([]);
  const [date, setDate] = useState("");
  const [totalTickets, setTotalTickets] = useState(0);
  const [newTicketsMap, setNewTicketsMap] = useState({}); // 用对象来存储每个ticket的新增票数

  const [formData, setFormData] = useState({
    date: '',
    totalTickets: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 获取景点门票数据
  useEffect(() => {
    axios.get(`http://localhost:5000/attraction/getAttractionById/${id}`)
      .then(response => {
        const attractionData = response.data;
        setTickets(attractionData.tickets);
      })
      .catch(error => {
        console.log('Error fetching attraction details:', error);
      });
  }, [id]);

  // 表单字段变化时更新状态
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 更新特定门票的新增票数
  const handleTicketCountChange = (ticketId, value) => {
    setNewTicketsMap((prevMap) => ({
      ...prevMap,
      [ticketId]: value,
    }));
  };
  
  // 校验表单，防止输入负数
  const validateCreateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = '门票日期不能为空!';
    if (!formData.totalTickets || formData.totalTickets <= 0) {
      newErrors.totalTickets = '门票数量必须为正整数!';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 创建门票记录
  const createTicket = async (e) => {
    e.preventDefault();
    if (validateCreateForm()) {
      setIsSubmitting(true);
      try {
        const response = await axios.post(`http://localhost:5000/attraction/create-attractionWithTicket/${id}`, formData);
        if (response.status === 201) {
          toast.success("门票记录创建成功！");
          setTickets([...tickets, response.data.ticket]);
        } else {
          toast.error(response.data.error || "提交失败，请稍后再试");
        }
      } catch (error) {
        console.log(error);
        toast.error('网络错误，请稍后再试');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 修改剩余票数
  const addTickets = async (ticketId, date) => {
    const newTicketCount = newTicketsMap[ticketId]; // 获取当前ticket的票数
    if (newTicketCount <= 0) {
      toast.error('添加票数必须为正整数!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.put(`http://localhost:5000/attraction/update-TicketForDay/${id}`, {
        date: date,
        newTickets: newTicketCount,
      });
      if (response.status === 200) {
        toast.success('门票记录已更新');
        setTickets(tickets.map(ticket => ticket.id === ticketId ? response.data.ticket : ticket));
      } else {
        toast.error(response.data.error || "更新失败，请稍后再试");
      }
    } catch (error) {
      console.log(error);
      toast.error('网络错误，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 删除门票记录
  const deleteTicket = async (ticketId, date) => {
    setIsSubmitting(true);
    try {
      const response = await axios.put(`http://localhost:5000/attraction/delete-TicketForDay/${id}`, {
        date
      });
      if (response.status === 200) {
        toast.success('门票记录已删除');
        setTickets(tickets.filter(ticket => ticket.id !== ticketId));
      } else {
        toast.error(response.data.error || "删除失败，请稍后再试");
      }
    } catch (error) {
      console.log(error);
      toast.error('网络错误，请稍后再试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} 
          className="flex flex-col max-w-7xl w-full bg-gray-800 bg-opacity-50 
          backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <h2 className="text-3xl text-gray-200 font-semibold">
              景点门票信息管理
            </h2>
            <h3 className="text-lg text-gray-400 mt-3">
              （ PS： 不能创建相同日期的门票，否则自动拦截！）
            </h3>
            <div className="flex flex-row items-center justify-between space-x-4 mt-6">
              <div className="flex space-x-6">
                <div>
                  <p className="text-gray-200 text-xl font-semibold mb-1">选择日期：</p>
                  <Input icon={Calendar} type="date" name="date" value={formData.date} onChange={handleChange} placeholder="选择日期" />
                </div>
                <div>
                  <p className="text-gray-200 text-xl font-semibold mb-1">填写票数：</p>
                  <Input icon={Ticket} type="number" name="totalTickets" value={formData.totalTickets} onChange={handleChange} placeholder="总票数" />
                </div>
              </div>
              <button 
                onClick={createTicket} 
                className="py-2 px-6 h-10 bg-green-500 text-gray-200 font-semibold rounded-lg hover:bg-green-700 transition cursor-pointer" 
                disabled={isSubmitting}
              >
                创建门票记录
              </button>
            </div>
            {errors.totalTickets && <p className="text-red-500 mt-2">{errors.totalTickets}</p>}
            {errors.date && <p className="text-red-500 mt-2">{errors.date}</p>}
          </div>

          {/* 显示已创建的门票记录 */}
          <div className="p-8 space-y-6">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="flex justify-between items-center bg-gray-500/50 p-4 rounded-lg shadow-md">
                <div className="flex flex-row space-x-4 text-gray-200 text-lg font-semibold">
                  <div>景点日期: {new Date(ticket.date).toISOString().split('T')[0]}</div>
                  <div>剩余票数: {ticket.remainingTickets}</div>
                  <div>人流量: {ticket.currentFlow}</div>
                </div>
                <div className="flex flex-row items-center space-x-4">
                  <div>
                    <p className="text-gray-200 text-xl font-semibold mb-2">修改门票数量：</p>
                    <Input 
                      icon={Ticket} 
                      type="number" 
                      value={newTicketsMap[ticket.id]} 
                      onChange={(e) => handleTicketCountChange(ticket.id, Number(e.target.value))} 
                      placeholder="添加票数" 
                    />
                  </div>
                  <button 
                    onClick={() => addTickets(ticket.id, ticket.date)} 
                    className="py-2 px-6 bg-blue-500 text-gray-200 font-semibold rounded-lg hover:bg-blue-700 transition cursor-pointer" 
                    disabled={isSubmitting}
                  >
                    修改门票
                  </button>
                  <button 
                    onClick={() => deleteTicket(ticket.id, ticket.date)} 
                    className="py-2 px-6 bg-red-500 text-gray-200 font-semibold rounded-lg hover:bg-red-700 transition cursor-pointer" 
                    disabled={isSubmitting}
                  >
                    删除门票
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
};


export default UpdateTicketsPage;
