import { Footer } from "flowbite-react";

import { BsFacebook, BsGithub, BsInstagram, BsTwitterX } from "react-icons/bs";

export default function FooterComponent() {
  return (
    <Footer container className="border border-t-8 border-teal-500">
      <div className="flex w-full justify-between ">
        <div>
          <Footer.Copyright by="Nexus Blog" year={new Date().getFullYear()} />
        </div>
        <div className="flex gap-6 ">
          <Footer.Icon className="hover:text-[#4867AA]" href="#" icon={BsFacebook} />
          <Footer.Icon className="hover:text-[#EF3577]" href="#" icon={BsInstagram} />
          <Footer.Icon className="hover:text-black" href="#" icon={BsTwitterX} />
          <Footer.Icon className="hover:text-#E6EDF3" href="#" icon={BsGithub} />
        </div>
      </div>
    </Footer>
  );
}
