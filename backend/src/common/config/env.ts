import "dotenv/config";

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const env = {
  port: parseInt(process.env["PORT"] ?? "5001", 10),
  mongoUri: requireEnv("MONGO_URI"),
  jwtSecret: requireEnv("JWT_SECRET"),
  jwtExpiresIn: process.env["JWT_EXPIRES_IN"] ?? "7d",
  clientUrl: process.env["CLIENT_URL"] ?? "http://localhost:5173",
  aws: {
    region: process.env["AWS_REGION"] ?? "",
    accessKeyId: process.env["AWS_ACCESS_KEY_ID"] ?? "",
    secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"] ?? "",
    s3Bucket: process.env["AWS_S3_BUCKET"] ?? "",
  },
  smtp: {
    host: process.env["SMTP_HOST"] ?? "",
    port: parseInt(process.env["SMTP_PORT"] ?? "587", 10),
    user: process.env["SMTP_USER"] ?? "",
    password: process.env["SMTP_PASSWORD"] ?? "",
    from: process.env["SMTP_FROM"] ?? "",
  },
} as const;
