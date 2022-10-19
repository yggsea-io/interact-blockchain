const path = require('path');
const fs = require("fs");
const { getAddress } = require('@ethersproject/address');
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const RequestVerifier = (req, res, next) => {
    if (!req.headers.authorization || !req.headers['x-api-key']) {
        return res.status(403).json({ error: 'Forbidden!' });
    }
    const token = req.headers.authorization.substr(7);
    const apiKey = req.headers['x-api-key'];
    try {
        const pubkey = path.join(__dirname, `../../cert/${apiKey}`);
        if (!fs.existsSync(pubkey)) {
            return res.status(403).json({ error: 'Invalid apikey!' });
        }
        const decoded = jwt.verify(token, fs.readFileSync(pubkey));
        if (decoded.sub != apiKey) {
            return res.status(403).json({ error: 'Invalid sub!' });
        }
        if (decoded.uri != req.url) {
            return res.status(403).json({ error: 'Invalid uri!' });
        }
        const body = req.body ? JSON.stringify(req.body) : "";
        const bodyHash = crypto.createHash("sha256").update(body).digest().toString("hex");
        if (decoded.bodyHash != bodyHash) {
            return res.status(403).json({ error: 'Invalid body hash!' });
        }
    } catch {
        return res.status(403).json({ error: 'Invalid token!' });
    }
    next();
}

const verifyAddress = (address) => {
    try {
        getAddress(address);
        return true;
    } catch (err) {
        return false;
    }
}

module.exports = {
    RequestVerifier,
    verifyAddress
}