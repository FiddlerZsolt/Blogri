import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsPencilFill, BsPlusCircle } from "react-icons/bs";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button className="text-lg font-medium dark:text-sky-100 flex items-center gap-2 font-sendFlowers">
          <span className="text-2xl">Blogri</span>
          <BsPencilFill />
        </button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link
            href={"/auth/login"}
            className="py-2 px-4 text-sm bg-sky-500 dark:bg-sky-400 text-white dark:text-gray-800 rounded-lg font-medium ml-8"
          >
            Bejelentkezés
          </Link>
        )}
        {!loading && user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button
                className="rounded-sm font-medium bg-sky-500 text-white dark:text-sky-900 py-2 px-4 rounded-mg text-sm"
                title="új bejegyzés létrehozása"
              >
                <BsPlusCircle className="text-2xl" />
              </button>
            </Link>
            <Link href="/dashboard">
              <img
                className="w-12 h-12 rounded-full cursor-pointer border-2"
                src={user.photoURL}
                alt="user picture"
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
