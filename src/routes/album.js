const express = require('express');
const albumController = require('../controllers/album');

const router = express.Router();

router.post('/', albumController.create);
router.get('/', albumController.read);
router.get('/:albumId', albumController.readById)
router.patch('/:albumId', albumController.update)
router.delete('/:albumId', albumController.deleteId)


module.exports = router;