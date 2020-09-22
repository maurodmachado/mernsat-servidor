//Rutas para crear solicitud
const express = require("express");
const router = express.Router();
const solicitudesController = require("../controllers/solicitudesController");
const auth = require("../middleware/auth");
const { check } = require("express-validator");

//api/solicitudes
//Crear solicitud
router.post(
  "/",
  auth,
  [
    check("nombre_solicitante", "El nombre del solicitante es obligatorio")
      .not()
      .isEmpty(),
    check("departamento", "El departamento es obligatorio").not().isEmpty(),
  ],
  solicitudesController.crearSolicitud
);

//Obtener todas las solicitudes
router.get("/", auth, solicitudesController.obtenerSolicitudes);

//Actualizar solicitudes via ID
router.put(
  "/:id",
  auth,
  solicitudesController.actualizarSolicitud
);

router.put(
  "/archivar/:id",
  auth,
  solicitudesController.archivarSolicitud
);

//Eliminar una solicitud
//Actualizar solicitudes via ID
router.delete(
    "/:id",
    auth,
    solicitudesController.eliminarSolicitud
  );
  
  router.delete(
    "/",
    auth,
    solicitudesController.eliminarSolicitudes
  );
module.exports = router;
