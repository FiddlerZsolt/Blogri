import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { AiFillEdit } from "react-icons/ai";
import { FaComment } from "react-icons/fa";
import { BsDoorOpenFill, BsTrash2Fill } from "react-icons/bs";
import Link from "next/link";
import Message from "../components/message";
import { auth, db } from "../utils/firebase";

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const route = useRouter();

  const getData = async () => {
    if (loading) return;
    if (!user) {
      route.push("/auth/login");
      return;
    }

    const q = query(
			collection(db, "posts"),
			where("user", "==", user.uid)
		);

    const data = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => (
				{ ...doc.data(), id: doc.id }
			)));
    });

    return data;
  };

  // Delete post
  const deletePost = async (id) => await deleteDoc(
		doc(db, "posts", id)
	);

  // Get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1 className="dark:text-sky-100">Bejegyzéseid</h1>
      <div>
        {posts.map((post) => (
          <Message {...post} key={post.id}>
            <div className="flex justify-between items-center max-w-md">
              <button
                onClick={() => deletePost(post.id)}
                className="text-pink-600 dark:text-red-400 flex items-center justify-center gap-2 py-2 text-onSubmit"
              >
                <BsTrash2Fill className="text-2xl" />
                Törlés
              </button>
              <Link href={{ pathname: "/post", query: post }}>
                <button className="text-teal-600 dark:text-teal-500 flex items-center justify-center gap-2 py-2 text-onSubmit">
                  <AiFillEdit className="text-2xl" />
                  Szerkesztés
                </button>
              </Link>
              <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
                <button className="text-teal-600 dark:text-sky-100 flex items-center justify-center gap-2 py-2 text-onSubmit">
                  <FaComment />
                  Hozzászólások (
                  {post.comments?.length > 0 ? post.comments?.length : 0})
                </button>
              </Link>
            </div>
          </Message>
        ))}
      </div>
      <div className="flex justify-end">
        <button
            className="flex items-center gap-2 font-medium text-white bg-gray-700 py-2 px-4 my-6"
            onClick={() => auth.signOut()}
        >
            Kilépés
            <BsDoorOpenFill />
        </button>
        </div>
      </div>
  );
}
