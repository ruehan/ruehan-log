import { useEffect, useRef, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { marked } from 'marked';
import {motion, AnimatePresence} from 'framer-motion'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RiMenuFoldLine as MenuFoldIcon, RiMenuUnfoldLine as MenuUnFoldIcon } from "react-icons/ri";
import ReactPlayer from 'react-player';


const fetcher = (url: any) => fetch(url).then((res) => res.json());

// const TurndownService = require('turndown');

export default function Home() {
  // const turndown = new TurndownService()
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: posts, error } = useSWR('/api/get-post', fetcher);
  const [selectedType, setSelectedType] = useState('한달간의 여행 기록');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showType, setShowType] = useState(true);
  const contentRef = useRef(null);
  


  const paginate = (newIndex: any) => {
    setCurrent(newIndex);
    setDirection(newIndex > current ? 1 : 0);

  }

  useEffect(() => {
    console.log(session)
    if (status !== 'loading' && !session) {
      // router.push('/login')
    }
  }, [session, status, router]);

  // if (status === 'loading' || !session) {
  //   return <div>Loading...</div>;
  // }

  useEffect(() => {
    // 스크롤 위치를 상단으로 이동
    const element = document.getElementById('container');
    if (element) {
      element.scrollTop = 0;
    }
  }, [current]); // 'current'가 변경될 때마다 실행

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

  const toggleTypes = () => {
    setShowType(!showType);
  };

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

  const typeVariants = {
    hidden: { opacity: 0, x: -300 },
    visible: { opacity: 1, x: 0 }
  };


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  const requestUpdate = async (id: any) => {
    await fetch('/api/delete-post', {
      method: 'POST',
      body: JSON.stringify({ postId : id}),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const clickDelete = async (e: any) => {
    await requestUpdate(e.target.id) 

    setCurrent(0)
    mutate('/api/get-post')  
  }

  const clickEdit = async (e: any) => {
    router.push(`/edit-post/${e.target.id}`)
  }

  if(!filteredPosts){
    return <div>filteredPosts is Loading...</div>
  }

  console.log(filteredPosts)

  // console.log(turndown.turndown(filteredPosts[0].content))

  return (
    <>   
    <div className="flex w-full items-center justify-center" style={{height: '100vh'}}>
      <button onClick={toggleTypes} className="fixed top-10 left-10 text-4xl bg-gray-500 text-white rounded-full">
        {showType ? <MenuFoldIcon /> : <MenuUnFoldIcon />}
      </button>
      {showType && (
        <motion.div 
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={typeVariants}
          transition={{ duration: 1 }}
          className="flex flex-col w-24 items-center justify-center h-3/4 overflow-scroll">      
          {[...types].map((type: any) => (
            <motion.div 
              key={type} 
              className="h-24 w-20  mt-4 bg-white text-center shadow-lg border rounded-md flex items-center justify-center text-sm" 
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
      )}
  
      <div className="flex w-5/6 justify-center h-3/4 overflow-hidden " >
        <div id="container" className="relative overflow-scroll w-3/4 flex flex-col justify-between items-center bg-white shadow-lg rounded-lg m-5  text-gray-800">
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
                  <div key={filteredPosts[current].id} className="relative" >
                    {session && (
                      <>                      
                        <button id={filteredPosts[current].id} onClick={clickDelete} className="absolute top-5 right-5 w-12 h-12 bg-red-100 rounded-full">X</button>
                        <button id={filteredPosts[current].id} onClick={clickEdit} className="absolute top-20 right-5 w-12 h-12 bg-blue-100 rounded-full">Edit</button></>
                )}
                    <div className="px-6 py-4 ">
                      <div className="font-bold text-xl mb-2 text-blue-300">{filteredPosts[current].title}</div>
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
