import { IBlog, IUserRegister } from "./TypeScript";

export function ValidRegister(userRegister: IUserRegister) {
  const { name, account, password, cf_password } = userRegister;
  const errors: string[] = [];

  if (!name) {
    errors.push("Please add your name");
  } else if (name.length > 20) {
    errors.push("Your name is up to 20 chars long");
  }

  if (!account) {
    errors.push("Please add your email or phone number");
  } else if (!validPhone(account) && !validateEmail(account)) {
    errors.push("Email or phone number format is incorrect");
  }

  if (password.length < 6) {
    errors.push("password must be at least 6 chars");
  } else if (password !== cf_password) {
    errors.push("Confitm password did not match");
  }

  const msg = checkPassword(password, cf_password);
  if (msg) errors.push(msg);

  return {
    errMsg: errors,
    errLength: errors.length,
  };
}

export function checkPassword(password: string, cf_password: string) {
  if (password.length < 6) {
    return "password must be at least 6 chars";
  } else if (password !== cf_password) {
    return "Confitm password did not match";
  }
}

export function validPhone(phone: string) {
  const re = /^[+]/g;
  return re.test(phone);
}

export function validateEmail(email: string) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export function validCreateBlog({
  title,
  content,
  description,
  thumbnail,
  category,
}: IBlog) {
  const err: string[] = [];

  if (title.trim().length < 10) {
    err.push("Title has at least 10 characters.");
  } else if (title.trim().length > 50) {
    err.push("Title is up to 10 characters long.");
  }

  if (content.trim().length < 500) {
    err.push("Content has at least 10 characters.");
  }

  if (description.trim().length < 20) {
    err.push("Description has at least 20 characters.");
  } else if (description.trim().length > 200) {
    err.push("description is up to 0 characters long.");
  }

  if (!thumbnail) {
    err.push("Thumbnail cannot be left blank.");
  }

  if (!category) {
    err.push("Category cannot be left blank.");
  }

  return {
    errMsg: err,
    errLength: err.length,
  };
}
