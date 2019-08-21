const { Router } = require('restify-router');
const { users } = require('../../db/index').models;

const router = new Router();

const profileImage = (req, res) => {

};

router.get('/profileImage', profileImage);

module.exports = router;
