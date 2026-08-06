import useHelper from "@/hooks/useHelper";
import { LoginInput } from "@/interfaces/auth.interface";
import { checkIsLoggedIn, login } from "@/services/auth.service";
import { useAuth, useLoginModal } from "@/stores/page.store";
import { useMutation, useQuery } from "@tanstack/react-query";

const useAuthController = () => {
  const setLoggedIn = useAuth((state) => state.setLoggedIn);
  const setLoginModal = useLoginModal((state) => state.setShowModal);

  const { onMutate, onSettled, onSuccess, onError } = useHelper();

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (body: LoginInput) => login(body),
    onMutate,
    onSettled,
    onSuccess: (response) => {
      setLoggedIn(true);
      setLoginModal(false);
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  const useCheckIsLoggedInService = () => {
    const { isLoading, isSuccess } = useQuery({
      queryKey: ["checkIsLoggedIn"],
      queryFn: () => checkIsLoggedIn(),
    });

    if (!isLoading) {
      if (isSuccess) setLoggedIn(true);
      else setLoggedIn(false);
    }

    return {
      isLoading,
    };
  };

  return {
    loginService: (body: any) => loginMutation.mutateAsync(body),
    useCheckIsLoggedInService,
  };
};

export default useAuthController;
