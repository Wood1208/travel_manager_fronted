import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { ImagesSlider } from "../../src/components/ui/image-slider";
import { CardBody, CardContainer, CardItem } from "../../src/components/ui/3d-card";
import { Footer } from "../components/ui/footer";
import { Navbar } from "../components/ui/navbar";

const DashboardPage = () => {
	// 这里是展示大图的url
  const images = [
    "https://tse1-mm.cn.bing.net/th/id/OIP-C.6F8of-TVH6rV1TbtXjnPpQAAAA?w=211&h=180&c=7&r=0&o=7&dpr=1.7&pid=1.7&rm=3",
    "https://tse2-mm.cn.bing.net/th/id/OIP-C.mVuDVhXq37UFHgo7V9F4nwHaEJ?w=290&h=181&c=7&r=0&o=7&dpr=1.7&pid=1.7&rm=3",
    "https://tse4-mm.cn.bing.net/th/id/OIP-C.zr_z0cKNlkXIgjDDnAP4ZAHaFj?w=265&h=199&c=7&r=0&o=7&dpr=1.7&pid=1.7&rm=3"
  ];

	const [attractions, setAttractions] = useState([]);
	// 处理进入详细页面
	const navigate = useNavigate();
  const handleGoClick = (id) => {
    navigate(`/attraction/${id}`);
  };

	/*
	// 缓存
	const CACHE_EXPIRATION_TIME = 3600000; // 1小时（单位：毫秒）
	useEffect(() => {
    // 尝试从 localStorage 中获取缓存数据
    const cachedAttractions = localStorage.getItem("attractions");
		const cachedTime = localStorage.getItem(`attraction_time`);

		// 检查缓存是否存在并且没有过期
    if (cachedAttractions && cachedTime && (Date.now() - cachedTime < CACHE_EXPIRATION_TIME)) {
      setAttractions(JSON.parse(cachedAttractions));
    } else {
      // 如果没有缓存数据，则从服务器获取
      axios.get('http://localhost:5000/attraction/getAttractionList')
        .then(response => {
          setAttractions(response.data);
          // 将获取的数据存储到 localStorage 中
          localStorage.setItem("attractions", JSON.stringify(response.data));
					localStorage.setItem(`attraction_time`, Date.now());
        })
        .catch(error => {
          console.log('Error fetching attractions:', error);
        });
    }
  }, []);
	*/

	useEffect(() => {
		axios.get('http://localhost:5000/attraction/getAttractionList')
			.then(response => {
				setAttractions(response.data);
			})
			.catch(error => {
				console.log('Error fetching attractions:', error);
			});
  }, []);

	// 转换为符合需求的格式
	const cards = attractions.map(attraction => ({
		title: attraction.name,
		category: attraction.category,
		src: attraction.imageUrl,
		id: attraction.id
	}));

  return (
    <div className="relative w-full h-screen">

			<Navbar />

      {/* Image Slider */}
      <div className="w-full h-full">
        <ImagesSlider className="w-full h-full object-cover" images={images} />
      </div>

      {/* Floating Panel */}
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="absolute top-[50%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-1/2 sm:w-2/3 text-center"
      >
        <motion.p className="font-bold text-xl sm:text-6xl text-center text-white mb-5">
          欢迎来到桂林市 <br />
        </motion.p>
				<motion.p className="font-bold text-xl sm:text-6xl text-center text-white">
          纵享山水之秀 <br />
        </motion.p>
      </motion.div>
			{/* 内容 */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 p-20 bg-gradient-to-br from-gray-900 via-gray-800
	to-gray-900">
			{cards.map((card) => (
				<CardContainer className="inter-var" key={card.id}>
					<CardBody className="bg-sky-100 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
						<CardItem
							translateZ="50"
							className="text-xl font-bold text-neutral-600 dark:text-white"
						>
							{card.title}
						</CardItem>
						<CardItem
							as="p"
							translateZ="60"
							className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
						>
							{card.category}
						</CardItem>
						<CardItem translateZ="100" className="w-full mt-4">
							<img
								src={card.src}
								height="1000"
								width="1000"
								className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
								alt="thumbnail"
							/>
						</CardItem>
						<div className="flex justify-between items-center mt-20">
							<CardItem
								translateZ={20}
								as="button"
								onClick={() => handleGoClick(card.id)} // 在点击按钮时进行路由跳转
								className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
							>
								GO
							</CardItem>
						</div>
					</CardBody>
				</CardContainer>
			))}
		</div>
		
		<Footer />
  </div>
  );
};

export default DashboardPage;
