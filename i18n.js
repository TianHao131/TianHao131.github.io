(() => {
  'use strict';
  const languages=['zh-CN','zh-HK','en'],key='tian-jaho-language-v1';
  const rows=[
    ['收起面板','收起面板','Collapse panel'],['展开面板','展開面板','Expand panel'],
    ['文字块位置','文字區塊位置','Text block position'],['开启自由拖动','開啟自由拖動','Enable free dragging'],['关闭自由拖动','關閉自由拖動','Disable free dragging'],['重置位置','重設位置','Reset position'],['水平 X（px）','水平 X（px）','Horizontal X (px)'],['垂直 Y（px）','垂直 Y（px）','Vertical Y (px)'],['当前调整：电脑位置','目前調整：電腦位置','Editing desktop position'],['当前调整：手机位置','目前調整：手機位置','Editing mobile position'],['开启后拖动文字块；关闭后继续改字。电脑与手机位置分别保存，三种语言共用位置。文字可以重叠。','開啟後拖動文字區塊；關閉後繼續改字。電腦與手機位置分開儲存，三種語言共用位置。文字可以重疊。','Enable dragging to move text blocks; disable it to edit text. Desktop and mobile positions are saved separately and shared across languages. Blocks may overlap.'],['已移动文字块，可用「撤销」恢复。','已移動文字區塊，可用「復原」還原。','Text block moved. Use Undo to restore it.'],['已重置文字块位置。','已重設文字區塊位置。','Text block position reset.'],
    ['田哲豪','田哲豪','TIAN Jaho'],['数学','數學','Mathematics'],['香港','香港','Hong Kong'],
    ['邮箱','電郵','Email'],['香港电话','香港電話','Hong Kong phone'],['内地电话','內地電話','Mainland China phone'],['微信','微信','WeChat'],['复制','複製','Copy'],
    ['关于','關於','About'],['项目与贡献','項目與貢獻','Projects & Contributions'],['教育经历','教育經歷','Education'],['教学经历','教學經歷','Teaching'],['荣誉与奖项','榮譽與獎項','Honors & Awards'],
    ['项目','項目','Projects'],['教育','教育','Education'],['教学','教學','Teaching'],['更多','更多','Honors'],
    ['跳到主要内容','跳至主要內容','Skip to main content'],['Jaho，回到首页','Jaho，回到首頁','Jaho, back to home'],['页面导航','頁面導覽','Main navigation'],['履历栏目','履歷欄目','Resume sections'],
    ['个人资料与联系方式','個人資料與聯絡方式','Profile and contact details'],['田哲豪的姓名缩写 TJ','田哲豪的姓名縮寫 TJ','TIAN Jaho’s initials, TJ'],
    ['数学 ·','數學 ·','Mathematics ·'],['我在','我在','I study at '],['香港科技大学（HKUST）','香港科技大學（HKUST）','HKUST'],
    ['修读数学（Computer Science Track），预计 2029 年夏季毕业。','修讀數學（Computer Science Track），預計 2029 年夏季畢業。',', majoring in Mathematics (Computer Science Track). I expect to graduate in summer 2029.'],
    ['做过 Python 解谜游戏、个人导航网和每日任务网站，也曾在救恩書院及补习社担任兼职导师，教授 HKDSE M2 和 ICT。如需联系，可发','做過 Python 解謎遊戲、個人導航網和每日任務網站，也曾在救恩書院及補習社擔任兼職導師，教授 HKDSE M2 和 ICT。如需聯絡，可發','I have worked on a Python puzzle game, a bookmark manager and a daily planner. I also taught HKDSE M2 and ICT part-time at Kau Yan College and a tutorial centre. To get in touch, '],
    ['电邮','電郵','email'],['给我。','給我。',' me.'],['CGA 截至 2025/26 学年结束','CGA 截至 2025/26 學年結束','CGA as of the end of 2025/26'],
    ['语言与技能','語言與技能','Languages & Skills'],['语言','語言','Languages'],['编程','程式設計','Programming'],['工具','工具','Tools'],['开发工具','開發工具','Development tools'],
    ['粤语、普通话（母语）','粵語、普通話（母語）','Cantonese and Mandarin (native)'],['英语（熟练）','英語（熟練）','English (proficient)'],['Codex、DeepSeek（辅助编程）','Codex、DeepSeek（輔助編程）','Codex and DeepSeek (coding assistance)'],
    ['个人项目','個人項目','View projects'],['下载 CV','下載 CV','Download CV'],['点击解谜游戏','點擊解謎遊戲','Point-and-click puzzle game'],['2024；2026 年继续开发','2024；2026 年繼續開發','2024; development resumed in 2026'],
    ['2024 年用 Python 和 Pygame 编写游戏原型，负责程序、剧情和谜题设计。玩家通过对话选择和点击场景物件推进游戏，触发不同结局。2026 年重新开始开发，使用 Codex 和 DeepSeek 辅助编程。','2024 年用 Python 和 Pygame 編寫遊戲原型，負責程式、劇情和謎題設計。玩家透過對話選擇和點擊場景物件推進遊戲，觸發不同結局。2026 年重新開始開發，使用 Codex 和 DeepSeek 輔助編程。','Built a game prototype in Python and Pygame in 2024, including the code, story and puzzles. Players progress through dialogue choices and interactions with scene objects, leading to different endings. Resumed development in 2026 with coding assistance from Codex and DeepSeek.'],
    ['个人导航网','個人導航網','Personal Bookmark Manager'],['每日任务网','每日任務網','Personal Daily Planner'],
    ['管理常用网站，支持书签分类、搜索、编辑、撤销和 JSON 备份。代码由 AI 辅助生成，我负责确定功能、测试和发布。','管理常用網站，支援書籤分類、搜尋、編輯、復原和 JSON 備份。程式碼由 AI 輔助生成，我負責確定功能、測試和發布。','A manager for frequently used websites, with bookmark categories, search, editing, undo and JSON backups. The code was written with AI assistance; I defined the features, tested the site and published it.'],
    ['记录每日习惯和月度任务，可查看完成记录与统计、调整任务顺序，以及导入和导出数据。使用 AI 辅助开发，由我确定功能、测试并发布到 GitHub Pages。','記錄每日習慣和每月任務，可查看完成記錄與統計、調整任務次序，以及匯入和匯出資料。使用 AI 輔助開發，由我確定功能、測試並發布到 GitHub Pages。','Tracks daily habits and monthly tasks, with completion history, statistics, task ordering, and data import and export. Developed with AI assistance; I defined the features, tested the site and published it on GitHub Pages.'],
    ['访问网站','瀏覽網站','Visit website'],['源代码','原始碼','Source code'],['香港科技大学','香港科技大學','HKUST'],['香港资优教育学苑','香港資優教育學苑','HKAGE'],['救恩書院','救恩書院','Kau Yan College'],
    ['理学士 · 预计 2029 年夏季毕业','理學士 · 預計 2029 年夏季畢業','BSc · Expected graduation: summer 2029'],['2025/26 学年 · 大一结束','2025/26 學年 · 大一結束','End of Year 1 · 2025/26'],
    ['中六毕业','中六畢業','Secondary 6 graduate'],['2024/25 学年数学延伸部分 M2 全级第一；物理全级第三。','2024/25 學年數學延伸部分 M2 全級第一；物理全級第三。','Ranked first in M2 and third in Physics in the 2024/25 school year.'],
    ['兼职 M2 导师','兼職 M2 導師','Part-time M2 tutor'],['为母校学生补习 HKDSE M2（数学延伸部分单元二）。','為母校學生補習 HKDSE M2（數學延伸部分單元二）。','Tutored students at my former school in HKDSE M2 (Mathematics Extended Part, Module 2).'],
    ['师特书院（补习班）','師特書院（補習班）','ShiTe College (Tutorial Centre)'],['兼职导师','兼職導師','Part-time tutor'],['教授 HKDSE M2 及资讯及通讯科技（ICT）。','教授 HKDSE M2 及資訊及通訊科技（ICT）。','Taught HKDSE M2 and Information and Communication Technology (ICT).'],
    ['大学','大學','HKUST'],['A range 课程','A range 課程','Courses with A-range grades'],['数学延伸部分 M2 全级第一','數學延伸部分 M2 全級第一','First in Mathematics Extended Part, Module 2 (M2)'],['救恩書院 · 2024/25 学年','救恩書院 · 2024/25 學年','Kau Yan College · 2024/25'],
    ['第十四届蓝桥杯青少年组 · Python 高级组','第十四屆藍橋杯青少年組 · Python 高級組','14th Lanqiao Cup Youth Competition · Advanced Python'],['全国总决赛三等奖（5 月 28 日）','全國總決賽三等獎（5 月 28 日）','Third prize, national finals (28 May)'],['广东省赛一等奖（5 月 14 日）','廣東省賽一等獎（5 月 14 日）','First prize, Guangdong provincial competition (14 May)'],
    ['数学必修部分全级第二','數學必修部分全級第二','Second in Mathematics (Compulsory Part)'],['物理全级第一','物理全級第一','First in Physics'],['鵬程盃邀请赛 · Python 语言二等奖','鵬程盃邀請賽 · Python 語言二等獎','Pengcheng Cup Invitational · Second prize in Python'],['回到顶部 ↑','回到頂部 ↑','Back to top ↑'],
    ['亮色','亮色','Light'],['暗色','暗色','Dark'],['切换到亮色','切換至亮色','Switch to light mode'],['切换到暗色','切換至暗色','Switch to dark mode'],['选择语言','選擇語言','Choose language'],
    ['编辑网站','編輯網站','Edit website'],['结束编辑','結束編輯','Finish editing'],['关闭编辑面板','關閉編輯面板','Close editor'],['点网页中的文字即可改写。修改仅保存在当前浏览器；导出后重新发布，其他设备才能看到。','點網頁中的文字即可改寫。修改只儲存在目前瀏覽器；匯出後重新發布，其他裝置才能看到。','Click any text to edit it. Changes stay in this browser until you export and republish the site.'],
    ['当前语言的文字单独保存；切换语言可分别编辑。已有自定义文字会保留。','目前語言的文字分開儲存；切換語言可分別編輯。已有自訂文字會保留。','Text edits are saved separately for each language. Switch languages to edit each version. Existing custom text is retained.'],
    ['撤销','復原','Undo'],['重做','重做','Redo'],['预览','預覽','Preview'],['内容与链接','內容與連結','Content & links'],['先点选网页中的一段文字','先點選網頁中的一段文字','Select a text block on the page'],['选中的文字','選中的文字','Selected text'],['也可以在这里修改选中的文字','也可以在這裡修改選中的文字','Edit the selected text here'],
    ['按 Enter 换行，再按一次可留空行。结束编辑、保存和导出后都会保留。','按 Enter 換行，再按一次可留空行。結束編輯、儲存和匯出後都會保留。','Press Enter for a new line, or twice for a blank line. Line breaks stay after editing, saving and export.'],
    ['链接地址（可选）','連結網址（可選）','Link URL (optional)'],['删除文字块','刪除文字區塊','Delete text block'],['只删选中的文字块；链接会连图标一起删除。可用「撤销」恢复。','只刪選中的文字區塊；連結會連圖示一起刪除。可用「復原」還原。','Deletes the selected text block. Links are removed with their icons. Use Undo to restore them.'],
    ['修改联系方式时，也请检查对应的邮件、电话或 WhatsApp 链接。','修改聯絡方式時，也請檢查對應的電郵、電話或 WhatsApp 連結。','When changing contact details, check the email, phone or WhatsApp link as well.'],
    ['新增经历','新增經歷','Add an entry'],['＋ 新增一项','＋ 新增一項','＋ Add entry'],['删除整条经历','刪除整項經歷','Delete entire entry'],['删除整条项目','刪除整個項目','Delete entire project'],['删除整条教育经历','刪除整項教育經歷','Delete entire education entry'],['删除整条教学经历','刪除整項教學經歷','Delete entire teaching entry'],['删除整条奖项','刪除整項獎項','Delete entire award'],
    ['字体与排版','字體與排版','Font & layout'],['全站字体','全站字體','Site font'],['Noto Sans SC（默认）','Noto Sans SC（預設）','Noto Sans SC (default)'],['系统字体','系統字體','System font'],['微软雅黑 / 苹方','微軟雅黑 / 蘋方','Microsoft YaHei / PingFang'],['宋体','宋體','Songti'],['楷体','楷體','Kaiti'],['衬线字体','襯線字體','Serif'],
    ['正文字号','內文字號','Body size'],['首页标题','首頁標題','Main title size'],['章节标题','章節標題','Section heading size'],['正文行距','內文行距','Line height'],['章节间距','章節間距','Section spacing'],['Noto Sans SC 随网页提供。其他字体需在设备上安装。','Noto Sans SC 隨網頁提供。其他字體需在裝置上安裝。','Noto Sans SC is included. Other fonts must be installed on your device.'],
    ['保存与导出','儲存與匯出','Save & export'],['保存草稿','儲存草稿','Save draft'],['载入草稿','載入草稿','Load draft'],['导出网站 ZIP','匯出網站 ZIP','Export website ZIP'],['导出单文件网页','匯出單檔網頁','Export single HTML file'],['备份草稿','備份草稿','Back up draft'],['导入草稿','匯入草稿','Import draft'],['恢复默认','還原預設','Reset to default'],['取消','取消','Cancel'],
    ['ZIP 解压后的文件可以用于重新发布。单文件网页可直接打开。草稿备份用于跨设备继续编辑。','ZIP 解壓縮後的檔案可用於重新發布。單檔網頁可直接開啟。草稿備份可用於跨裝置繼續編輯。','Republish the extracted ZIP files, open the single HTML file directly, or transfer a draft backup to another device.'],
    ['点击网页文字开始编辑。','點擊網頁文字開始編輯。','Click text on the page to start editing.'],['当前修改预览','目前修改預覽','Preview current changes'],['电脑','電腦','Desktop'],['手机','手機','Mobile'],['关闭预览','關閉預覽','Close preview'],['当前网站预览','目前網站預覽','Website preview'],
    ['恢复到这个网站文件的默认内容与排版？当前修改仍可用「撤销」找回。','還原這個網站檔案的預設內容與排版？目前修改仍可用「復原」找回。','Reset to this file’s default content and layout? You can still recover your changes with Undo.'],
    ['本地草稿 · 尚未发布','本機草稿 · 尚未發布','Local draft · Not published'],['草稿已保存到当前浏览器。尚未发布到网站。','草稿已儲存到目前瀏覽器，尚未發布到網站。','Draft saved in this browser. It has not been published.'],['已恢复本地草稿。修改尚未发布。','已還原本機草稿，修改尚未發布。','Local draft restored. Changes have not been published.'],
    ['已恢复旧草稿并加入语言切换，其他修改保留。原草稿已在当前浏览器留存。','已還原舊草稿並加入語言切換，其他修改保留。原草稿已在目前瀏覽器留存。','Your previous draft has been restored with language support. Other edits are retained, and the original draft is backed up in this browser.'],
    ['已更新旧草稿，保留其他修改。原草稿已在当前浏览器留存。','已更新舊草稿，保留其他修改。原草稿已在目前瀏覽器留存。','Your previous draft has been updated. Other edits are retained, and the original draft is backed up in this browser.'],
    ['已撤销。','已復原。','Undone.'],['已重做。','已重做。','Redone.'],['已删除文字块，可用「撤销」恢复。','已刪除文字區塊，可用「復原」還原。','Text block deleted. Use Undo to restore it.'],['已删除整条记录，可用「撤销」恢复。','已刪除整項記錄，可用「復原」還原。','Entry deleted. Use Undo to restore it.'],
    ['链接图标','連結圖示','Link icon'],['已新增一项，点选占位文字即可改写。','已新增一項，點選預留文字即可改寫。','Entry added. Select its placeholder text to edit it.'],['草稿已载入。当前修改尚未发布。','草稿已載入，目前修改尚未發布。','Draft loaded. Changes have not been published.'],['已恢复此网站文件的默认内容与排版。','已還原此網站檔案的預設內容與排版。','Default content and layout restored.'],
    ['正在准备网页和字体…','正在準備網頁和字體…','Preparing the page and font…'],['已导出单文件网页，包含字体和 CV。','已匯出單檔網頁，包含字體和 CV。','Single HTML file exported, including the font and CV.'],['正在打包网页和字体…','正在封裝網頁和字體…','Packaging the page and font…'],['已导出完整网站 ZIP。重新发布后，线上内容才会更新。','已匯出完整網站 ZIP。重新發布後，線上內容才會更新。','Website ZIP exported. Republish it to update the hosted site.'],['正在准备预览…','正在準備預覽…','Preparing preview…'],['已打开预览。','已開啟預覽。','Preview opened.'],
    ['当前浏览器还没有保存的草稿。','目前瀏覽器還沒有已儲存的草稿。','There is no saved draft in this browser.'],['浏览器无法保存草稿，请使用「备份草稿」或导出网站保存。','瀏覽器無法儲存草稿，請使用「備份草稿」或匯出網站儲存。','This browser cannot save the draft. Back it up or export the website.'],['有另一版本的草稿。需要时可点「载入草稿」，或先备份当前内容。','有另一版本的草稿。需要時可點「載入草稿」，或先備份目前內容。','A draft from another version is available. Choose Load draft to use it, or back up your current content first.'],['未能载入本地草稿。可导入备份继续编辑。','未能載入本機草稿，可匯入備份繼續編輯。','Could not load the local draft. Import a backup to continue editing.'],
    ['新教育经历','新教育經歷','New education entry'],['起止时间','起止日期','Dates'],['机构英文名称','機構英文名稱','Institution name'],['学历／课程','學歷／課程','Degree / programme'],['补充说明','補充說明','Additional details'],['新项目','新項目','New project'],['年份','年份','Year'],['类型 / 技术','類型 / 技術','Type / technology'],['在这里介绍你的项目与贡献。','在這裡介紹你的項目與貢獻。','Describe your project and contribution here.'],['新教学经历','新教學經歷','New teaching entry'],['角色／职位','角色／職位','Role / position'],['在这里介绍你的教学内容。','在這裡介紹你的教學內容。','Describe your teaching here.'],['新荣誉与奖项','新榮譽與獎項','New honor or award'],
    ['草稿格式不正确或内容过大。','草稿格式不正確或內容過大。','The draft has an invalid format or is too large.'],['草稿缺少必要的页面区域，未载入。','草稿缺少必要的頁面區域，未載入。','The draft is missing required page sections and was not loaded.'],['草稿缺少个人资料区域。','草稿缺少個人資料區域。','The draft is missing the profile section.'],['链接格式不正确，请使用 https://、mailto:、tel: 或页面锚点。','連結格式不正確，請使用 https://、mailto:、tel: 或頁面錨點。','Use an https://, mailto:, tel: or page-anchor link.'],['这不是有效的个人主页草稿。','這不是有效的個人主頁草稿。','This is not a valid website draft.'],['草稿文件过大。','草稿檔案過大。','The draft file is too large.'],['字体或导出资源未载入，请重试。','字體或匯出資源未載入，請重試。','The font or export assets are not loaded. Please try again.'],['导出资源未载入，请重新加载页面后再试。','匯出資源未載入，請重新載入頁面後再試。','Export assets are not loaded. Reload the page and try again.'],['未能载入 CV，请重试。','未能載入 CV，請重試。','Could not load the CV. Please try again.'],['未能载入 CV，请重新加载页面。','未能載入 CV，請重新載入頁面。','Could not load the CV. Please reload the page.'],['未能载入字体，请重试。','未能載入字體，請重試。','Could not load the font. Please try again.'],['未能载入字体，请重新加载页面。','未能載入字體，請重新載入頁面。','Could not load the font. Please reload the page.'],
    ['田哲豪的头像','田哲豪的頭像','Portrait of TIAN Jaho'],['头像资源未载入，请重新加载页面。','頭像資源未載入，請重新載入頁面。','The portrait is not loaded. Please reload the page.'],
    ['未填写微信号。','未填寫微信號。','No WeChat ID entered.'],['© 2026 田哲豪','© 2026 田哲豪','© 2026 TIAN Jaho'],['田哲豪 TIAN Jaho · 个人主页','田哲豪 TIAN Jaho · 個人主頁','TIAN Jaho · Personal Website'],
    ['田哲豪 TIAN Jaho｜香港科技大学，数学（Computer Science Track）。教育、项目、补习经历与联系方式。','田哲豪 TIAN Jaho｜香港科技大學，數學（Computer Science Track）。教育、項目、補習經歷與聯絡方式。','TIAN Jaho | Mathematics (Computer Science Track) at HKUST. Education, projects, teaching and contact details.']
  ];
  const dictionary=new Map();
  for(const row of rows){const values=Object.fromEntries(languages.map((language,i)=>[language,row[i]]));for(const text of row)if(!dictionary.has(text))dictionary.set(text,values)}
  // Older drafts used the English institution name in the Chinese version.
  dictionary.set('ShiTe College (Tutorial Centre)',dictionary.get('师特书院（补习班）'));
  const reviewedRows=[
    ['数学  |','數學  |','Mathematics |'],['计算机科学方向','計算機科學方向','Computer Science Track'],
    ['修读数学（Computer Science Track）','修讀數學（Computer Science Track）',', majoring in Mathematics (Computer Science Track).'],
    ['喜欢创造，解决自己需求。做过 Python 解谜游戏、个人导航网和每日任务网站，担任过补习老师/学校兼职导师，教授 HKDSE M2 和 ICT。如需联系，可发','喜歡創造，解決自己的需求。做過 Python 解謎遊戲、個人導航網和每日任務網站，曾擔任補習導師及學校兼職導師，教授 HKDSE M2 和 ICT。如需聯絡，可發','I enjoy building things to meet my own needs. I have worked on a Python puzzle game, a personal bookmark manager and a daily planner, and have taught HKDSE M2 and ICT as a tutor and a part-time school tutor. To get in touch, '],
    ['粤语、普通话（本地）','粵語、普通話（本地）','Cantonese and Mandarin (native)'],['理学士','理學士','BSc'],
    ['参与课程：','參與課程：','Course attended:'],
    ['Python 游戏与 AI 应用编程课程（Level III）','Python 遊戲與 AI 應用編程課程（Level III）','Python Game and AI Application Programming (Level III)'],
    ['The Hong Kong Academy for Gifted Education (HKAGE)学苑成员','The Hong Kong Academy for Gifted Education (HKAGE) 學苑成員','Student member of the Hong Kong Academy for Gifted Education (HKAGE)'],
    ['2024 年用 Python 和 Pygame 编写游戏可游玩原型，负责程序、剧情和谜题设计。玩家通过对话选择和点击场景物件推进游戏，触发不同结局。\n2026 年重新开始开发，使用 Codex 和 DeepSeek 辅助编程。','2024 年用 Python 和 Pygame 編寫可遊玩的遊戲原型，負責程式、劇情和謎題設計。玩家透過對話選擇和點擊場景物件推進遊戲，觸發不同結局。\n2026 年重新開始開發，使用 Codex 和 DeepSeek 輔助編程。','Built a playable game prototype in Python and Pygame in 2024, including the code, story and puzzles. Players progress through dialogue choices and interactions with scene objects, leading to different endings.\nResumed development in 2026 with coding assistance from Codex and DeepSeek.'],
    ['The Hong Kong Academy for Gifted Education (HKAGE)学苑成员\n参与课程：\nPython 游戏与 AI 应用编程课程（Level III）','The Hong Kong Academy for Gifted Education (HKAGE) 學苑成員\n參與課程：\nPython 遊戲與 AI 應用編程課程（Level III）','Student member of the Hong Kong Academy for Gifted Education (HKAGE)\nCourse attended:\nPython Game and AI Application Programming (Level III)']
  ];
  const normalize=text=>text.replace(/\s+/g,'').replace(/（/g,'(').replace(/）/g,')');
  const reviewed=new Map();
  for(const row of rows)reviewed.set(normalize(row[0]),Object.fromEntries(languages.map((language,i)=>[language,row[i]])));
  for(const row of reviewedRows){const values=Object.fromEntries(languages.map((language,i)=>[language,row[i]]));reviewed.set(normalize(row[0]),values);for(const value of row)dictionary.set(value,values)}
  function repairTranslations(container){
    for(const element of container.querySelectorAll('[data-i18n-values]')){const values=read(element);if(!values)continue;const source=values['zh-CN'],entry=reviewed.get(normalize(source));if(!entry||!/[\u3400-\u9fff]/.test(source))continue;const revision=normalize(source);if(element.dataset.i18nReviewed===revision&&normalize(values.en)!==revision)continue;values['zh-HK']=entry['zh-HK'];values.en=entry.en;element.dataset.i18nValues=JSON.stringify(values);element.dataset.i18nReviewed=revision}
  }
  let current=languages.includes(document.documentElement.lang)?document.documentElement.lang:'zh-CN';
  const uiText=new WeakMap(),uiAttributes=new WeakMap();
  function t(text,language=current){
    const trim=text.trim(),entry=dictionary.get(trim);if(entry)return text.slice(0,text.indexOf(trim))+entry[language]+text.slice(text.indexOf(trim)+trim.length);
    for(const forms of [['已选中：','已選中：','Selected: '],['已复制微信号：','已複製微信號：','WeChat ID copied: '],['复制微信号 ','複製微信號 ','Copy WeChat ID ']])for(const prefix of forms)if(text.startsWith(prefix))return forms[languages.indexOf(language)]+text.slice(prefix.length);
    const manual=text.match(/^请选中微信号 (.+)，手动复制。$/);if(manual)return language==='en'?'Select WeChat ID '+manual[1]+' and copy it manually.':language==='zh-HK'?'請選中微信號 '+manual[1]+'，手動複製。':text;
    return text;
  }
  function read(element){try{const data=JSON.parse(element.getAttribute('data-i18n-values'));if(data&&languages.every(language=>typeof data[language]==='string'&&data[language].length<=100000))return Object.fromEntries(languages.map(language=>[language,data[language]]))}catch{}return null}
  function annotate(container){
    const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT),nodes=[];
    while(walker.nextNode()){const node=walker.currentNode;if(node.textContent.trim()&&!node.parentElement.closest('[data-i18n-values],svg,script,style,textarea,#copy-status'))nodes.push(node)}
    for(const node of nodes){const raw=node.textContent,trim=raw.trim(),english=node.parentElement.closest('[lang="en"]'),oldInstitution=/^ShiTe College\s*\(Tutorial Centre\)(?:\s*[师師]特[书書]院\s*[（(][补補][习習]班[）)])?$/.test(trim),preserveEnglish=(english&&container.contains(english)&&!oldInstitution&&!/[\u3400-\u9fff]/.test(trim))||/^(HKUST|HKAGE)$/.test(trim),entry=preserveEnglish?null:(reviewed.get(normalize(trim))||dictionary.get(oldInstitution?'师特书院（补习班）':trim)),start=raw.indexOf(trim);if(oldInstitution&&english)english.removeAttribute('lang');const values=Object.fromEntries(languages.map(language=>[language,entry?raw.slice(0,start)+entry[language]+raw.slice(start+trim.length):raw]));const span=document.createElement('span');span.dataset.i18nValues=JSON.stringify(values);span.textContent=values[current];node.replaceWith(span)}
  }
  function capture(container,language=current){for(const element of container.querySelectorAll('[data-i18n-values]')){const values=read(element);if(values){values[language]=element.textContent.replace(/\r\n?/g,'\n');element.dataset.i18nValues=JSON.stringify(values)}}}
  function renderRoot(container,language=current){repairTranslations(container);for(const element of container.querySelectorAll('[data-i18n-values]')){const values=read(element);if(!values){element.removeAttribute('data-i18n-values');continue}const field=element.querySelector('[data-editor-field]');(field||element).textContent=values[language]}}
  function canonicalize(container){capture(container);renderRoot(container,'zh-CN');ui(container,'zh-CN')}
  function ui(container,language=current){
    const walker=document.createTreeWalker(container,NodeFilter.SHOW_TEXT),nodes=[];
    while(walker.nextNode()){const node=walker.currentNode;if(node.textContent.trim()&&!node.parentElement.closest('.page-layout,.language-switch,script,style,svg,textarea'))nodes.push(node)}
    for(const node of nodes){let record=uiText.get(node);if(!record||record.last!==node.textContent){const entry=dictionary.get(node.parentElement.dataset.uiSource||node.textContent.trim());record={values:entry,last:node.textContent};uiText.set(node,record)}if(record.values){node.textContent=record.values[language];record.last=node.textContent}else node.textContent=t(node.textContent,language)}
    for(const element of container.querySelectorAll('[aria-label],[placeholder],[title],[alt]')){let records=uiAttributes.get(element);if(!records){records={};uiAttributes.set(element,records)}for(const name of ['aria-label','placeholder','title','alt'])if(element.hasAttribute(name)){const value=element.getAttribute(name);let record=records[name];if(!record||record.last!==value)record=records[name]={source:value,last:value};const translated=t(record.source,language);element.setAttribute(name,translated);record.last=translated}}
  }
  function renderDocument(root,language=current){
    root.lang=language;const layout=root.querySelector('.page-layout');if(layout)renderRoot(layout,language);ui(root,language);
    for(const button of root.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));
    const title=root.querySelector('title');if(title)title.textContent=t('田哲豪 TIAN Jaho · 个人主页',language);
    root.querySelector('meta[name="description"]')?.setAttribute('content',t(rows.at(-1)[0],language));
  }
  function apply(language,{save=true}={}){
    if(!languages.includes(language))return;
    const threshold=(document.querySelector('.site-header')?.getBoundingClientRect().height||84)+35;
    const anchor=[...document.querySelectorAll('#about,#resume-content,.project,.timeline-item,.teaching-entry,.awards-list>li')].filter(element=>{const rect=element.getBoundingClientRect();return rect.height&&rect.top<=threshold&&rect.bottom>threshold}).at(-1),anchorTop=anchor?.getBoundingClientRect().top;
    document.dispatchEvent(new Event('resume-language-beforechange'));capture(document.querySelector('.page-layout'));current=language;renderDocument(document.documentElement,language);
    if(save)try{localStorage.setItem(key,language)}catch{/* Language switching works without storage. */}
    document.dispatchEvent(new Event('resume-language-change'));
    if(anchor)requestAnimationFrame(()=>window.scrollBy({top:anchor.getBoundingClientRect().top-anchorTop,behavior:'instant'}));
  }
  window.ResumeI18n={t,annotate,capture,canonicalize,renderRoot,renderDocument,ui,get language(){return current}};
  annotate(document.querySelector('.page-layout'));
  document.addEventListener('click',event=>{const button=event.target.closest('[data-language]');if(button)apply(button.dataset.language)});
  document.addEventListener('DOMContentLoaded',()=>{let language=current;try{language=localStorage.getItem(key)||language}catch{}apply(languages.includes(language)?language:'zh-CN',{save:false})});
})();
