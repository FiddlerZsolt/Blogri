import { secondsToDateTimeString } from "../utils/utils";

export default function Message({ children, avatar, username, description, timestamp }) {
  const dateTimeString = timestamp ? secondsToDateTimeString(timestamp.seconds) : ''
  
  return (
    <div className="shadow-md shadow-slate-300 dark:shadow-none bg-white px-8 py-4 rounded-lg dark:bg-slate-700 dark:text-sky-100 mt-3">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2">
            <img src={ avatar } className="w-10 h-10 rounded-full" />
            <h2>{ username }</h2>
        </div>
        <div className="flex justify-end">
            <span className="text-sm text-right">{ dateTimeString }</span>
        </div>
      </div>
      <div className="py-4">
        <p>{ description }</p>
      </div>
      {children}
    </div>
  );
}
