# Ziwei Secure (Vercel)

## 環境變數（於 Vercel Project Settings 設定）
- `APP_PASSWORD`：登入用密碼（自定）
- `JWT_SECRET`：任意隨機長字串（>=32字元）

## 本地測試
```bash
npm i
npx vercel dev
```

## 部署
```bash
npx vercel --prod
```

## 使用
- `POST /api/login` { password } → { token }
- `POST /api/convert` (Header: Authorization: Bearer <token>) { rawText } → { data, tableHtml, prompt }
