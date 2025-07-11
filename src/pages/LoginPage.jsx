import { useState } from "react";
import { motion } from "framer-motion"; 
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Input } from "../components/Input";
import { Loader, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { FloatingShape } from "../components/FloatingShape";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

	const navigate = useNavigate();
	const location = useLocation();

	const { login, error, isLoading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();
		await login(email, password);

		try {
			toast.success("成功登录！");
			const from = location.state?.from || '/';
			navigate(from);
		} catch (error) {
			toast.error("登录失败！请稍后再试");
			console.log(error);
		}
  }

  return (
	<div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900
	to-emerald-900 flex items-center justify-center relative overflow-hidden">
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
			className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'
		>
			<div className='p-8'>
				<h2 className='text-3xl font-bold mb-6 text-center text-green-400/80'>
					欢迎回来
				</h2>

				<form onSubmit={handleLogin}>
					<Input
						icon={Mail}
						type='email'
						placeholder='邮箱地址'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					/>

					<Input
						icon={Lock}
						type='password'
						placeholder='密码'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>

					<div className='flex items-center mb-6'>
						<Link to='/forgot-password' className='text-sm text-green-500 hover:underline'>
							忘记密码?
						</Link>
					</div>
					{error && <p className='text-red-500 font-semibold mb-2'>{error}</p>}

					<motion.button
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						className='w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200'
						type='submit'
						disabled={isLoading}
					>
						{isLoading ? <Loader className='w-6 h-6 animate-spin mx-auto' /> : "登录"}
					</motion.button>
				</form>
			</div>
			<div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					还没有注册账号？{" "}
					<Link to='/signup' className='text-green-500 hover:underline'>
						注册
					</Link>
				</p>
			</div>
		</motion.div>
	</div>
	);
}

export default LoginPage;