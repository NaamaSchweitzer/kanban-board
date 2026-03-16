export const success = (data, status = 200) => ({
  ok: true,
  status,
  data,
});

export const failure = (status, message) => ({
  ok: false,
  status,
  message,
});
