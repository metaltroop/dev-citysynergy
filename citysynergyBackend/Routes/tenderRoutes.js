// backend/routes/tenderRoutes.js
const express = require('express');
const tenderController = require('../Controller/tenderController');

const router = express.Router();


router.get('/tenders', tenderController.getalltenders);

router.post('/tenders/filter', tenderController.getbyfilterandsearch);
router.post('/tenders/:id', tenderController.gettenderbyID);
router.get("/areas", tenderController.getAreas);
router.get("/local-areas", tenderController.getLocalAreas);



router.post('/checkclashes', tenderController.checkClashes);


module.exports = router;
