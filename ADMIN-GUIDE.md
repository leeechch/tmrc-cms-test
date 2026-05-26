# TMRC 靜態網站中英文管理版

這是一個保留 GitHub Pages 靜態網站形式、但將內容集中到資料檔管理的版本。

## 主要修改概念

原本網站是中英文各自一批 HTML：

- `index.html` / `index_en.html`
- `research.html` / `research_en.html`
- `members.html` / `members_en.html`
- `news.html` / `news_en.html`
- `research/` / `research_en/`
- `members/` / `members_en/`
- `news/` / `news_en/`

新版改成：

- 頁面版型：`index.html`, `research.html`, `members.html`, `news.html`, `article.html`, `member.html`
- 內容資料：`data/site-data.js`
- 共用渲染程式：`js/site-render.js`
- 樣式：`css/style.css`
- 圖片：`images/`

行政人員主要只需要改：

```text
data/site-data.js
```

## 如何切換語言

中文版：

```text
index.html?lang=zh-TW
research.html?lang=zh-TW
members.html?lang=zh-TW
news.html?lang=zh-TW
```

英文版：

```text
index.html?lang=en
research.html?lang=en
members.html?lang=en
news.html?lang=en
```

若網址沒有 `?lang=en`，預設顯示中文。

## 新增最新消息

打開：

```text
data/site-data.js
```

找到：

```js
news: [
  ...
]
```

複製一筆既有資料，貼到陣列最上方，並修改：

```js
{
  id: "new-news-id",
  date: {
    zhTW: "2026年05月27日",
    en: "May 27, 2026"
  },
  zhTW: {
    title: "中文標題",
    paragraphs: [
      "中文第一段",
      "中文第二段"
    ]
  },
  en: {
    title: "English Title",
    paragraphs: [
      "English paragraph 1",
      "English paragraph 2"
    ]
  }
}
```

注意：`id` 請使用英文、數字與連字號，不要重複。例如：

```text
new-equipment-announcement
industry-collaboration-2026
```

## 新增研究項目

打開：

```text
data/site-data.js
```

找到：

```js
researchArticles: [
  ...
]
```

複製一筆既有研究項目，修改：

- `id`
- `categoryId`
- 中文標題與內文
- 英文標題與內文
- 圖片 `src`
- 圖片說明 `caption`

接著到：

```js
researchCategories
```

把新研究項目的 `id` 加到對應組別的 `items` 裡。

三個組別的 `categoryId` 分別是：

```text
component-system-design
device-manufacturing
thermal-materials
```

## 新增或修改成員

打開：

```text
data/site-data.js
```

找到：

```js
members: [
  ...
]
```

每一位老師是一筆資料。主要可修改：

- `name`
- `image`
- `card.education`
- `card.specialization`
- `degree`
- `team`
- `areas`
- `contact`
- `projects`

圖片請先放在：

```text
images/
```

然後在 `image` 欄位填：

```text
images/檔名.jpg
```

## 研究計畫表格

每位成員的研究計畫在：

```js
projects: [
  {
    role: "...",
    name: "...",
    title: "...",
    date: "...",
    agency: "..."
  }
]
```

如果要讓計畫名稱換行，可在 `title` 裡加入：

```html
<br>
```

## 測試建議

如果要先測試，不要直接覆蓋正式首頁。建議把整個新版資料夾放進 main branch 的：

```text
cms-test/
```

測試網址會是：

```text
https://tmrc-ncu.github.io/cms-test/
```

英文版測試：

```text
https://tmrc-ncu.github.io/cms-test/index.html?lang=en
```

確認沒問題後，再把新版檔案搬到 repo 根目錄，取代正式版。

## 舊網址相容

本版本保留舊網址的 redirect 檔案，例如：

```text
research_en/five-axis-milling.html
members/陳冠廷.html
news/熱管理技術研究中心正式成立.html
```

這些舊網址會自動轉到新的資料驅動頁面。
