import { Server } from "socket.io";

let id = 1;
let connectedCount = 0;

export const createSocket = (httpServer) => {
    const io = new Server(httpServer, {
        // ניתן להוסיף הגדרות נוספות על השרת
        // cors: { origin: '*', methods: ['GET', 'POST'] }
    });

    // כשלקוח מתחבר לשרת
    // socket - נתוני הלקוח שהתחבר כרגע
    io.on('connection', (socket) => {
        // ניתן להוסיף נתונים על היוזר הנוכחי בצורה כזו לסוקט

        connectedCount++;
        io.emit('update counter', connectedCount);

        socket.userId = id++;
        console.log(`user ${socket.userId} connected successfully`);

        // שליחת אירוע לקליינט הנוכחי שהתחבר
        // בשם שאנחנו בחרנו
        // הקליינט יקבל את המידע רק אם הוא רשום לאירוע
        socket.emit('user connected', { userId: socket.userId });

       socket.on('disconnect', () => {
       const leavingUser = socket.username || `User ${socket.userId}`;
       connectedCount--;
       io.emit('update counter', connectedCount);
       console.log(`User leaving: ${leavingUser}`); 
       io.emit('send message', { 
          name: "System", 
          color: "#808080", 
          msg: `${leavingUser} has left the chat.` 
      });
  });


        socket.on('update_user_details', (data) => {
            socket.username = data.username;
            socket.userColor = data.color;
            console.log(` user updated: ${socket.username}, color: ${socket.userColor}`);
        });

        socket.on('new message', (newMessage) => {
            // שיגור אירוע לכל הלקוחות שמחוברים כרגע
            // io.emit('send message', `new message added by ${socket.userId}: ${newMessage}`)
            io.emit('send message', { 
            name: socket.username || 'unknown', 
            color: socket.userColor || '#000000', 
            msg: newMessage 
       });
     });
    });
};