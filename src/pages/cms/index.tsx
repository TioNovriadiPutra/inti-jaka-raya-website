import { useAuth } from "@/stores/page.store";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Dashboard = () => {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/");
  }, [isLoggedIn]);

  return (
    <main className="min-w-0 flex-1 bg-neutral-50 px-5 py-8 font-sans md:px-8 xl:px-10">
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-[0_8px_30px_-24px_var(--primary-900)] md:p-8">
        <p className="mb-3 flex items-center gap-2 text-caption font-extrabold uppercase tracking-[.14em] text-neutral-500">
          <span aria-hidden="true" className="h-0.5 w-6 bg-accent-600" />
          Content management
        </p>
        <h1 className="text-h5-mobile font-extrabold tracking-tight text-primary-700 md:text-h4-desktop">Dashboard</h1>
        <p className="mt-3 max-w-xl text-small leading-relaxed text-neutral-500">Manage products, case studies, and labels using the workspace navigation.</p>
      </section>
    </main>
  );
};

export default Dashboard;
