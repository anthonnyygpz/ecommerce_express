import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { login, createUser } from "../services/auth.service";
import { isExistsEmail, isExistsUsername } from "../services/chekcExists";
import { CreateUserBody, LoginUserBody, UserResponse } from "../models/user";

const router: Router = Router();

router.post('/login', async (req: Request<LoginUserBody>, res: Response<UserResponse>) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'El correo y la contraseña son obligatorios.' });
  }

  try {
    const user = await login(req.body)

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas o cuenta inactiva' });
    }

    const match = await bcrypt.compare(password, user.password_hashed!)

    if (!match) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    req.session.userId = user.user_id;
    req.session.username = user.username;
    req.session.isAdmin = user.isAdmin;

    res.status(200).json({
      message: 'Login exitoso',
      user: {
        user_id: user.user_id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Error al iniciar sesion:', error);
    res.status(500).json({ error: `Error en el servidor: ${error}` });
  }
})

router.post('/register', async (req: Request<CreateUserBody>, res: Response<UserResponse>) => {
  const { email, username, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan los campos username, email o password' });
  }
  try {
    await isExistsEmail(email, res);
    await isExistsUsername(username, res);

    const newUser = await createUser(req.body);

    req.session.userId = newUser.user_id;
    req.session.username = newUser.username;

    res.status(201).json({ user: newUser });
  } catch (error) {
    console.error('Error al insertar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
})

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'No se pudo cerrar sesión.' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Se cerro sesión exitosamente.' })
  })
});

export default router;


