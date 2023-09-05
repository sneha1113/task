import { UserModel } from '../entities/model';

export const createUser = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  const user = await UserModel.create({
    firstName,
    lastName,
    email,
    password,
  });

  return user;
};

export const login = async (email: string, password: string) => {
  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      throw new Error('User not found.'); 
    }
    const isPasswordValid =  user.password === password;

    if (!isPasswordValid) {
      throw new Error('Incorrect password.');
    }

    return user;
  } catch (error : any ) {
    throw new Error(`Login failed: ${error.message}`); 
  }
};