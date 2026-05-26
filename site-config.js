/*
  資料統整檔。
  本檔案會把 site-config.js、home-data.js、research-data.js、faculty-data.js、news-data.js 合併成網站使用的 TMRC_DATA。
  一般內容維護請不要修改本檔案，請改對應的資料檔。
*/
window.TMRC_DATA = Object.assign(
  {},
  window.TMRC_SITE_CONFIG || {},
  window.TMRC_HOME_DATA || {},
  window.TMRC_RESEARCH_DATA || {},
  window.TMRC_FACULTY_DATA || {},
  window.TMRC_NEWS_DATA || {}
);
