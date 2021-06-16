import crypto from 'crypto';
import fs from 'fs';

export const verifySignature = (signature: string, body: string): boolean => {
    const verifier =  crypto.createVerify('RSA-SHA256');
    const pubkey = fs.readFileSync('./lib/webhook/id_rsa.pub', 'utf8');
    const signatureBuffer = Buffer.from(signature, 'base64');
    verifier.update(body);
    return verifier.verify(pubkey, signatureBuffer);
}