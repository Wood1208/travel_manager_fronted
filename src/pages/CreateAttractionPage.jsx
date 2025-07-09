import axios from 'axios';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { motion } from "framer-motion"; 

import { Input } from '../components/Input';
import { House, Image, Book, Text, Tag } from "lucide-react";
import { Navbar } from '../components/ui/navbar';
import { FloatingShape } from '../components/FloatingShape';

const CreateAttractionPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    description: '',
    category: '',
    tags: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 表单字段变化时更新状态
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 校验表单
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = '景点名称不能为空';
    if (!formData.imageUrl) newErrors.imageUrl = '景点图片链接不能为空';
    if (!formData.category) newErrors.category = '分类不能为空';
    if (!formData.tags) newErrors.tags = '标签不能为空';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(validateForm()) {
      setIsSubmitting(true);
      try{
        const response = await axios.post('http://localhost:5000/attraction/create-attraction', formData); 
        if(response.status === 201) {
          toast.success("景点创建成功！");
        } else {
          toast.error(response.data.error || "提交失败，请稍后再试");
        }
      } catch(error) {
        console.error(error);
        toast.error('网络错误，请稍后再试');
      } finally {
        setIsSubmitting(false);
      }
    }
  }

  return (
    <>
      <Navbar />
      <div className='w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-green-900
	  to-emerald-900 relative overflow-hidden'>
        <FloatingShape
          color="bg-green-500"
          size='w-64 h-64'
          top='-5%'
          left='10%'
          delay={0}
        />
        <FloatingShape 
          color="bg-emerald-500"
          size='w-48 h-48'
          top='70%'
          left='80%'
          delay={5}
        />
        <FloatingShape 
          color="bg-lime-500"
          size='w-32 h-32'
          top='40%'
          left='-10%'
          delay={2}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className='max-w-2xl w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'>
            <div className='p-8'>
              <h2 className='text-3xl font-bold mb-6 text-center text-green-400/80'>
                创建景点
              </h2>
              <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-gray-800/50 p-6 rounded-lg shadow-lg">
                {/* 景点名称 */}
                <Input
                  icon={House}
                  name="name"
                  type="text"
                  placeholder="请输入景点名称"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
                {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

                {/* 景点图片链接 */}
                <Input
                  icon={Image}
                  name="imageUrl"
                  type="url"
                  placeholder="请输入景点图片链接"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  required
                />
                {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl}</p>}

                {/* 景点描述 */}
                <Input
                  icon={Book}
                  name="description"
                  type="text"
                  placeholder="请输入景点描述（可选）"
                  value={formData.description}
                  onChange={handleChange}
                />

                {/* 分类 */}
                <Input
                  icon={Text}
                  name="category"
                  type="text"
                  placeholder="请输入景点分类"
                  value={formData.category}
                  onChange={handleChange}
                  required
                />
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}

                {/* 标签 */}
                <Input
                  icon={Tag}
                  name="tags"
                  type="text"
                  placeholder="请输入标签（用中文逗号分隔）"
                  value={formData.tags}
                  onChange={handleChange}
                  required
                />
                {errors.tags && <p className="text-red-500 text-sm">{errors.tags}</p>}

                {/* 提交按钮 */}
                <button
                  type="submit"
                  className="w-full mt-4 py-2 px-4 bg-green-500 rounded-lg text-white font-semibold hover:bg-green-600 focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '正在创建...' : '创建景点'}
                </button>
              </form>
            </div>
        </motion.div>
      </div>
    </>
  );
};

export default CreateAttractionPage;
