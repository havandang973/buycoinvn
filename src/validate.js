function isValidWalletAddress(address) {
    return address.length === 48 && (address.startsWith('EQ') || address.startsWith('UQ'));
}

function isValidMemo(text) {
    return /^\d+$/.test(text)
}

function isValidTonAmount(text) {
    return /^\d+(\.\d+)?$/.test(text)
}

module.exports = {
    isValidWalletAddress,
    isValidMemo,
    isValidTonAmount
}