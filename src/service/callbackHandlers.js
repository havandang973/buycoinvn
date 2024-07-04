const ton = require('../ton.js');
const { sendInlineKeyboard } = require('../helpers/helpers.js');
// let tonMaxAmount = {};

async function handleBuyCallback(bot, chatId, userStates) {
    userStates[chatId] = 'awaiting_wallet_address';
    bot.sendMessage(chatId, 'Nhập địa chỉ ví nhận TON của bạn:');
}

async function handleContinueCallback(bot, chatId, userStates) {
    userStates[chatId] = 'success_wallet_address';
    sendInlineKeyboard(bot, chatId, 
        'Nếu địa chỉ ví mà bạn nhập đến từ một sàn tập trung (CEX) bạn sẽ cần nhập mã Memo do sàn cung cấp để tránh thất lạc tài sản. Còn nếu địa chỉ ví của bạn là phi tập trung bạn có thể bỏ qua.', 
        [
            [{ text: 'Nhập Memo', callback_data: 'memo' }],
            [{ text: 'Không có Memo', callback_data: 'nomemo' }]
        ]
    );
}

async function handleBackCallback(bot, chatId, userStates) {
    userStates[chatId] = 'awaiting_wallet_address';
    bot.sendMessage(chatId, 'Nhập địa chỉ ví nhận TON của bạn:');
}

async function handleMemoCallback(bot, chatId, userStates) {
    userStates[chatId] = 'memo_code';
    bot.sendMessage(chatId, 'Nhập mã memo của bạn:');
}

async function handleNoMemoCallback(bot, chatId, userStates, info_order, tonMinAmount, tonMaxAmount) {
    info_order[chatId] = info_order[chatId] || {}; 
    bot.sendMessage(chatId, 'Hệ thống đang ghi nhận. Vui lòng đợi trong giây lát...');
    try {
        // tonMaxAmount = await ton.getTonMaxAmount();
        info_order[chatId].memo = '';
        userStates[chatId] = 'ton_amount';
        bot.sendMessage(chatId, `Nhập số lượng TON mà bạn muốn mua (tối thiểu: ${tonMinAmount} TON, tối đa: ${tonMaxAmount} TON).`);
    } catch (ex) {
        bot.sendMessage(chatId, 'Nhập số lượng TON mà bạn muốn mua:');
    }
}

async function handleAmountCallback(bot, chatId, userStates, tonMinAmount, tonMaxAmount) {
    // bot.sendMessage(chatId, 'Hệ thống đang ghi nhận. Vui lòng đợi trong giây lát...');
    try {
        // tonMaxAmount = await ton.getTonMaxAmount();
        userStates[chatId] = 'ton_amount';
        bot.sendMessage(chatId, `Nhập số lượng TON mà bạn muốn mua (tối thiểu: ${tonMinAmount} TON, tối đa: ${tonMaxAmount} TON).`);
    } catch (ex) {
        bot.sendMessage(chatId, 'Nhập số lượng TON mà bạn muốn mua:');
    }
}

module.exports = {
    handleBuyCallback,
    handleContinueCallback,
    handleBackCallback,
    handleMemoCallback,
    handleNoMemoCallback,
    handleAmountCallback
};
