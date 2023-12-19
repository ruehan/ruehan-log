import { useEffect, useRef, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR, { mutate } from 'swr';
import { marked } from 'marked';
import {motion, AnimatePresence} from 'framer-motion'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { RiMenuFoldLine as MenuFoldIcon, RiMenuUnfoldLine as MenuUnFoldIcon } from "react-icons/ri";
import LoadingComponent from './components/Loader';
import { useForm } from 'react-hook-form';
import moment from "moment";

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: posts, error } = useSWR('/api/get-post', fetcher);
  const { data: comments, error: cError } = useSWR('/api/get-comment', fetcher);
  const [selectedType, setSelectedType] = useState('한달간의 여행 기록');
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showType, setShowType] = useState(true);
  const containerRef = useRef<null | HTMLDivElement>(null);
  const [searchedPosts, setSearchedPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { register, watch, setValue, handleSubmit, control } = useForm();

  let nickname = watch('nickname');

  function unix_timestamp(t: moment.MomentInput){  
    return moment(t).format('YYYY-MM-DD HH:mm:ss')
  }

  const scrollToTop = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };
  
  const paginate = (newIndex: any) => {
    setCurrent(newIndex);
    setDirection(newIndex > current ? 1 : 0);

  }

  useEffect(() => {
    console.log(session)
    if (status !== 'loading' && !session) {
    }
  }, [session, status, router]);

  useEffect(() => {
    const element = document.getElementById('container');
    if (element) {
      element.scrollTop = 0;
    }
  }, [current]);

  useEffect(() => {
    try{
      const results = posts.getPost.filter((post: { title: string; content: string; }) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchedPosts(results);
    }catch{

    }
  }, [searchTerm, posts]);

  if(!posts){
    return <LoadingComponent />
  }

  if(!comments){
    return <LoadingComponent />
  }

  const types = new Set(posts.getPost.map((post: any) => post.type));
  const filteredPosts = posts.getPost.filter((post: any) => post.type == selectedType);
  const titles = filteredPosts.map((post: { title: any; }) => post.title);
  
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

  const typeVariants = {
    hidden: { opacity: 0, x: -300 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300, rotate: 180 },
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

  const requestUpdate = async (id: any) => {
    await fetch('/api/delete-post', {
      method: 'POST',
      body: JSON.stringify({ postId : id}),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const requestUpdateComment = async (id: any) => {
    await fetch('/api/delete-comment', {
      method: 'POST',
      body: JSON.stringify({ commentId : id}),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  const clickDelComment = async (e: any) => {
    await requestUpdateComment(e.target.id)

    mutate('/api/get-comment') 
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
    return <LoadingComponent />
  }

  const onSubmit = async (data: any) => {
    try {
      const newData = {
        ...data,
        postId: filteredPosts[current].id
      }

      if(nickname == "ruehan" && session){
        const response = await fetch('/api/create-comment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newData),
        });
  
        if (!response.ok) {
          throw new Error('회원가입 실패');
        }
      }else{
        alert("관리자만 사용 가능합니다..!")
      }

      setValue('nickname', '')
      setValue('comment', '')

      mutate('/api/get-comment')
    } catch (error) {
      console.error('회원가입 중 에러 발생:', error);
    }
  };

  return (
    <>  
    <form onSubmit={handleSubmit(onSubmit)} className="fixed right-0 bottom-0 flex-1 h-screen overflow-hidden hidden lg:block lg:w-1/6 h-1/2  ">
          <div className="absolute bottom-4 w-full flex flex-col justify-center items-center">
            <input 
              {...register('nickname')}
              placeholder='닉네임 입력..'
              className="w-full h-8 p-4 border-2 border-blue-100 rounded-xl m-2"
            />
            <input 
              {...register('comment')}
              placeholder='댓글 입력..'
              className="w-full h-8 p-4 border-2 border-blue-100 rounded-xl m-2"
            />
            <button type="submit" className="w-1/2 h-8 p-4 mt-2 flex justify-center items-center border-2 bg-blue-300 text-white rounded-xl">댓글 등록</button>
          </div>
          {comments.getComment.map((comment: any) => (
            comment.postId == filteredPosts[current].id ? (
              <div key={comment.id} className="flex flex-col font-nanum p-2 m-2 border-2 border-blue-100 rounded-xl">
              {session && (
                <div id={comment.id} className="text-red-600 w-4 h-4" onClick={clickDelComment}>X</div>
              )}
              <div className="flex justify-between">
                <div className="text-lg">{comment.author == "ruehan" ? `👨‍💻 ${comment.author}` : comment.author}</div>
                <div>[{unix_timestamp(comment.createdAt)}]</div>
              </div>
              <div className="text-2xl">{comment.content}</div>
            </div>
            ) : null
          ))}
    </form>

    <div className="flex flex-col items-center md:flex-row w-full justify-center overflow-hidden" style={{height: '90vh'}} >
      <button onClick={toggleTypes} className="fixed top-5 left-5 text-4xl bg-gray-500 text-white rounded-full z-50">
        {showType ? <MenuFoldIcon /> : <MenuUnFoldIcon />}
      </button>
      {showType && (
        <div className="flex items-center justify-center bg-white ml-8 absolute h-full top-0 left-0 z-40 scrollbar-hide w-full lg:w-1/6 lg:bg-inherit">
          <motion.div
          initial="hidden"
          animate="visible"
          variants={typeVariants}
          transition={{ duration: 1 }}
          className="flex flex-col">      
          {[...types].map((type: any) => (
            <motion.div 
              key={type} 
              className={`p-2 ${type === selectedType ? 'text-blue-500 font-bold' : 'text-gray-700'}`}
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
        <motion.div 
        initial="hidden"
        animate="visible"
        variants={typeVariants}
        transition={{ duration: 1 }}
        className="flex flex-col w-36 justify-center h-3/4 overflow-scroll">
        {titles.map((title: any, index: any) => (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.95}}
            key={title}
            className={`p-2 border-l-2 ${index === current ? 'text-blue-500 font-bold' : 'text-gray-700'}`}
            onClick={() => paginate(index)}
          >
            {title}
          </motion.div>
        ))}
      </motion.div>
        </div>
      )}
  
      <div className="flex w-full lg:w-5/6 justify-center h-full overflow-hidden " >
      <div className="fixed top-5 right-0 lg:sticky lg:right-0 flex flex-col w-12 h-72 justify-around items-center z-40 text-sm"> 
                    {session && (                            
                        <div className="flex flex-col w-12 md:w-16 h-32 justify-around items-center rounded-2xl border-2 border-red-200">
                          <button id={filteredPosts[current].id} onClick={clickDelete} className=" w-12 h-12 bg-red-200 rounded-full text-white">X</button>
                          <button id={filteredPosts[current].id} onClick={clickEdit} className=" w-12 h-12 bg-red-200 rounded-full text-white">Edit</button>
                        </div>                            
                )}
                    <div className="flex flex-col w-12 md:w-16 h-32 justify-around items-center rounded-2xl border-2 border-blue-200">
                          <button onClick={scrollToTop} className="bg-blue-200 text-white rounded-full w-12 h-12">Top</button>
                          <button onClick={scrollToBottom} className="bg-blue-200 text-white rounded-full w-12 h-12">Bottom</button>
                        </div>
          </div>
        <div id="container" ref={containerRef} className="relative overflow-scroll w-3/4 flex flex-col justify-between items-center bg-white shadow-lg rounded-lg m-5 text-gray-800">
          
          <AnimatePresence initial={false}>
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                opacity: { duration: .25 }
              }}
              
              style={{position: 'absolute', width: '100%'}}>
                {
                  <div key={filteredPosts[current].id} className="relative" >
                    <div className="px-6 py-4 pb-8 flex-1 font-nanum" >
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
          <div className="w-full flex justify-around items-center fixed bottom-0  md:fixed md:w-1/4 h-12 bg-orange-100 rounded-xl font-bold z-30">
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
