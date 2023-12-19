export const itemVariants = {
    hidden: { scale: 0, rotate: 0 },
    visible: {
      scale: 1,
      rotate: 360,
      transition: {
        type: "tween",
        stiffness: 260,
        damping: 20,
        duration: .75
      }
    },
    exit: {
      scale: 0,
      rotate: -360,
      transition: {
        type: "tween",
        stiffness: 260,
        damping: 20,
        duration: .75
      }
    }
  };


export const typeVariants = {
    hidden: { opacity: 0, x: -300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300, rotate: 180 },
};


export const variants = {
    enter: (direction: any) => {
        return {
        x: direction === 0 ? -1000 : 1000,
        opacity: 0,
        zIndex: 0,
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction: any) => {
        return {
        zIndex: 0,
        x: direction === 0 ? 1000 : -1000,
        opacity: 0
        };
    }
};