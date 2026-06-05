import fs from 'fs';

export class Secrets {
    static resolveSecret(secretKey: string): string | undefined {
        const fileVarName = `${secretKey}_FILE`;
        const secretFilePath = process.env[fileVarName];

        if (secretFilePath && fs.existsSync(secretFilePath)) {
            try {
                return fs.readFileSync(secretFilePath, 'utf8').trim();
            } catch (error) {
                console.warn(`Failed to read secret file at ${secretFilePath}:`, error);
            }
        }

        // 2. Fallback to the standard environment variable string
        return process.env[secretKey];
    }
}
