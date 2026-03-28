# Todo App Backend 🚀

這是一個基於 **Node.js** 與 **Express** 構建的 RESTful API 後端專案，專為代辦事項（Todo App）管理系統設計。

## 🛠️ 技術棧 (Tech Stack)

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Authentication:** JWT (JSON Web Token) with HttpOnly Cookies
- **Validation:** Joi (實作中)

## ✨ 主要功能

- **身分驗證 (Auth):** 支援使用者註冊、登入，並採用雙 Token 機制強化安全性。
- **任務管理 (CRUD):** 提供完整的新增、查詢、修改、刪除與狀態切換（進行中/已完成）功能。
- **權限保護:** 實作 Middleware 驗證，確保使用者只能操作屬於自己的資料。

## 🚀 快速開始

1. `npm install` 安裝依賴。
2. 參考 `.env.example` 建立 `.env` 檔案並填入連線資訊。
3. `npm run dev` 啟動開發伺服器。

## 專案狀態

本專案目前處於 **Refactoring (重構階段)**，重點在於導入 Joi 資料驗證與 Refresh Token Rotation 安全機制。
