const users = [
  { id: 1, username: 'admin', password: 'admin123', role: 'admin' },
  { id: 2, username: 'user', password: 'user123', role: 'user' },
  { id: 3, username: 'john', password: 'john123', role: 'user' }
];

let rooms = [
  { id: 1, name: 'Conference Room A', capacity: 10 },
  { id: 2, name: 'Meeting Room B', capacity: 6 }
];

let bookings = [];

module.exports = {
  users,
  rooms,
  bookings,
  
  findUser: (username, password) => users.find(u => u.username === username && u.password === password),
  
  addRoom: (name, capacity) => {
    const id = rooms.length + 1;
    const room = { id, name, capacity };
    rooms.push(room);
    return room;
  },
  
  getRooms: () => rooms,
  
  addBooking: (roomId, date, startTime, endTime, userId) => {
    const id = bookings.length + 1;
    const booking = { id, roomId: parseInt(roomId), date, startTime, endTime, userId, status: 'pending' };
    bookings.push(booking);
    return booking;
  },
  
  isRoomAvailable: (roomId, date, startTime, endTime) => {
    return !bookings.some(b => 
      b.roomId === parseInt(roomId) && 
      b.date === date && 
      b.status === 'approved' &&
      ((startTime >= b.startTime && startTime < b.endTime) ||
       (endTime > b.startTime && endTime <= b.endTime) ||
       (startTime <= b.startTime && endTime >= b.endTime))
    );
  },

  hasApprovedBooking: (roomId, date, startTime, endTime) => {
    return bookings.some(b => 
      b.roomId === parseInt(roomId) && 
      b.date === date && 
      b.status === 'approved' &&
      ((startTime >= b.startTime && startTime < b.endTime) ||
       (endTime > b.startTime && endTime <= b.endTime) ||
       (startTime <= b.startTime && endTime >= b.endTime))
    );
  },

  searchAvailableRooms: (date, startTime, endTime) => {
    const approvedBookings = bookings.filter(b => b.status === 'approved');
    const pendingBookings = bookings.filter(b => b.status === 'pending');
    
    return rooms.map(room => {
      const hasApprovedConflict = approvedBookings.some(b => 
        b.roomId === room.id && 
        b.date === date && 
        ((startTime >= b.startTime && startTime < b.endTime) ||
         (endTime > b.startTime && endTime <= b.endTime) ||
         (startTime <= b.startTime && endTime >= b.endTime))
      );
      
      const hasPendingConflict = pendingBookings.some(b => 
        b.roomId === room.id && 
        b.date === date && 
        ((startTime >= b.startTime && startTime < b.endTime) ||
         (endTime > b.startTime && endTime <= b.endTime) ||
         (startTime <= b.startTime && endTime >= b.endTime))
      );
      
      return {
        ...room,
        availability: hasApprovedConflict ? 'unavailable' : (hasPendingConflict ? 'pending' : 'available')
      };
    });
  },

  approveBooking: (bookingId) => {
    const booking = bookings.find(b => b.id === parseInt(bookingId));
    if (booking) booking.status = 'approved';
    return booking;
  },

  removeBooking: (bookingId) => {
    const index = bookings.findIndex(b => b.id === parseInt(bookingId));
    if (index > -1) return bookings.splice(index, 1)[0];
    return null;
  },

  getUserBookings: (userId) => {
    return bookings.filter(b => b.userId === userId);
  },
  
  getBookings: () => bookings
};
