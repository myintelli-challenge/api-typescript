import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { query } from './db';

const app = express();
app.use(bodyParser.json());

app.post('/actualizar-cantidad-libros', async (req: Request, res: Response) => {
  const { id_autor, cantidad } = req.body;

  if (!id_autor || cantidad === undefined) {
    return res.status(400).json({ error: 'El ID del autor y el dato cantidad son requeridos' });
  }

  try {
    const result = await query('UPDATE autores SET cantidad_libros = $1 WHERE id = $2 RETURNING *', [cantidad, id_autor]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'No se encontró el autor con ese ID' });
    }

    res.json({ message: 'Dato actualizado', data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el registro' });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
