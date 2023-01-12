import {
  arrayUnion,
  doc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Comment from "../components/comment";
import Message from "../components/message";
import { auth, db } from "../utils/firebase";
import { BsSuitHeart, BsSuitHeartFill } from "react-icons/bs";

export default function Details() {
  const route = useRouter();
  const routeData = route.query;
  const [message, setMessage] = useState("");
  const [post, setPost] = useState([]);

  // Submit a message
  const submitMessage = async () => {
    const toastOptions = {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 1500,
    };

    // Check if the user is logged in
    if (!auth.currentUser) return route.push("/auth/login");
    if (!message) {
      toast.error("Üres üzenetet nem küldhetsz", toastOptions);
      return;
    }

    await updateDoc(doc(db, "posts", routeData.id), {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

    setMessage("");
  };

  // Get comments
  const getComments = async () => {
    const comments = onSnapshot(doc(db, "posts", routeData.id), (snapshot) => {
      setPost(snapshot.data())
    });
    return comments;
  };

  useEffect(() => {
    if (!route.isReady) return;
    getComments();
  }, [route.isReady]);

  return (
    <div>
      <Message {...routeData}>
        {auth.currentUser && (
          <button className="text-lg" onClick={() => like(post)}>
            {post?.liked > 0 ? (
              <BsSuitHeartFill className="text-red-400" />
            ) : (
              <BsSuitHeart />
            )}
          </button>
        )}
      </Message>
      <div className="my-4">
        {auth.currentUser && (
          <div className="flex">
            <input
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              type="text"
              value={message}
              placeholder="Írj valamit..."
              className="bg-gray-800 dark:bg-gray-700 w-full p-2 text-white text-sm"
            />
            <button
              onClick={submitMessage}
              className="bg-sky-500 text-white dark:text-gray-800 py-2 px-4 text-sm"
            >
              Küldés
            </button>
          </div>
        )}
        <div className="py-6">
          <h2 className="font-bold dark:text-sky-100">Hozzászólások</h2>
          {post.comments?.map((message) => (
            <Comment {...message} key={message.time} />
          ))}
        </div>
      </div>
    </div>
  );
}
