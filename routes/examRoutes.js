const express = require("express");

// Importamos o Controller
const {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} = require("../controllers/examController");

// Criamos o Router
const router = express.Router();

// POST /exams
router.post("/exams", createExam);
// GET /exams
router.get("/exams", getExams);
// GET /exams By ID
router.get("/exams/:id", getExamById);
// PUT /exams/:id
router.put("/exams/:id", updateExam);
// DELETE /exams/:id
router.delete("/exams/:id", deleteExam);

// Exportamos as rotas
module.exports = router;
