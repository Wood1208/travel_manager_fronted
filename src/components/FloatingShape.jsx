import { motion } from 'framer-motion';

export const FloatingShape = ({
  color,
  size,
  top,
  left,
  delay
}) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20`}
      style={{ top, left, filter: 'blur(20px)', }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay
      }}
      aria-hidden='true'
    />
  )
}