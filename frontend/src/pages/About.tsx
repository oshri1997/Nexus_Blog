import { Button } from "flowbite-react";
import { HiArrowLeft } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="h-[calc(100vh-137px)] !bg-background   ">
      <div className="flex h-[calc(100%-200px)] flex-col justify-center items-center">
        <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
          About This Blog
        </h1>
        <p className="max-w-2xl mb-6 text-center font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
          I'm Oshri Moalem, a junior web developer fascinated by the ever-evolving landscape of
          web technologies. Here, I'm dedicated to exploring and explaining the latest
          concepts, tools, and trends that are shaping the future of the web. Join me as we
          delve into the exciting world of web development and push the boundaries of what's
          possible online!
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
