function sendInlineKeyboard(bot, chatId, text, buttons) {
    const opts = {
        reply_markup: {
            inline_keyboard: buttons
        },
        parse_mode: 'Markdown'
    };
    bot.sendMessage(chatId, text, opts);
}

module.exports = {
    sendInlineKeyboard
};
