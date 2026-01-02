# 🎯 2026 戰鬥系統 Command Center

個人年度目標追蹤與日程管理儀表板

---

# 📦 Vercel 部署教學（給完全沒有程式基礎的人）

## 你需要什麼？

1. ✅ 一台電腦（Windows / Mac 都可以）
2. ✅ 網路連線
3. ✅ 一個 Email 信箱
4. ✅ 大約 10-15 分鐘的時間

---

## 第一步：下載這個專案資料夾

你現在應該已經有了 `command-center-2026` 這個資料夾。

確認裡面有這些檔案：
```
command-center-2026/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── src/
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

---

## 第二步：註冊 GitHub 帳號（如果你還沒有）

### 為什麼需要 GitHub？
Vercel 需要從 GitHub 抓取你的程式碼。就像你把檔案放到雲端硬碟，Vercel 再從那裡複製過去。

### 步驟：

1. **打開瀏覽器**，前往 👉 https://github.com

2. **點擊右上角的「Sign up」**（綠色按鈕）

3. **填寫資料：**
   - Enter your email → 輸入你的 Email
   - Create a password → 設定密碼（8個字以上，要有數字）
   - Enter a username → 取一個用戶名（英文，例如：cross2026）
   - 點擊「Continue」

4. **驗證你是人類**（可能會要你玩個小遊戲）

5. **去 Email 收驗證信**，輸入驗證碼

6. **完成！** 你現在有 GitHub 帳號了 🎉

---

## 第三步：把專案上傳到 GitHub

### 方法 A：使用網頁上傳（最簡單）

1. **登入 GitHub 後**，點擊右上角的 **「+」** 按鈕

2. **選擇「New repository」**

3. **填寫：**
   - Repository name：`command-center-2026`
   - Description：`我的2026戰鬥系統`（選填）
   - 選擇 **「Public」**
   - **不要**勾選「Add a README file」
   - 點擊 **「Create repository」**

4. **你會看到一個空白頁面**，找到「uploading an existing file」這行字，點擊它

5. **把整個 `command-center-2026` 資料夾裡的所有檔案拖進去**
   - ⚠️ 注意：是拖「裡面的檔案」，不是拖資料夾本身
   - 包括 `src` 資料夾也要拖進去

6. **往下滾動**，點擊綠色的 **「Commit changes」** 按鈕

7. **完成！** 你的程式碼現在在 GitHub 上了 🎉

---

## 第四步：註冊 Vercel 帳號

1. **打開瀏覽器**，前往 👉 https://vercel.com

2. **點擊「Start Deploying」** 或 **「Sign Up」**

3. **選擇「Continue with GitHub」**（用 GitHub 帳號登入）

4. **授權 Vercel 存取你的 GitHub**
   - 點擊「Authorize Vercel」

5. **完成！** 你現在有 Vercel 帳號了 🎉

---

## 第五步：部署你的網站（最關鍵！）

1. **在 Vercel 首頁**，點擊 **「Add New...」** → **「Project」**

2. **你會看到你的 GitHub 專案列表**
   - 找到 `command-center-2026`
   - 點擊旁邊的 **「Import」** 按鈕

3. **設定頁面出現了**，你需要確認：

   | 設定項目 | 應該填什麼 |
   |---------|-----------|
   | Project Name | `command-center-2026`（可以改成你喜歡的） |
   | Framework Preset | **Vite**（很重要！如果沒自動選到就手動選） |
   | Root Directory | `.`（保持預設） |

4. **其他設定不用動**，直接往下滾

5. **點擊「Deploy」按鈕**

6. **等待 1-2 分鐘**...你會看到一堆文字在跑，這是正常的

7. **看到「Congratulations!」或煙火動畫** = 成功了！🎉

8. **點擊預覽圖或「Visit」按鈕**，你的網站就上線了！

---

## 第六步：取得你的網址

部署成功後，Vercel 會給你一個網址，格式像這樣：

```
https://command-center-2026.vercel.app
```

或者

```
https://command-center-2026-xxx.vercel.app
```

**這個網址你可以：**
- ✅ 在手機上打開
- ✅ 加到手機主畫面（像 App 一樣）
- ✅ 分享給任何人

---

## 🆘 常見問題

### Q: 部署失敗怎麼辦？

**看到紅色錯誤訊息？**

1. 確認 `Framework Preset` 有選 **Vite**
2. 確認所有檔案都有上傳到 GitHub
3. 特別確認 `src` 資料夾裡面有 `App.jsx`、`main.jsx`、`index.css`

### Q: 我想改網站內容怎麼辦？

1. 在 GitHub 上找到 `src/App.jsx`
2. 點擊檔案，再點擊右上角的✏️鉛筆圖示
3. 修改內容
4. 往下點「Commit changes」
5. Vercel 會**自動重新部署**（大約 1 分鐘）

### Q: 我想改網址怎麼辦？

1. 在 Vercel 進入你的專案
2. 點擊「Settings」
3. 點擊「Domains」
4. 可以改預設網址或加自己的網域

---

## 📱 加到手機主畫面

### iPhone：
1. 用 Safari 打開你的網址
2. 點底部的「分享」按鈕（方框+箭頭）
3. 往下滑，選「加入主畫面」
4. 完成！

### Android：
1. 用 Chrome 打開你的網址
2. 點右上角三個點
3. 選「加到主畫面」
4. 完成！

---

## 🔄 以後想更新怎麼辦？

每次你在 GitHub 上修改檔案並 Commit，Vercel 都會**自動重新部署**。

你什麼都不用做，大約 1-2 分鐘後刷新網頁就會看到更新。

---

## 需要幫助？

如果遇到任何問題，可以：
1. 截圖錯誤訊息
2. 回到 Claude 問我

祝你部署順利！🚀
