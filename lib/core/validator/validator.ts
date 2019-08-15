const validateEmail = (email: string): boolean => {
  const emailRegex: RegExp = new RegExp(
    /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i,
  );

  if (!emailRegex.test(email)) {
    throw new Error('Invalid email');
  }

  return true;
};
const validatePassword = (password: string): boolean => {
  return password.length > 0 && !password.includes(' ');
};
export { validateEmail, validatePassword };
