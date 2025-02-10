import CryptoJS from "crypto-js";


export const Encryption=async({value,secretkey}={})=>{
    return CryptoJS.AES.encrypt(JSON.stringify(value),secretkey).toString()
}

export const Decryption=async({cipher,secretkey}={})=>{
    return CryptoJS.AES.decrypt(cipher,secretkey).toString(CryptoJS.enc.Utf8)
}