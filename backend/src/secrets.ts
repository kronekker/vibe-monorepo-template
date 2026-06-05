import fs from 'fs';

// see skills/SECRETS-MANAGEMENT.md
export class Secrets {
    static resolveSecret(envVarName: string): string | undefined {
        const fileVarName = `${envVarName}_FILE`;
        const secretFilePath = process.env[fileVarName];

        if (secretFilePath && fs.existsSync(secretFilePath)) {
            try {
                return fs.readFileSync(secretFilePath, 'utf8').trim();
            } catch (error) {
                console.warn(`Failed to read secret file at ${secretFilePath}:`, error);
            }
        }

        return process.env[envVarName];
    }
}