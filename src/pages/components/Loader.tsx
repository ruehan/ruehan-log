import { motion } from 'framer-motion';

const loaderVariants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
    },
  },
};

function LoadingComponent() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh', // 뷰포트 높이의 100%를 사용
    }}>
      <motion.div
        style={{
          width: 150,
          height: 150,
          borderRadius: '50%',
          border: '15px solid #e9e9e9',
          borderTop: '5px solid blue',
        }}
        variants={loaderVariants}
        animate="animate"
      />
    </div>
  );
}

export default LoadingComponent;
