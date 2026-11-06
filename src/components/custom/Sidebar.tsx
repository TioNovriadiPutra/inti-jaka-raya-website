import Image from "next/image";
import Link from "next/link";
import { Logout } from "iconsax-reactjs";
import { useRouter } from "next/router";
import { cmsSidebarData } from "@/utils/constant";

const Sidebar = () => {
  const route = useRouter();

  return (
    <aside className="sticky top-0 flex h-dvh w-18 shrink-0 flex-col border-r border-neutral-200 bg-white font-sans xl:w-64 min-[1024px]:landscape:w-56">
      <div className="flex h-23 shrink-0 items-center justify-center border-b border-neutral-100 px-3 xl:justify-start xl:px-6 min-[1024px]:landscape:justify-start min-[1024px]:landscape:px-5">
        <Link
          href="/"
          aria-label="Inti Jaka Raya home"
          title="Inti Jaka Raya home"
          className="flex min-h-11 min-w-11 items-center justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-600"
        >
          <Image src="/icon.png" alt="Inti Jaka Raya" width={32} height={32} className="size-8 object-contain xl:hidden min-[1024px]:landscape:hidden" />
          <Image src="/images/brand-logo.png" alt="Inti Jaka Raya" width={225} height={42} sizes="180px" className="hidden h-auto w-45 max-w-full object-contain xl:block min-[1024px]:landscape:block" />
        </Link>
      </div>

      <nav aria-label="CMS navigation" className="min-h-0 flex-1 overflow-y-auto px-3 py-6 xl:px-4 min-[1024px]:landscape:px-4">
        <div className="mb-5 hidden items-center justify-between gap-2 px-3 xl:flex min-[1024px]:landscape:flex">
          <p className="text-caption font-extrabold uppercase tracking-[.14em] text-neutral-500">Workspace</p>
          <span className="rounded-md border border-primary-50 bg-primary-50/40 px-2 py-1 text-caption font-bold text-primary-600">CMS</span>
        </div>

        <div className="space-y-2">
          {cmsSidebarData.map((item) => {
            const Icon = item.icon;
            const active = route.pathname === item.dest;

            return (
              <Link
                key={item.dest}
                href={item.dest}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                title={item.label}
                className={`relative flex min-h-12 items-center justify-center gap-3 rounded-xl border px-2 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 motion-reduce:transition-none xl:justify-start xl:px-3 min-[1024px]:landscape:justify-start min-[1024px]:landscape:px-3 ${active ? "border-primary-50 bg-primary-50/40 text-primary-600" : "border-transparent text-neutral-500 hover:border-neutral-200 hover:bg-neutral-50 hover:text-primary-600"}`}
              >
                <span aria-hidden="true" className={`absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full ${active ? "bg-accent-600" : "bg-transparent"}`} />
                <span aria-hidden="true" className="shrink-0"><Icon size={21} /></span>
                <span className="hidden text-small font-bold xl:block min-[1024px]:landscape:block">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="shrink-0 border-t border-neutral-100 px-3 py-4 xl:px-4 min-[1024px]:landscape:px-4">
        <p className="mb-3 hidden px-3 text-caption leading-relaxed text-neutral-400 xl:block min-[1024px]:landscape:block">Inti Jaka Raya <span aria-hidden="true">·</span> Content management</p>
        <button
          type="button"
          aria-label="Logout"
          title="Logout"
          className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl border border-transparent px-2 text-neutral-500 transition-colors duration-200 hover:border-red-100 hover:bg-red-50 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-600 motion-reduce:transition-none xl:justify-start xl:px-3 min-[1024px]:landscape:justify-start min-[1024px]:landscape:px-3"
        >
          <span aria-hidden="true" className="shrink-0"><Logout size={21} /></span>
          <span className="hidden text-small font-bold xl:block min-[1024px]:landscape:block">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
