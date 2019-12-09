export function createFormData<T extends object>(params: T) {
  const data = new FormData();
  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach(value => data.append(`${key}[]`, value));
    } else {
      data.append(key, value);
    }
  });
  return data;
}
