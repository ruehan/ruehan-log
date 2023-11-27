import { useEffect, useRef, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { marked } from 'marked';
import {motion, AnimatePresence} from 'framer-motion'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: posts, error } = useSWR('/api/get-post', fetcher);
  const [selectedType, setSelectedType] = useState('테스트');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newIndex: any) => {
    setCurrent(newIndex);
    setDirection(newIndex > current ? 1 : 0);
  }

  useEffect(() => {
    console.log(session)
    if (status !== 'loading' && !session) {
      // signIn();
    }
  }, [session, status, router]);

  if (status === 'loading' || !session) {
    return <div>Loading...</div>;
  }

  if(!posts){
    return <div>Loading...</div>
  }

  const types = new Set(posts.getPost.map((post: any) => post.type));
  const filteredPosts = posts.getPost.filter((post: any) => post.type == selectedType);
  
  const itemVariants = {
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
    }
  };

  const onClickType = (type: any) => {
    setSelectedType(type)
    setCurrent(0)
  }

  const variants = {
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  if(!filteredPosts){
    return <div>filteredPosts is Loading...</div>
  }

  return (
    <>   
    <div className="flex w-full items-center justify-center" style={{height: '100vh'}}>
      <motion.div 
        className="flex flex-col w-36 items-center">      
        {[...types].map((type: any) => (
          <motion.div 
            key={type} 
            className="h-36 w-32  mt-4 bg-white text-center shadow-lg border rounded-md flex items-center justify-center" 
            onClick={() => onClickType(type)}
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.95}}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            >{type}
          </motion.div>
        ))}

      </motion.div>
  
      <div className="flex w-5/6 justify-center h-3/4 overflow-hidden">
        <div className="relative overflow-scroll w-3/4 flex flex-col justify-between items-center bg-white shadow-lg rounded-lg m-5 font-serif text-gray-800">
          <AnimatePresence initial={false}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                // x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: .25 }
              }}
              style={{position: 'absolute', width: '100%'}}>
                {
                  <div key={filteredPosts[current].id} className="">
                    <div className="px-6 py-4 bg-blue-100">
                      <div className="font-bold text-xl mb-2">{filteredPosts[current].title}</div>
                      <div
                        className="text-gray-700 text-base"
                        dangerouslySetInnerHTML={{ __html: marked.parse(filteredPosts[current].content || '') }}
                      />
                    </div>
                  </div>
                }

            </motion.div>
          </AnimatePresence>
          <div className="w-1/3 flex justify-around fixed bottom-5 ">
            <button onClick={() => 
              paginate((current - 1 + filteredPosts.length) % filteredPosts.length)}>이전</button>
            {current + 1}
            <button onClick={() => paginate((current + 1) % filteredPosts.length)}>다음</button>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}
