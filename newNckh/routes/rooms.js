const express = require('express');
const router = express.Router();
const { getRooms, addRoom, updateRoom, deleteRoom } = require('../controllers/roomController');

// Route to get all rooms
router.get('/', getRooms);

// Route to add a new room
router.post('/', addRoom);

// Route to update room information
router.put('/:id', updateRoom);

// Route to delete a room
router.delete('/:id', deleteRoom);

module.exports = router;
