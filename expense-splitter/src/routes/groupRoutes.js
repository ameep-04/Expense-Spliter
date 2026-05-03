const express = require('express');
const router = express.Router();
const { createGroup, addMember, getMyGroups, getGroup } = require('../controllers/groupController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/create', createGroup);
router.get('/my-groups', getMyGroups);
router.get('/:groupId', getGroup);
router.post('/:groupId/add-member', addMember);

module.exports = router;