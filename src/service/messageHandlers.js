const validate = require('../validate.js');
const { sendInlineKeyboard } = require('../helpers/helpers.js');

async function handleWalletAddress(bot, msg, userStates, info_order) {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (validate.isValidWalletAddress(text)) {
        userStates[chatId] = null;
        info_order[chatId] = info_order[chatId] || {}; 

        info_order[chatId].wallet = text;

        sendInlineKeyboard(bot, chatId, 
            `Hệ thống ghi nhận địa chỉ ví của bạn là:\n*${text}*\n\nChúng tôi sẽ gửi TON tới địa chỉ ví này khi quá trình thanh toán hoàn tất. Hãy kiểm tra lại kỹ trước khi thực hiện các bước tiếp theo. Nếu bạn muốn thay đổi địa chỉ ví xin hãy bắt đầu lại từ đầu.`,
            [
                [{ text: 'Tiếp tục', callback_data: 'continute' }],
                [{ text: 'Quay lại từ đầu', callback_data: 'back' }]
            ]
        );
    } else {
        bot.sendMessage(chatId, 'Địa chỉ ví không hợp lệ! Vui lòng nhập lại địa chỉ ví nhận TON của bạn:');
    }
}

async function handleMemo(bot, msg, userStates, info_order) {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (validate.isValidMemo(text)) {
        info_order[chatId] = info_order[chatId] || {};

        info_order[chatId].memo = text;

        sendInlineKeyboard(bot, chatId, 
            `Hệ thống ghi nhận mã Memo của bạn là: *${text}*`,
            [
                [{ text: 'Tiếp tục', callback_data: 'amount' }]
            ]
        );
    } else {
        bot.sendMessage(chatId, 'Memo phải là số!');
    }
}

async function handleTonAmount(bot, msg, userStates, info_order, tonMinAmount, tonMaxAmount, baseUrl, createNewOrder, userRef) {
    console.log(tonMaxAmount)
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!info_order[chatId].wallet) {
        bot.sendMessage(chatId, 'Thông tin chưa đầy đủ. Vui lòng bắt đầu lại.');
        return;
    }

    if (validate.isValidTonAmount(text)) {
        const amount = Number(parseFloat(text).toFixed(2));

        if (amount >= tonMinAmount && amount <= tonMaxAmount) {
            userStates[chatId] = null;
            info_order[chatId].amount = amount;
            const url_redirect = `${baseUrl}&wallet_address=${info_order[chatId].wallet}&network=ton&referral_code=${info_order[chatId].ref}&amounts=${info_order[chatId].amount}&memo=${info_order[chatId].memo}`;

            sendInlineKeyboard(bot, chatId, 
                `Thông tin đơn hàng của bạn:\nĐịa chỉ ví: \n*${info_order[chatId].wallet}*\nMạng: *TON*\nMemo: *${info_order[chatId].memo}*\nSố lượng TON: *${info_order[chatId].amount}*`,
                [
                    [{ text: 'Thanh toán', url: url_redirect }],
                    [{ text: 'Tạo lệnh mới', url: `${createNewOrder}${userRef[chatId].refCode}` }]
                ]
            );
        } else {
            bot.sendMessage(chatId, `Vui lòng nhập lại số lượng TON (tối thiểu: ${tonMinAmount} TON, tối đa: ${tonMaxAmount} TON).`);
        }
    } else {
        bot.sendMessage(chatId, 'Giá trị nhập vào không hợp lệ. Vui lòng nhập một số.');
    }
}

module.exports = {
    handleWalletAddress,
    handleMemo,
    handleTonAmount
};
