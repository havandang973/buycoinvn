const TelegramBot = require('node-telegram-bot-api');
const token = '7212014419:AAG8C02-BQnJx1YErN1Z4G2wrL5yjRO346g';
const bot = new TelegramBot(token, { polling: true });
const baseUrl = 'https://aliniex.com/orders?items=ton';
// const createNewOrder = 'https://t.me/buycoinvn_bot?start=';

const userRefCode = require('./service/userRef.js');
const callbackHandlers = require('./service/callbackHandlers.js');
const messageHandlers = require('./service/messageHandlers.js');

const userStates = {};
const info_order = {};
const userRef = {};
const tonMaxAmount = 9.5;
const tonMinAmount = 0.1;

userRefCode.loadUserRef(userRef);

bot.onText(/\/start(\s.+)?/, (msg, ref) => {
    userRefCode.handleStartCommand(bot, msg, ref, userRef, userStates, info_order);
});

bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;

    if (callbackQuery.data === 'buy') {
        await callbackHandlers.handleBuyCallback(bot, chatId, userStates);
    } else if (callbackQuery.data === 'continute') {
        await callbackHandlers.handleContinueCallback(bot, chatId, userStates);
    } else if (callbackQuery.data === 'back') {
        await callbackHandlers.handleBackCallback(bot, chatId, userStates);
    } else if (callbackQuery.data === 'memo') {
        await callbackHandlers.handleMemoCallback(bot, chatId, userStates);
    } else if (callbackQuery.data === 'nomemo') {
        await callbackHandlers.handleNoMemoCallback(bot, chatId, userStates, info_order, tonMinAmount, tonMaxAmount);
    } else if (callbackQuery.data === 'amount') {
        await callbackHandlers.handleAmountCallback(bot, chatId, userStates, tonMinAmount, tonMaxAmount);
    }
});

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (userStates[chatId] === 'awaiting_wallet_address') {
        await messageHandlers.handleWalletAddress(bot, msg, userStates, info_order);
    } else if (userStates[chatId] === 'memo_code') {
        await messageHandlers.handleMemo(bot, msg, userStates, info_order);
    } else if (userStates[chatId] === 'ton_amount') {
        await messageHandlers.handleTonAmount(bot, msg, userStates, info_order, tonMinAmount, tonMaxAmount, baseUrl, createNewOrder, userRef);
    } else if (!text.match(/\/start/)) {
        bot.sendMessage(chatId, 'Lệnh không hợp lệ!');
    }
});


