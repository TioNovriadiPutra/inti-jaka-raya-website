import { useAuth } from "@/stores/page.store";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Dashboard = () => {
  const isLoggedIn = useAuth((state) => state.isLoggedIn);

  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) router.replace("/");
  }, [isLoggedIn]);

  return <div>Dashboard</div>;
};

export default Dashboard;
