import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
  GoogleAuthProvider
} from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export default function Login() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);

  // Sign in with google
  const GoogleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      route.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
      console.log("login");
    }
  }, [user]);

  return (
    <div className="mt-32 p-10 text-gray-700 rounded-lg dark:bg-slate-700 dark:text-sky-100">
      <h2 className="text-2xl font-medium">Csatlakozz most</h2>
      <div className="py-4">
        <h3 className="py-4">Jelentkezz be az alábbi szolgáltatókkal</h3>
        <button
          onClick={GoogleLogin}
          className="text-white bg-gray-800 w-full font-medium rounded-lg flex align-middle p-4"
        >
          <FcGoogle className="text-2xl mr-2" />
          Bejelentkezés Google-el
        </button>
      </div>
    </div>
  );
}
