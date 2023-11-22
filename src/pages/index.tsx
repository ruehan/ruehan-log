import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { marked } from 'marked';
import {motion} from 'framer-motion'

const fetcher = (url: any) => fetch(url).then((res) => res.json());

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: posts, error } = useSWR('/api/get-post', fetcher);
  const [selectedType, setSelectedType] = useState('테스트');

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

  console.log(posts)

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

  return (
    <>
      
    <div className="flex w-full ">
      <motion.div 
        className="flex flex-col w-36  fixed basis-1 items-center">      
        {[...types].map((type: any) => (
          <motion.div 
            key={type} 
            className="h-36 w-32 bg-gray-100 mt-4 bg-white text-center  shadow-lg border rounded-md flex items-center justify-center" 
            onClick={() => setSelectedType(type)}
            whileHover={{scale: 1.1}}
            whileTap={{scale: 0.95}}
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            >{type}
          </motion.div>
        ))}

      </motion.div>
      <div className="flex flex-col items-center w-full justify-center">
      {filteredPosts.map((post: any) => (
        <div key={post.id} className=" rounded overflow-hidden shadow-md m-4 w-3/4">
        {/* <img className="w-full" src="/path-to-your-image.jpg" alt="Post Image"/> */}
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{post.title}</div>
          <div
            className="text-gray-700 text-base"
            dangerouslySetInnerHTML={{ __html: marked.parse(post.content || '') }}
          />
        </div>
      </div>
      ))}
      </div>
    </div>
    </>
  );
}
