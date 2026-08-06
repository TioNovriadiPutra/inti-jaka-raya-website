import { useLoading, useToast } from "@/stores/page.store";

const useHelper = () => {
  const setIsLoading = useLoading((state) => state.setIsLoading);
  const showToast = useToast((state) => state.showToast);

  const onMutate = () => setIsLoading(true);

  const onSettled = () => setIsLoading(false);

  const onSuccess = (message: string) => showToast("success", message);

  const onError = (message: string) => showToast("error", message);

  return {
    onMutate,
    onSettled,
    onSuccess,
    onError,
  };
};

export default useHelper;
