const db = require("../database/connection");

// FUNÇÃO DE VALIDAÇÃO DOS DADOS DO EXAME

const validateExamData = ({
  patient_name,
  phone,
  exam_name,
  exam_date,
  exam_time,
}) => {
  // Verificamos se todos os campos foram preenchidos
  if (
    !patient_name?.trim() ||
    !phone?.trim() ||
    !exam_name?.trim() ||
    !exam_date?.trim() ||
    !exam_time?.trim()
  ) {
    return "Todos os campos são obrigatórios";
  }

  // Removemos espaços desnecessários
  const cleanPhone = phone.trim();
  const cleanExamDate = exam_date.trim();
  const cleanExamTime = exam_time.trim();

  // VALIDAÇÃO DO TELEFONE
  const phoneRegex = /^[0-9]{10,11}$/;

  if (!phoneRegex.test(cleanPhone)) {
    return "Telefone inválido. Informe 10 ou 11 números.";
  }

  // VALIDAÇÃO DO HORÁRIO
  const timeRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

  if (!timeRegex.test(cleanExamTime)) {
    return "Horário inválido. Informe um horário entre 00:00 e 23:59.";
  }

  // VALIDAÇÃO DO FORMATO DA DATA
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(cleanExamDate)) {
    return "Data inválida. Use o formato YYYY-MM-DD.";
  }

  // Transformamos a data recebida em um objeto Date
  const date = new Date(cleanExamDate + "T00:00:00");

  // Extraímos ano, mês e dia
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Montamos novamente a data
  const formattedDate = `${year}-${month}-${day}`;

  // Comparamos com a data enviada
  if (formattedDate !== cleanExamDate) {
    return "Data inválida.";
  }

  // DADOS VÁLIDOS
  return {
    patient_name: patient_name.trim(),
    phone: phone.trim(),
    exam_name: exam_name.trim(),
    exam_date: exam_date.trim(),
    exam_time: exam_time.trim(),
  };
};

// CREATE - CADASTRAR EXAME
const createExam = (req, res) => {
  // Pegamos os dados enviados pelo cliente
  const { patient_name, phone, exam_name, exam_date, exam_time } = req.body;

  // Validamos os dados
  const validationResult = validateExamData({
    patient_name,
    phone,
    exam_name,
    exam_date,
    exam_time,
  });

  // Se a validação retornar uma mensagem, os dados são inválidos
  if (typeof validationResult === "string") {
    return res.status(400).json({
      message: validationResult,
    });
  }

  // Pegamos os dados já normalizados
  const cleanPatientName = validationResult.patient_name;
  const cleanPhone = validationResult.phone;
  const cleanExamName = validationResult.exam_name;
  const cleanExamDate = validationResult.exam_date;
  const cleanExamTime = validationResult.exam_time;

  // ========================================================
  // VERIFICAMOS SE O HORÁRIO JÁ ESTÁ OCUPADO
  // ========================================================

  const checkSql = `
        SELECT id
        FROM exams
        WHERE exam_date = ?
        AND exam_time = ?
    `;

  const checkValues = [cleanExamDate, cleanExamTime];

  db.query(checkSql, checkValues, (error, results) => {
    // Se ocorrer algum erro na consulta
    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro ao verificar disponibilidade do horário",
        error: error.message,
      });
    }

    // Se já existir um exame nesse horário
    if (results.length > 0) {
      return res.status(400).json({
        message: "Horário já está ocupado",
      });
    }

    // ====================================================
    // CADASTRAMOS O EXAME
    // ====================================================

    const sql = `
            INSERT INTO exams
            (patient_name, phone, exam_name, exam_date, exam_time)
            VALUES (?, ?, ?, ?, ?)
        `;

    const values = [
      cleanPatientName,
      cleanPhone,
      cleanExamName,
      cleanExamDate,
      cleanExamTime,
    ];

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message: "Erro ao cadastrar o exame",
          error: error.message,
        });
      }

      res.status(201).json({
        message: "Exame cadastrado com sucesso!",
        id: result.insertId,
      });
    });
  });
};

// GET - LISTAR TODOS OS EXAMES
const getExams = (req, res) => {
  const sql = "SELECT * FROM exams";

  db.query(sql, (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro ao buscar os exames",
        error: error.message,
      });
    }

    res.json(results);
  });
};

// GET - BUSCAR EXAME POR ID
const getExamById = (req, res) => {
  const { id } = req.params;

  const sql = "SELECT * FROM exams WHERE id = ?";
  const values = [id];

  db.query(sql, values, (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro ao buscar o exame",
        error: error.message,
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Exame não encontrado",
      });
    }

    res.json(results[0]);
  });
};

// UPDATE - ATUALIZAR EXAME
const updateExam = (req, res) => {
  const { id } = req.params;

  const { patient_name, phone, exam_name, exam_date, exam_time } = req.body;

  // Validamos os dados recebidos
  const validationResult = validateExamData({
    patient_name,
    phone,
    exam_name,
    exam_date,
    exam_time,
  });

  // Se a validação encontrou um erro
  if (typeof validationResult === "string") {
    return res.status(400).json({
      message: validationResult,
    });
  }

  // Pegamos os dados já normalizados
  const {
    patient_name: cleanPatientName,
    phone: cleanPhone,
    exam_name: cleanExamName,
    exam_date: cleanExamDate,
    exam_time: cleanExamTime,
  } = validationResult;

  // ========================================================
  // VERIFICAMOS SE OUTRO EXAME JÁ OCUPA ESSE HORÁRIO
  // ========================================================

  const checkSql = `
        SELECT id
        FROM exams
        WHERE exam_date = ?
        AND exam_time = ?
        AND id <> ?
    `;

  const checkValues = [cleanExamDate, cleanExamTime, id];

  db.query(checkSql, checkValues, (error, results) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro ao verificar disponibilidade do horário",
        error: error.message,
      });
    }

    // Se outro exame já ocupa esse horário
    if (results.length > 0) {
      return res.status(400).json({
        message: "Horário já está ocupado",
      });
    }

    // ====================================================
    // ATUALIZAMOS O EXAME
    // ====================================================

    const sql = `
            UPDATE exams
            SET
                patient_name = ?,
                phone = ?,
                exam_name = ?,
                exam_date = ?,
                exam_time = ?
            WHERE id = ?
        `;

    const values = [
      cleanPatientName,
      cleanPhone,
      cleanExamName,
      cleanExamDate,
      cleanExamTime,
      id,
    ];

    db.query(sql, values, (error, result) => {
      if (error) {
        console.error(error);

        return res.status(500).json({
          message: "Erro ao atualizar o exame",
          error: error.message,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Exame não encontrado",
        });
      }

      res.json({
        message: "Exame atualizado com sucesso!",
      });
    });
  });
};

// ============================================================
// DELETE - EXCLUIR EXAME
// ============================================================

const deleteExam = (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM exams WHERE id = ?";
  const values = [id];

  db.query(sql, values, (error, result) => {
    if (error) {
      console.error(error);

      return res.status(500).json({
        message: "Erro ao excluir o exame",
        error: error.message,
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Exame não encontrado",
      });
    }

    res.json({
      message: "Exame excluído com sucesso!",
    });
  });
};

// ============================================================
// EXPORTAMOS OS CONTROLLERS
// ============================================================

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
};
