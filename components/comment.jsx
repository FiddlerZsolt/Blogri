import { BsPersonCircle } from "react-icons/bs";

export default function Comment({time, avatar, userName, message}) {
  return (
    <div
      className="bg-white shadow-md shadow-slate-200 dark:shadow-none p-4 my-4 dark:bg-slate-900 dark:text-sky-100 rounded-md"
      key={time}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 rounded-full">
          <BsPersonCircle className="w-10 h-10 rounded-full" />
        </div>
        {/* <img
          className="rounded-full w-10 h-10 border-2"
          src={avatar}
          alt=""
        /> */}
        <h2>{userName}</h2>
      </div>
      <h2>{message}</h2>
    </div>
  );
}
