import Link from "next/link";
import { Logo } from "../../../public";
import { Flex } from "../shared";
import { Logout } from "iconsax-reactjs";
import { useRouter } from "next/router";
import { cmsSidebarData } from "@/utils/constant";

const Sidebar = () => {
  const route = useRouter();

  return (
    <Flex className="w-12 bg-white border-r border-r-neutral-200">
      <Flex className="flex-1 gap-4 px-2 py-5 items-center">
        <Logo />

        {cmsSidebarData.map((item, index) => {
          const Icon = item.icon;

          return (
            <Link
              key={index.toString()}
              href={item.dest}
              className={`flex flex-col p-1.5 rounded-lg ${route.pathname === item.dest ? "bg-primary-50 text-primary-500" : "bg-none text-neutral-400"} hover:bg-primary-50 hover:text-primary-500 duration-300 transition-colors`}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </Flex>

      <Flex className="py-5 px-2 items-center">
        <button
          type="button"
          className="flex flex-col p-1.5 rounded-lg text-neutral-400 hover:bg-red-50 hover:text-red-500 duration-300 transition-colors"
        >
          <Logout size={20} />
        </button>
      </Flex>
    </Flex>
  );
};

export default Sidebar;
