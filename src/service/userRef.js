const connection = require('../database/connection.js');
const { sendInlineKeyboard } = require('../helpers/helpers.js');

function saveUserRef(userRef) {
    const query = 'INSERT INTO user_refs (chat_id, ref_code, username) VALUES (?, ?, ?)';
    for (const [chatId, userData] of Object.entries(userRef)) {
        connection.query(query, [chatId, userData.refCode, userData.username], (err, results) => {
            if (err) throw err;
        });
    }
}

function loadUserRef(userRef) {
    const query = 'SELECT chat_id, ref_code, username FROM user_refs';
    connection.query(query, (err, results) => {
        if (err) throw err;
        results.forEach(row => {
            userRef[row.chat_id] = { refCode: row.ref_code, username: row.username };
        });
    });
}

function handleStartCommand(bot, msg, ref, userRef, userStates, info_order) {
    const chatId = msg.chat.id;
    const username = msg.from.username || ''; 
    let refCode = 'KkjBNEbWgV';

    if (ref[1] && !userRef[chatId]) {
        refCode = ref[1].trim();
        userRef[chatId] = { refCode: refCode, username: username };
        saveUserRef(userRef);
    }
    
    if (!ref[1] && !userRef[chatId]) {
        userRef[chatId] = { refCode: refCode, username: username };
        saveUserRef(userRef);
    }

    userStates[chatId] = null;
    info_order[chatId] = {};
    info_order[chatId].ref = userRef[chatId].refCode;

    sendInlineKeyboard(bot, chatId, 
        '*Aliniex* là một trong những nền tảng on/off ramp tốt nhất tại VN từ 2017, cho phép người dùng có thể mua và bán Tiền Điện Tử dễ dàng & an toàn.', 
        [[{ text: 'Mua', callback_data: 'buy' }]]
    );
}

module.exports = {
    saveUserRef,
    loadUserRef,
    handleStartCommand
}