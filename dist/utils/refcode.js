"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefCode = generateRefCode;
exports.parseStartPayload = parseStartPayload;
exports.hasGroupParam = hasGroupParam;
const crypto_1 = __importDefault(require("crypto"));
function generateRefCode(len = 8) {
    return crypto_1.default.randomBytes(16).toString("base64url").slice(0, len);
}
function parseStartPayload(text) {
    if (!text)
        return null;
    const parts = text.trim().split(/\s+/);
    if (parts.length < 2)
        return null;
    const payload = parts[1].trim();
    const refCode = payload.split('&')[0];
    return refCode;
}
function hasGroupParam(text) {
    if (!text)
        return false;
    const parts = text.trim().split(/\s+/);
    if (parts.length < 2)
        return false;
    const payload = parts[1].trim();
    return payload.includes('group=true');
}
//# sourceMappingURL=refcode.js.map