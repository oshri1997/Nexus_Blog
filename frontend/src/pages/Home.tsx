import { Button } from "flowbite-react";
import { HiArrowCircleLeft, HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="h-[calc(100vh-142px)] bg-white dark:bg-gray-900">
      <div className="flex h-[calc(100%-200px)] flex-col justify-center items-center">
        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
          Welcome to my blog!
        </h1>
        <p className="max-w-2xl mb-6 text-center font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
          Welcome to my web development blog! Get ready to learn and stay updated on all things
          web development, from tips and tricks to the latest news.
        </p>
        <div>
          <Link to="/posts">
            <Button className="px-6 py-3 " gradientDuoTone="purpleToBlue">
              <span className="text-base">Explore Posts</span>
              <HiArrowLeft className="ml-3 animate-moveRightToLeft " />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
