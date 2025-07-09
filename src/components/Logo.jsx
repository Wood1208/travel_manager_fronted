import { Link } from "react-router-dom"

export const Logo = ({
  height,
  width
}) => {
  return (
    <Link
      to="/"
      className="flex space-x-4 cursor-pointer"
    >
      <img
        src="/vite.svg"
        alt="logo"
        height={height}
        width={width}
        className="hidden md:block"
      />
      <p className="text-2xl font-bold text-gray-200/80
      hover:text-gray-200 transition">
        桂旅之约
      </p>
    </Link>
  )
}