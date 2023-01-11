import { BsPencilFill } from "react-icons/bs";

export default function Splashscreen() {
  return (
    <div className="w-full h-full absolute bg-cyan-700 flex justify-center items-center z-50">
      <span className="text-4xl font-medium dark:text-sky-100 flex items-center gap-2 font-sendFlowers">
        <span className="text-6xl mr-3">Blogri</span>
        <BsPencilFill />
      </span>
    </div>
  );
}
