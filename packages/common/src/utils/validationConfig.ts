export const validationConfig = {
  username: {
    minLength: 8,
    maxLength: 20
  },
  password: {
    regex: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z_]{8,20}$/,
    minLength: 8,
    maxLength: 20
  }
};
