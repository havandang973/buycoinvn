const axios = require('axios');

async function getPriceTon() {
    try {
        let res = await axios.get('http://aliniex.com/api/ticker/TON-VND');
        return res.data.ask;
    } catch (error) {
        console.error('Error TON price:', error);
        return null;
    }
}

async function getTonMaxAmount() {
    const tonPrice = await getPriceTon();
    const maxTotalVND = 1955000;
    const tonMaxAmount = Number(parseFloat(maxTotalVND / tonPrice).toFixed(2));
    return tonMaxAmount;
}

module.exports = {
    getPriceTon,
    getTonMaxAmount
}