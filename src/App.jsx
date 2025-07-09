import { useEffect } from "react";
import { useAuthStore } from "./store/authStore";
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from "react-router-dom";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import AttractionDetailPage from "./pages/AttractionDetailPage";

import LoadingSpinner from './components/LoadingSpinner';
import UserReservationsPage from "./pages/UserReservationsPage";
import UserFavoritesPage from "./pages/UserFavoritesPage";
import AdminControllerPage from "./pages/AdminControllerPage,";
import CreateAttractionPage from "./pages/CreateAttractionPage";
import UpdateAttractionPage from "./pages/UpdateAttractionPage";
import UpdateTicketsPage from "./pages/UpdateTicketsPage";

function App() {
  // 获取用户信息
  const checkAuth = useAuthStore(state => state.checkAuth);
  const isCheckingAuth = useAuthStore(state => state.isCheckingAuth);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const user = useAuthStore(state => state.user);

  // 执行checkAuth函数
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if(isCheckingAuth) {
    return <div><LoadingSpinner /></div>
	}

  return (
    <div className="">
      <Routes>
        <Route 
          path="/" 
          element={
            <DashboardPage />
          } 
        />
        <Route 
          path="/attraction/:id"
          element={ <AttractionDetailPage /> }
        />
        <Route 
          path="/signup" 
          element={ <SignUpPage /> } 
        />
        <Route 
          path="/login" 
          element=
          { <LoginPage /> } 
        />
        {/* user保护路由 */}
        <Route 
          path="/UserFavorites"
          element={isAuthenticated ? <UserFavoritesPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/UserReservations"
          element={isAuthenticated ? <UserReservationsPage /> : <Navigate to="/login" replace />} 
        />
        {/* 添加管理员路由，只有角色为ADMIN的用户才能访问 */}
        <Route 
          path="/admin"
          element={isAuthenticated && user.role === 'ADMIN' ? <AdminControllerPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/admin/update-attraction/:id"
          element={isAuthenticated && user.role === 'ADMIN' ? <UpdateAttractionPage /> : <Navigate to="/login" replace />} 
        />
        <Route
          path="/admin/create-attraction/:id"
          element={isAuthenticated && user.role === 'ADMIN' ? <CreateAttractionPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/admin/update-tickets/:id"
          element={isAuthenticated && user.role === 'ADMIN' ? <UpdateTicketsPage /> : <Navigate to="/login" replace />}
        />
        {/* catch all routes */}
        <Route 
          path="*"
          element={
            <Navigate to='/' replace />
          } 
        />
      </Routes>

      <Toaster />
    </div>
  )
}

export default App
