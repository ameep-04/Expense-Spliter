const Group = require('../models/Group');

// CREATE GROUP
async function createGroup(req, res, next) {
  try {
    const { name } = req.body;

    const group = await Group.create({
      name,
      createdBy: req.user._id,
      members: [{ user: req.user._id, role: 'admin' }]
    });

    res.status(201).json({ success: true, group });
  } catch (error) {
    next(error);
  }
}

// ADD MEMBER
async function addMember(req, res, next) {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    group.members.push({ user: userId, role: 'member' });
    await group.save();

    res.json({ success: true, message: 'Member added', group });
  } catch (error) {
    next(error);
  }
}

// GET MY GROUPS
async function getMyGroups(req, res, next) {
  try {
    const groups = await Group.find({ 'members.user': req.user._id });
    res.json({ success: true, groups });
  } catch (error) {
    next(error);
  }
}

// GET SINGLE GROUP
async function getGroup(req, res, next) {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ success: false, message: 'Group not found' });
    }

    res.json({ success: true, group });
  } catch (error) {
    next(error);
  }
}

module.exports = { createGroup, addMember, getMyGroups, getGroup };