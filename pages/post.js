import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

export default function Post() {
  // Form state
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const routeData = route.query;

  // Submit post
  const submitPost = async (e) => {
    e.preventDefault();

    const toastOptions = {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    };

    if (!post.description) {
      toast.error("Nem adtál meg szöveget", toastOptions);
      return;
    }

    if (post.description.length > 300) {
      toast.error("A bejegyzés szövege túl hosszú", toastOptions);
      return;
    }

    if (post?.hasOwnProperty("id")) {
      // Update post
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      toast.success("Sikeres mentés", toastOptions);
      return route.push("/");
    } else {
      // Create new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: "" });
      toast.success("Sikeres létrehozás", toastOptions);
      return route.push("/");
    }
  };

  const cancelPost = () => {
    if (post?.hasOwnProperty("id")) {
      // Back
      route.push('/dashboard')
    } else {
      // Crlear te textarea
      setPost({ description: "" })
    }
  }

  // Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <div className="my-10 p-6 shadow-lg rounded-lg max-w-md mx-auto dark:bg-slate-700 dark:text-sky-100">
      <form onSubmit={submitPost}>
        <h1 className="text-2xl font-bold">
          {post?.hasOwnProperty("id")
            ? "Bejegyzés szerkesztése"
            : "Bejegyzés létrehozása"}
        </h1>
        <div className="py-2">
          <textarea
            onChange={(e) => {
              setPost({ ...post, description: e.target.value });
            }}
            value={post.description}
            className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
          ></textarea>
          <p
            className={`font-medium text-sm ${
              post.description.length > 300
                ? "text-red-600 dark:text-red-400"
                : "text-sky-600 dark:text-sky-100"
            }`}
          >
            {post.description.length}/300
          </p>
        </div>
        <div>
          <button
            type="submit"
            disabled={post.description.length <= 0}
            className="w-1/2 bg-sky-600 dark:bg-sky-400 text-white dark:text-gray-800 font-medium p-2 my-2 rounded-lg text-sm disabled:text-gray-500 disabled:bg-sky-900"
          >
            {post.hasOwnProperty("id") ? "Mentés" : "Létrehozás"}
          </button>
          <button
            type="button"
            className="w-1/2 font-medium p-2 my-2 rounded-lg text-sm disabled:text-gray-600"
            disabled={post.description.length <= 0}
            onClick={() => cancelPost()}
          >
            Mégsem
          </button>
        </div>
      </form>
    </div>
  );
}
