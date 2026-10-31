let message = "";
const listeners = new Set();
const emit = () => listeners.forEach((notify) => notify());
export const loadingMessage = () => message;
export function updateLoadingMessage(label) {
  if (message) { message = label; emit(); }
}
export function subscribeLoading(notify) {
  listeners.add(notify);
  return () => listeners.delete(notify);
}
export async function withLoading(label, action) {
  if (message) return;
  message = label;
  emit();
  try { return await action(); }
  finally { message = ""; emit(); }
}

