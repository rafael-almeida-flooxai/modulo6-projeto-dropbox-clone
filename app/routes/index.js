const express = require('express');
const router = express.Router();
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.delete('/file', (req, res) => {
  let form = new formidable.IncomingForm({
    uploadDir: './upload',
    keepExtensions: true
  })

  form.parse(req, (err, fields, files) => {

    let path = "./" + fields.path;

    if (fs.existsSync(fields.path)) {

      fs.unlink(path, err => {

        if (err) {

          res.status(400).json({

            err

          });

        } else

          res.json({
            fields
          });

      })

    }



  });
})

router.post('/upload', (req, res) => {
  const form = new formidable.IncomingForm({
    uploadDir: path.join(__dirname, '../upload'),
    keepExtensions: true
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Erro ao processar upload:', err);
      return res.status(500).json({ error: 'Erro no upload' });
    }

    const uploadedFile = files['input-file'];

    if (!uploadedFile) {
      return res.status(400).json({ error: 'Nenhum arquivo recebido.' });
    }

    // Formidable pode retornar array ou objeto direto
    const file = Array.isArray(uploadedFile) ? uploadedFile[0] : uploadedFile;

    const fileData = {
      name: file.originalFilename || file.name,
      type: file.mimetype,
      path: path.basename(file.filepath || file.path)
    };

    res.json({ files: { 'input-file': fileData } });
  });
});

router.get('/file', (req, res) => {
  const fileName = req.query.path;

  if (!fileName) {
    return res.status(400).send('Parâmetro "path" é obrigatório');
  }

  const filePath = path.join(__dirname, '../upload', fileName);

  res.sendFile(filePath, err => {
    if (err) {
      console.error('Erro ao enviar arquivo:', err);
      res.status(404).send('Arquivo não encontrado');
    }
  });
});

module.exports = router;
