export interface LoadingState {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export interface AuthState {
  isLoggedIn: boolean;
  setLoggedIn: (loggedIn: boolean) => void;
}

export interface ToastState {
  isShowing: boolean;
  type: "success" | "error";
  message: string;
  showToast: (type: "success" | "error", message: string) => void;
  hideToast: () => void;
}

export interface ModalState {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
}
