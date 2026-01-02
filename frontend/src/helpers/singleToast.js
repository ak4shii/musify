import originalToast from 'react-hot-toast';

const withSingle = (fn) => (message, options = {}) => {
  originalToast.dismiss();
  return fn(message, { id: 'global-toast', duration: 2000, ...options });
};

const toast = {
  success: withSingle(originalToast.success),
  error: withSingle(originalToast.error),
  loading: withSingle(originalToast.loading),
  custom: withSingle(originalToast.custom),
  promise: (promise, msgs, options = {}) => {
    originalToast.dismiss();
    return originalToast.promise(promise, msgs, { id: 'global-toast', duration: 2000, ...options });
  },
  dismiss: originalToast.dismiss,
  remove: originalToast.remove,
};

export default toast;











