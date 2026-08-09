import useHelper from "@/hooks/useHelper";
import { LoginInput } from "@/interfaces/auth.interface";
import { checkIsLoggedIn, login, logout } from "@/services/auth.service";
import { useAuth, useLoginModal } from "@/stores/page.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const useAuthController = () => {
  const setLoggedIn = useAuth((state) => state.setLoggedIn);
  const setLoginModal = useLoginModal((state) => state.setShowModal);

  const { queryClient, onMutate, onSettled, onSuccess, onError } = useHelper();

  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: (body: LoginInput) => login(body),
    onMutate,
    onSettled,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["checkIsLoggedIn"],
      });
      setLoginModal(false);
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  const useCheckIsLoggedInService = () => {
    const { isLoading, isRefetching, isSuccess, isError } = useQuery({
      queryKey: ["checkIsLoggedIn"],
      queryFn: () => checkIsLoggedIn(),
    });

    useEffect(() => {
      if (isSuccess) {
        setLoggedIn(true);
      }

      if (isError) {
        setLoggedIn(false);
      }
    }, [isSuccess, isError]);

    return {
      isLoading,
      isRefetching,
    };
  };

  const logoutMutation = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => logout(),
    onMutate,
    onSettled,
    onSuccess: async (response) => {
      await queryClient.invalidateQueries({
        queryKey: ["checkIsLoggedIn"],
      });
      onSuccess(response.message);
    },
    onError: (error) => onError(error.message),
  });

  return {
    loginService: (body: any) => loginMutation.mutate(body),
    useCheckIsLoggedInService,
    logoutService: () => logoutMutation.mutate(),
  };
};

export default useAuthController;
