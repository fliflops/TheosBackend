const express = require('express');
const router = express.Router();

router.get('/', async(req, res) => {
    try{

        res.render('../views/landingpage/index', {})

    }
    catch(e) {
        console.log(e)
        res.send(req.flash(`error_msg','ERROR : ${e.message}`));
        res.redirect('/');
    }
})

module.exports = router;