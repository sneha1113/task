import { Response, Request } from 'express';
import { createUser, login } from '../services/user';

const newUser = async (req: Request, res: Response) => {
  const {
    firstName,
    lastName,
    email,
    password,
  } = req.body;

  try {
    await createUser(
      firstName,
      lastName,
      email,
      password,
    );

    res.send({ message: "successful" });
  } catch (error : any) {
    res.status(500).send({ error: `Failed to create user: ${error.message}` });
  }
};

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await login(email, password);

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid Credentials.' });
  }
};

export const testpasser = {
  loginUser,
  newUser
};
