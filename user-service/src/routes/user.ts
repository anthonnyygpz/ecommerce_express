import { Router } from "express";
import { fetchMe, softDeleteUser, updateUser } from "../services/user.service";
import { isExistsUsername } from "../services/chekcExists";
import { isAuthenticated } from "../middleware/checkAuth.ts";

const router: Router = Router();

router.get('/me', isAuthenticated, async (req, res) => {
  try {
    const userIdFromSession = req.session.userId;

    if (!userIdFromSession) {
      return res.status(401).json({ error: "No autorizado." });
    }
    const user = await fetchMe(userIdFromSession);

    if (!user) {
      return res.status(404).json({ error: "No se encontro el usuario." });
    }

    res.status(200).json({
      message: 'Usuario recuperado de la sesión',
      data: {
        user_id: user.user_id,
        username: user.username,
        email: user.email,
        address_id: user.address_id,
        created_at: user.created_at,
        updated_at: user.updated_at,
        status: user.status,
        role: user.isAdmin ? 'admin' : 'user'
      }
    });
  } catch (error) {

  }
});

router.put('/', isAuthenticated, async (req, res) => {
  const { username } = req.body
  try {
    await isExistsUsername(username);

    const userIdFromSession = req.session.userId;

    if (userIdFromSession === undefined) {
      return res.status(400).json({ error: "El id del usuario no se encontro." });
    }
    await updateUser(userIdFromSession, req.body);

    res.status(200).json({ message: 'Se actulizaron los datos exitaosamente.' });
  } catch (error) {
    console.error('Error al actualizar los datos:', error);
    res.status(500).json({ error: `Error en el servidor: ${error}` });
  }
});


router.delete('/', isAuthenticated, async (req, res) => {
  try {
    const userIdFromSession = req.session.userId;


    if (userIdFromSession === undefined) {
      return res.status(400).json({ error: "El id del usuario no se encontro." });
    }
    const deleteUser = await softDeleteUser(userIdFromSession);

    if (!deleteUser) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar después del soft delete:', err)
        return res.status(500).json({ error: 'Usuario desactivado,pero fallo el cierre de sesión.' });
      }

      res.clearCookie('connect.sid');
      res.status(200).json({
        message: 'Usuario desactivado y sesión cerrada exitosamente.'
      })
    })
  } catch (error) {
    console.error('Error en el enpoint de soft delete:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
})


export default router;
