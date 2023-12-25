// ==UserScript==
// @name         新海天帮你查课余量
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  适用于任选课阶段，监测特定课程的余量，并在有余量时发送浏览器通知，自动点击提交，仅需手动填写验证码。打开https://aa.bjtu.edu.cn/course_selection/courseselecttask/selects_action/?action=load&iframe=school&page=1&perpage=1000使用
// @author       上条当咩
// @match        *://aa.bjtu.edu.cn/*
// @icon         https://yaya.csoci.com:1314/files/spc_ico_sora_sd.jpg
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// ==/UserScript==

(function() {
    'use strict';
    // 您的愿望单课程数组
    var wishListCourses = [
        //'C112002B:初级综合英语 01',
        //'C112004B:高级综合英语 02',
        'A121085B:游泳-自由泳 01',
    ];//必须填写序号，同一课程只能选一个时间段，不填脚本会爆炸

    // 与课程对应的课程号
    var kchValues = {
        'A101001B:开源平台与创新实践 01':'A101001B',
        'A101004B:电磁波应用概论 01':'A101004B',
        'A101005B:电类工程素质训练I 01':'A101005B',
        'A101005B:电类工程素质训练I 02':'A101005B',
        'A101005B:电类工程素质训练I 03':'A101005B',
        'A101005B:电类工程素质训练I 04':'A101005B',
        'A101005B:电类工程素质训练I 05':'A101005B',
        'A101005B:电类工程素质训练I 06':'A101005B',
        'A101005B:电类工程素质训练I 07':'A101005B',
        'A101005B:电类工程素质训练I 08':'A101005B',
        'A101005B:电类工程素质训练I 09':'A101005B',
        'A101005B:电类工程素质训练I 10':'A101005B',
        'A101005B:电类工程素质训练I 11':'A101005B',
        'A101005B:电类工程素质训练I 12':'A101005B',
        'A101005B:电类工程素质训练I 13':'A101005B',
        'A101005B:电类工程素质训练I 14':'A101005B',
        'A101005B:电类工程素质训练I 15':'A101005B',
        'A101005B:电类工程素质训练I 16':'A101005B',
        'A101006B:工程经济与项目管理 01':'A101006B',
        'A101006B:工程经济与项目管理 02':'A101006B',
        'A101006B:工程经济与项目管理 03':'A101006B',
        'A101006B:工程经济与项目管理 04':'A101006B',
        'A101006B:工程经济与项目管理 05':'A101006B',
        'A101006B:工程经济与项目管理 06':'A101006B',
        'A101006B:工程经济与项目管理 07':'A101006B',
        'A101006B:工程经济与项目管理 08':'A101006B',
        'A101006B:工程经济与项目管理 09':'A101006B',
        'A101006B:工程经济与项目管理 10':'A101006B',
        'A101006B:工程经济与项目管理 11':'A101006B',
        'A101006B:工程经济与项目管理 12':'A101006B',
        'A101006B:工程经济与项目管理 13':'A101006B',
        'A101006B:工程经济与项目管理 14':'A101006B',
        'A101006B:工程经济与项目管理 15':'A101006B',
        'A101007B:光纤通信概论 01':'A101007B',
        'A101007B:光纤通信概论 02':'A101007B',
        'A101010B:漫谈现代信息社会热点 01':'A101010B',
        'A101012B:探索光电世界 01':'A101012B',
        'A101014B:现代有线无线融合通信技术 01':'A101014B',
        'A101014B:现代有线无线融合通信技术 02':'A101014B',
        'A101015B:移动通信技术 01':'A101015B',
        'A101017B:智慧高铁概论 01':'A101017B',
        'A101017B:智慧高铁概论 02':'A101017B',
        'A101022B:机器人技术及应用 01':'A101022B',
        'A101025B:数字图像处理技术 01':'A101025B',
        'A101026B:图像处理与机器视觉 01':'A101026B',
        'A101027B:物联网技术 01':'A101027B',
        'A101031B:工程与社会系列讲座 01':'A101031B',
        'A101031B:工程与社会系列讲座 02':'A101031B',
        'A101031B:工程与社会系列讲座 03':'A101031B',
        'A101031B:工程与社会系列讲座 04':'A101031B',
        'A101031B:工程与社会系列讲座 05':'A101031B',
        'A101031B:工程与社会系列讲座 06':'A101031B',
        'C401009B:大数据思维与技术 01':'C401009B',
        'C401011B:物联网技术概论 01':'C401011B',
        'C401012B:随机过程及应用 01':'C401012B',
        'C401016B:智能通信 01':'C401016B',
        'C401017B:5G通信系统与应用 01':'C401017B',
        'A102003B:“互联网+”创业导论 01':'A102003B',
        'A102004B:数字媒体信息处理的创新与研究体验 01':'A102004B',
        'A102005B:大数据分析实训 01':'A102005B',
        'A102008B:安卓及嵌入式系统开发 01':'A102008B',
        'A102009B:Python数据分析与挖掘实战 01':'A102009B',
        'A102010B:安全通论 01':'A102010B',
        'C402001B:区块链技术 01':'C402001B',
        'C402008B:机器视觉算法与实践 01':'C402008B',
        'C402011B:时间序列数据分析挖掘 01':'C402011B',
        'C402024B:智能传感器 01':'C402024B',
        'C402026B:人工智能导论 01':'C402026B',
        'C402027B:云计算分布式架构技术 01':'C402027B',
        'C402028B:迁移学习与应用 01':'C402028B',
        'A103901B:伦理与社会责任 01':'A103901B',
        'A103901B:伦理与社会责任 02':'A103901B',
        'A103901B:伦理与社会责任 03':'A103901B',
        'A103901B:伦理与社会责任 04':'A103901B',
        'A103901B:伦理与社会责任 05':'A103901B',
        'A103901B:伦理与社会责任 06':'A103901B',
        'A103901B:伦理与社会责任 07':'A103901B',
        'A103903B:沟通 01':'A103903B',
        'A103903B:沟通 02':'A103903B',
        'A103903B:沟通 03':'A103903B',
        'A103903B:沟通 04':'A103903B',
        'A103903B:沟通 05':'A103903B',
        'A103903B:沟通 06':'A103903B',
        'A103907B:世界遗产景点赏析 01':'A103907B',
        'A103908B:中外旅游景点赏析 01':'A103908B',
        'A103910B:公共关系与实务 01':'A103910B',
        'A103912B:国际融资学 01':'A103912B',
        'A103914B:西方经济学 01':'A103914B',
        'A103915B:博弈论 01':'A103915B',
        'A103917B:国际贸易实务模拟 01':'A103917B',
        'A103919B:证券投资分析 01':'A103919B',
        'A103920B:个人投资理财 01':'A103920B',
        'A103921B:技术经济学(B) 01':'A103921B',
        'A103922B:法律经济学(B) 01':'A103922B',
        'A103928B:运输工程经济学 01':'A103928B',
        'A103929B:股票模拟交易 01':'A103929B',
        'A103930B:金融与生活 01':'A103930B',
        'A103933B:旅游市场营销 01':'A103933B',
        'A103935B:电子商务基础 01':'A103935B',
        'A103936B:上市公司会计信息披露与分析 01':'A103936B',
        'A103940B:项目管理 01':'A103940B',
        'A103941B:管理学 01':'A103941B',
        'A103942B:人力资源管理 01':'A103942B',
        'A103943B:管理信息系统 01':'A103943B',
        'A103944B:大数据应用基础 01':'A103944B',
        'A103946B:税务实践 01':'A103946B',
        'A103949B:身边的物流问题分析 01':'A103949B',
        'A103953B:思维创新与创造力开发 01':'A103953B',
        'A103956B:创业概论 01':'A103956B',
        'A103958B:创新方法及其应用 01':'A103958B',
        'A103960B:数字时代的大学生创新思维与创业实务 01':'A103960B',
        'A103961B:创业启蒙 01':'A103961B',
        'A103962B:创新与创业管理 01':'A103962B',
        'A103963B:空间创新管理 01':'A103963B',
        'A103965B:创业训练 01':'A103965B',
        'A103970B:社会责任和可持续发展 01':'A103970B',
        'A103971B:企业伦理与责任 01':'A103971B',
        'A103972B:职场必备财务知识 01':'A103972B',
        'A103973B:社会学 01':'A103973B',
        'A103974B:六种创造性思维及其应用 01':'A103974B',
        'A103975B:新媒体营销 01':'A103975B',
        'A103976B:铁路物资管理 01':'A103976B',
        'C403029B:问卷调查设计及数据分析方法 01':'C403029B',
        'C403030B:数据伦理与规管 01':'C403030B',
        'A004002B:高速铁路纵横 01':'A004002B',
        'A004014B:大学生创业实践 01':'A004014B',
        'A004017B:系统工程 01':'A004017B',
        'A004018B:集装箱运输 01':'A004018B',
        'A004023B:交通化学与危险货物运输 01':'A004023B',
        'A004023B:交通化学与危险货物运输 02':'A004023B',
        'C404011B:综合交通大数据分析方法与应用 01':'C404011B',
        'C404013B:交通仿真技术 01':'C404013B',
        'A105006B:爆破工程 01':'A105006B',
        'A105007B:地下空间的开发与利用 01':'A105007B',
        'A105011B:土木工程防灾减灾 01':'A105011B',
        'A105014B:灾害学导论 01':'A105014B',
        'A105015B:工程项目经济与管理 01':'A105015B',
        'A105015B:工程项目经济与管理 02':'A105015B',
        'A105015B:工程项目经济与管理 03':'A105015B',
        'A105015B:工程项目经济与管理 04':'A105015B',
        'A105015B:工程项目经济与管理 05':'A105015B',
        'A105015B:工程项目经济与管理 06':'A105015B',
        'A105015B:工程项目经济与管理 07':'A105015B',
        'A105015B:工程项目经济与管理 08':'A105015B',
        'A105016B:桥梁史话 01':'A105016B',
        'A105018B:新型轨道结构 01':'A105018B',
        'A105019B:铁道工程概论 01':'A105019B',
        'A105022B:地球科学概论 01':'A105022B',
        'A105026B:工程与可持续发展 01':'A105026B',
        'A105026B:工程与可持续发展 02':'A105026B',
        'A105029B:工程伦理和法规 01':'A105029B',
        'A105029B:工程伦理和法规 02':'A105029B',
        'A105029B:工程伦理和法规 03':'A105029B',
        'A105029B:工程伦理和法规 04':'A105029B',
        'A105034B:桥梁文化与美学 01':'A105034B',
        'A105060B:探秘铁路 01':'A105060B',
        'A105061B:可持续发展概论 01':'A105061B',
        'A105062B:小白零基础灵学巧用机器学习 01':'A105062B',
        'A105063B:中国古代地下建筑 01':'A105063B',
        'A105064B:时间隧道 01':'A105064B',
        'A105066B:城市地下空间的开发与利用 01':'A105066B',
        'A105067B:地下世界与相对时空之美 01':'A105067B',
        'A105068B:土木工程专业研究方法论与创新教育 01':'A105068B',
        'C305001B:轨道交通系统动力学与Matlab程序设计 01':'C305001B',
        'C305002B:基于三维模型（BIM）的信息化技术 01':'C305002B',
        'C305004B:地理空间信息技术与应用 01':'C305004B',
        'C305005B:碳中和与第五次工业革命 01':'C305005B',
        'C305006B:有限元建模与仿真 01':'C305006B',
        'A106009B:现代制造与创新创业 01':'A106009B',
        'A106010B:创新工程与实践 01':'A106010B',
        'A106015B:Solid works软件培训与认证 01':'A106015B',
        'C306004B:人工智能与机器人：基于Python的实践 01':'C306004B',
        'A107003B:电类常用工具软件仿真与工程应用 01':'A107003B',
        'A107007B:可编程控制器（罗克韦尔）应用 01':'A107007B',
        'A107010B:智能制造创新实践 01':'A107010B',
        'A107010B:智能制造创新实践 02':'A107010B',
        'A009006B:中国历史文化概论 01':'A009006B',
        'A009009B:道家人生智慧 01':'A009009B',
        'A009009B:道家人生智慧 02':'A009009B',
        'A009010B:中国古代诗词研读 01':'A009010B',
        'A009010B:中国古代诗词研读 02':'A009010B',
        'A009011B:中国古典小说鉴赏 01':'A009011B',
        'A009011B:中国古典小说鉴赏 02':'A009011B',
        'A009011B:中国古典小说鉴赏 03':'A009011B',
        'A009012B:中国现当代文学鉴赏 01':'A009012B',
        'A009012B:中国现当代文学鉴赏 02':'A009012B',
        'A009020B:中国电影观摩与欣赏 01':'A009020B',
        'A009020B:中国电影观摩与欣赏 02':'A009020B',
        'A009022B:电影美学-拉片课 01':'A009022B',
        'A009022B:电影美学-拉片课 02':'A009022B',
        'A009027B:大学语文 01':'A009027B',
        'A009031B:西方哲学史 01':'A009031B',
        'A009031B:西方哲学史 02':'A009031B',
        'A009047B:中国哲学史 01':'A009047B',
        'A009048B:中华优秀传统文化 02':'A009048B',
        'A009057B:大学生文化素质修养 01':'A009057B',
        'A009057B:大学生文化素质修养 02':'A009057B',
        'A009057B:大学生文化素质修养 03':'A009057B',
        'A009057B:大学生文化素质修养 04':'A009057B',
        'A009058B:马克思主义经典作家文献选读 01':'A009058B',
        'A010001B:创业启蒙 01':'A010001B',
        'A011006B:现代与当代建筑艺术 01':'A011006B',
        'A011007B:建筑美学 01':'A011007B',
        'A011008B:简单学统计 01':'A011008B',
        'A011009B:大学美育实践 01':'A011009B',
        'A111003B:城市设计概论 01':'A111003B',
        'A111007B:抽象绘画与当代建筑 01':'A111007B',
        'A111008B:铁路建筑遗产保护与开发 01':'A111008B',
        'A111016B:平面与空间形式创新设计的科学方法 01':'A111016B',
        'A111019B:艺术世界与艺术管理 01':'A111019B',
        'C311107B:媒介设计与用户体验 01':'C311107B',
        'C311108B:数字化赋能设计创意与实践 01':'C311108B',
        'A112008B:古代汉语入门 01':'A112008B',
        'A112008B:古代汉语入门 02':'A112008B',
        'A112024B:西班牙语国家电影与文化赏析 01':'A112024B',
        'A112024B:西班牙语国家电影与文化赏析 02':'A112024B',
        'A112026B:西班牙语二外Ⅰ 01':'A112026B',
        'A112026B:西班牙语二外Ⅰ 02':'A112026B',
        'A112029B:西班牙语基础口语与会话 01':'A112029B',
        'A112029B:西班牙语基础口语与会话 02':'A112029B',
        'A112030B:拉丁美洲国家经济概况 01':'A112030B',
        'A112030B:拉丁美洲国家经济概况 02':'A112030B',
        'A112035B:葡萄牙语影片赏析 01':'A112035B',
        'A112035B:葡萄牙语影片赏析 02':'A112035B',
        'A112043B:俄罗斯影片赏析 01':'A112043B',
        'A112043B:俄罗斯影片赏析 02':'A112043B',
        'A112044B:俄罗斯文化 01':'A112044B',
        'A112051B:法语二外 01':'A112051B',
        'A112055B:德语语音入门 01':'A112055B',
        'A112055B:德语语音入门 02':'A112055B',
        'A112056B:德语口语入门 01':'A112056B',
        'A112057B:基础法语入门 01':'A112057B',
        'A112061B:德国文化 01':'A112061B',
        'A112061B:德国文化 02':'A112061B',
        'A112062B:法语语音入门 01':'A112062B',
        'A112063B:法语口语入门 01':'A112063B',
        'A112063B:法语口语入门 02':'A112063B',
        'A112064B:俄语口语入门 01':'A112064B',
        'A112069B:西方经典艺术鉴赏 01':'A112069B',
        'A112070B:中国传统艺术赏析 01':'A112070B',
        'A112070B:中国传统艺术赏析 02':'A112070B',
        'A112073B:外国语戏剧表演实践 01':'A112073B',
        'C312105B:数据可视化 01':'C312105B',
        'A013003B:合同法实务 01':'A013003B',
        'A013004B:法律与社会 01':'A013004B',
        'A108002B:数学建模方法 01':'A108002B',
        'A108020B:数学试验与数学建模 01':'A108020B',
        'A108026B:高等数学方法Ⅰ 01':'A108026B',
        'A108026B:高等数学方法Ⅰ 02':'A108026B',
        'A108027B:计算方法Ⅰ 01':'A108027B',
        'A108034B:数学家与数学史 01':'A108034B',
        'A114001B:理学之美（下） 01':'A114001B',
        'C308015B:图与网络优化 01':'C308015B',
        'C308017B:大数据分析中的算法 01':'C308017B',
        'C308018B:凸优化及其应用 01':'C308018B',
        'C308019B:试验设计与分析 01':'C308019B',
        'A108003B:宇宙探秘 01':'A108003B',
        'A108005B:人类脑计划：认识脑、保护脑和模拟脑 01':'A108005B',
        'A108006B:再生医学基础与前沿 01':'A108006B',
        'A108007B:癌症知多少 01':'A108007B',
        'A108008B:人类的生育与健康 01':'A108008B',
        'A108010B:生命中的博弈--人类的疾病与健康 01':'A108010B',
        'A108011B:生活中的污染与防护 01':'A108011B',
        'A108012B:厨房中的生物学 01':'A108012B',
        'A108013B:女大学生健康课堂 01':'A108013B',
        'A108014B:传染病的防控 01':'A108014B',
        'A108015B:认识身体 01':'A108015B',
        'A108016B:危险化学品 01':'A108016B',
        'A108017B:生命科学纵横 01':'A108017B',
        'A108017B:生命科学纵横 02':'A108017B',
        'A108017B:生命科学纵横 03':'A108017B',
        'A108017B:生命科学纵横 04':'A108017B',
        'A108017B:生命科学纵横 05':'A108017B',
        'A108017B:生命科学纵横 06':'A108017B',
        'A108017B:生命科学纵横 07':'A108017B',
        'A108018B:神奇的基因 01':'A108018B',
        'A108025B:纳米技术 01':'A108025B',
        'A108029B:个体化医学—医学发展新趋势 01':'A108029B',
        'A108029B:个体化医学—医学发展新趋势 02':'A108029B',
        'A108033B:进化、生态与生物行为 01':'A108033B',
        'A108036B:发展中的生命科学 01':'A108036B',
        'A108043B:借由化学看世界 01':'A108043B',
        'A105008B:环境工程前沿 01':'A105008B',
        'A105025B:环境科学前沿 01':'A105025B',
        'A105051B:环境学概论 01':'A105051B',
        'A116002B:生态环境保护与可持续发展 01':'A116002B',
        'A116014B:碳中和与绿色发展 01':'A116014B',
        'C305003B:科学解析及科学演绎 01':'C305003B',
        'A004030B:博弈论基础及其应用 01':'A004030B',
        'A004031B:网络科学与生活 01':'A004031B',
        'A117001B:系统创新概论 01':'A117001B',
        'C404003B:数据驱动的顶刊论文案例科研实践 01':'C404003B',
        'C404006B:数据分析方法及应用实践 01':'C404006B',
        'C404010B:建模方法与应用 01':'C404010B',
        'C404014B:现代优化与智能计算方法 01':'C404014B',
        'A121011B:花样跳绳 01':'A121011B',
        'A121011B:花样跳绳 02':'A121011B',
        'A121011B:花样跳绳 03':'A121011B',
        'A121011B:花样跳绳 04':'A121011B',
        'A121011B:花样跳绳 05':'A121011B',
        'A121011B:花样跳绳 06':'A121011B',
        'A121012B:健美操 01':'A121012B',
        'A121012B:健美操 02':'A121012B',
        'A121012B:健美操 03':'A121012B',
        'A121012B:健美操 04':'A121012B',
        'A121017B:篮球(高级) 01':'A121017B',
        'A121017B:篮球(高级) 02':'A121017B',
        'A121017B:篮球(高级) 03':'A121017B',
        'A121017B:篮球(高级) 04':'A121017B',
        'A121018B:垒球 01':'A121018B',
        'A121018B:垒球 02':'A121018B',
        'A121018B:垒球 03':'A121018B',
        'A121018B:垒球 04':'A121018B',
        'A121018B:垒球 05':'A121018B',
        'A121021B:男子篮球 01':'A121021B',
        'A121021B:男子篮球 02':'A121021B',
        'A121021B:男子篮球 03':'A121021B',
        'A121021B:男子篮球 04':'A121021B',
        'A121021B:男子篮球 05':'A121021B',
        'A121021B:男子篮球 06':'A121021B',
        'A121021B:男子篮球 11':'A121021B',
        'A121021B:男子篮球 12':'A121021B',
        'A121021B:男子篮球 13':'A121021B',
        'A121021B:男子篮球 14':'A121021B',
        'A121021B:男子篮球 15':'A121021B',
        'A121021B:男子篮球 16':'A121021B',
        'A121021B:男子篮球 17':'A121021B',
        'A121021B:男子篮球 18':'A121021B',
        'A121021B:男子篮球 19':'A121021B',
        'A121021B:男子篮球 20':'A121021B',
        'A121021B:男子篮球 21':'A121021B',
        'A121021B:男子篮球 22':'A121021B',
        'A121021B:男子篮球 23':'A121021B',
        'A121021B:男子篮球 24':'A121021B',
        'A121021B:男子篮球 25':'A121021B',
        'A121021B:男子篮球 26':'A121021B',
        'A121021B:男子篮球 27':'A121021B',
        'A121021B:男子篮球 28':'A121021B',
        'A121021B:男子篮球 29':'A121021B',
        'A121021B:男子篮球 30':'A121021B',
        'A121021B:男子篮球 31':'A121021B',
        'A121021B:男子篮球 32':'A121021B',
        'A121021B:男子篮球 33':'A121021B',
        'A121021B:男子篮球 34':'A121021B',
        'A121022B:男子排球 01':'A121022B',
        'A121022B:男子排球 02':'A121022B',
        'A121022B:男子排球 03':'A121022B',
        'A121022B:男子排球 04':'A121022B',
        'A121022B:男子排球 05':'A121022B',
        'A121022B:男子排球 06':'A121022B',
        'A121022B:男子排球 07':'A121022B',
        'A121022B:男子排球 08':'A121022B',
        'A121022B:男子排球 09':'A121022B',
        'A121022B:男子排球 10':'A121022B',
        'A121022B:男子排球 11':'A121022B',
        'A121022B:男子排球 12':'A121022B',
        'A121022B:男子排球 13':'A121022B',
        'A121022B:男子排球 14':'A121022B',
        'A121022B:男子排球 15':'A121022B',
        'A121023B:男子体育舞蹈 01':'A121023B',
        'A121023B:男子体育舞蹈 02':'A121023B',
        'A121023B:男子体育舞蹈 03':'A121023B',
        'A121023B:男子体育舞蹈 04':'A121023B',
        'A121023B:男子体育舞蹈 05':'A121023B',
        'A121023B:男子体育舞蹈 06':'A121023B',
        'A121023B:男子体育舞蹈 07':'A121023B',
        'A121023B:男子体育舞蹈 08':'A121023B',
        'A121023B:男子体育舞蹈 09':'A121023B',
        'A121023B:男子体育舞蹈 10':'A121023B',
        'A121023B:男子体育舞蹈 11':'A121023B',
        'A121023B:男子体育舞蹈 12':'A121023B',
        'A121023B:男子体育舞蹈 13':'A121023B',
        'A121026B:女子排球 01':'A121026B',
        'A121026B:女子排球 02':'A121026B',
        'A121027B:女子体育舞蹈 01':'A121027B',
        'A121027B:女子体育舞蹈 02':'A121027B',
        'A121027B:女子体育舞蹈 03':'A121027B',
        'A121027B:女子体育舞蹈 04':'A121027B',
        'A121027B:女子体育舞蹈 05':'A121027B',
        'A121027B:女子体育舞蹈 06':'A121027B',
        'A121027B:女子体育舞蹈 07':'A121027B',
        'A121027B:女子体育舞蹈 08':'A121027B',
        'A121027B:女子体育舞蹈 09':'A121027B',
        'A121027B:女子体育舞蹈 10':'A121027B',
        'A121027B:女子体育舞蹈 11':'A121027B',
        'A121027B:女子体育舞蹈 12':'A121027B',
        'A121027B:女子体育舞蹈 13':'A121027B',
        'A121028B:女子足球 01':'A121028B',
        'A121028B:女子足球 02':'A121028B',
        'A121030B:排球裁判理论与实践 01':'A121030B',
        'A121031B:排舞 01':'A121031B',
        'A121031B:排舞 02':'A121031B',
        'A121031B:排舞 03':'A121031B',
        'A121031B:排舞 04':'A121031B',
        'A121031B:排舞 05':'A121031B',
        'A121031B:排舞 06':'A121031B',
        'A121032B:攀岩 01':'A121032B',
        'A121032B:攀岩 02':'A121032B',
        'A121032B:攀岩 03':'A121032B',
        'A121033B:乒乓球 01':'A121033B',
        'A121033B:乒乓球 02':'A121033B',
        'A121033B:乒乓球 03':'A121033B',
        'A121033B:乒乓球 04':'A121033B',
        'A121033B:乒乓球 05':'A121033B',
        'A121033B:乒乓球 06':'A121033B',
        'A121033B:乒乓球 07':'A121033B',
        'A121033B:乒乓球 08':'A121033B',
        'A121033B:乒乓球 09':'A121033B',
        'A121033B:乒乓球 10':'A121033B',
        'A121033B:乒乓球 11':'A121033B',
        'A121033B:乒乓球 12':'A121033B',
        'A121033B:乒乓球 13':'A121033B',
        'A121033B:乒乓球 14':'A121033B',
        'A121033B:乒乓球 15':'A121033B',
        'A121033B:乒乓球 16':'A121033B',
        'A121034B:乒乓球(高级) 01':'A121034B',
        'A121035B:乒乓球运动训练 01':'A121035B',
        'A121036B:气排球 01':'A121036B',
        'A121036B:气排球 02':'A121036B',
        'A121036B:气排球 03':'A121036B',
        'A121036B:气排球 04':'A121036B',
        'A121036B:气排球 05':'A121036B',
        'A121036B:气排球 06':'A121036B',
        'A121036B:气排球 07':'A121036B',
        'A121036B:气排球 08':'A121036B',
        'A121038B:器械健美 01':'A121038B',
        'A121038B:器械健美 02':'A121038B',
        'A121038B:器械健美 03':'A121038B',
        'A121038B:器械健美 04':'A121038B',
        'A121038B:器械健美 05':'A121038B',
        'A121038B:器械健美 06':'A121038B',
        'A121038B:器械健美 07':'A121038B',
        'A121038B:器械健美 08':'A121038B',
        'A121038B:器械健美 09':'A121038B',
        'A121038B:器械健美 10':'A121038B',
        'A121038B:器械健美 11':'A121038B',
        'A121038B:器械健美 12':'A121038B',
        'A121038B:器械健美 13':'A121038B',
        'A121038B:器械健美 14':'A121038B',
        'A121038B:器械健美 15':'A121038B',
        'A121038B:器械健美 16':'A121038B',
        'A121038B:器械健美 17':'A121038B',
        'A121041B:软式排球 01':'A121041B',
        'A121041B:软式排球 02':'A121041B',
        'A121041B:软式排球 03':'A121041B',
        'A121042B:散打 01':'A121042B',
        'A121042B:散打 02':'A121042B',
        'A121044B:跆拳道 01':'A121044B',
        'A121044B:跆拳道 02':'A121044B',
        'A121044B:跆拳道 03':'A121044B',
        'A121044B:跆拳道 04':'A121044B',
        'A121044B:跆拳道 05':'A121044B',
        'A121044B:跆拳道 06':'A121044B',
        'A121044B:跆拳道 07':'A121044B',
        'A121044B:跆拳道 08':'A121044B',
        'A121044B:跆拳道 09':'A121044B',
        'A121044B:跆拳道 10':'A121044B',
        'A121044B:跆拳道 11':'A121044B',
        'A121044B:跆拳道 12':'A121044B',
        'A121044B:跆拳道 13':'A121044B',
        'A121044B:跆拳道 14':'A121044B',
        'A121050B:田径 01':'A121050B',
        'A121050B:田径 02':'A121050B',
        'A121050B:田径 03':'A121050B',
        'A121050B:田径 04':'A121050B',
        'A121050B:田径 05':'A121050B',
        'A121050B:田径 06':'A121050B',
        'A121050B:田径 07':'A121050B',
        'A121050B:田径 08':'A121050B',
        'A121050B:田径 09':'A121050B',
        'A121050B:田径 10':'A121050B',
        'A121050B:田径 11':'A121050B',
        'A121050B:田径 12':'A121050B',
        'A121052B:拓展训练 01':'A121052B',
        'A121052B:拓展训练 02':'A121052B',
        'A121052B:拓展训练 03':'A121052B',
        'A121052B:拓展训练 04':'A121052B',
        'A121053B:蛙泳（高级） 01':'A121053B',
        'A121053B:蛙泳（高级） 02':'A121053B',
        'A121054B:网球 01':'A121054B',
        'A121054B:网球 02':'A121054B',
        'A121054B:网球 03':'A121054B',
        'A121054B:网球 04':'A121054B',
        'A121054B:网球 05':'A121054B',
        'A121054B:网球 06':'A121054B',
        'A121054B:网球 07':'A121054B',
        'A121054B:网球 08':'A121054B',
        'A121054B:网球 09':'A121054B',
        'A121054B:网球 10':'A121054B',
        'A121054B:网球 11':'A121054B',
        'A121054B:网球 12':'A121054B',
        'A121054B:网球 13':'A121054B',
        'A121054B:网球 14':'A121054B',
        'A121054B:网球 15':'A121054B',
        'A121054B:网球 16':'A121054B',
        'A121055B:网球(高级) 01':'A121055B',
        'A121055B:网球(高级) 02':'A121055B',
        'A121056B:武术 01':'A121056B',
        'A121056B:武术 02':'A121056B',
        'A121058B:舞蹈啦啦操 01':'A121058B',
        'A121058B:舞蹈啦啦操 02':'A121058B',
        'A121058B:舞蹈啦啦操 03':'A121058B',
        'A121058B:舞蹈啦啦操 04':'A121058B',
        'A121058B:舞蹈啦啦操 05':'A121058B',
        'A121062B:艺术体操 01':'A121062B',
        'A121062B:艺术体操 02':'A121062B',
        'A121062B:艺术体操 03':'A121062B',
        'A121062B:艺术体操 04':'A121062B',
        'A121062B:艺术体操 05':'A121062B',
        'A121063B:游泳 01':'A121063B',
        'A121063B:游泳 02':'A121063B',
        'A121063B:游泳 03':'A121063B',
        'A121063B:游泳 04':'A121063B',
        'A121063B:游泳 05':'A121063B',
        'A121063B:游泳 06':'A121063B',
        'A121063B:游泳 07':'A121063B',
        'A121063B:游泳 08':'A121063B',
        'A121063B:游泳 09':'A121063B',
        'A121063B:游泳 10':'A121063B',
        'A121063B:游泳 11':'A121063B',
        'A121063B:游泳 12':'A121063B',
        'A121064B:瑜伽 01':'A121064B',
        'A121064B:瑜伽 02':'A121064B',
        'A121064B:瑜伽 03':'A121064B',
        'A121064B:瑜伽 04':'A121064B',
        'A121065B:羽毛球 01':'A121065B',
        'A121065B:羽毛球 02':'A121065B',
        'A121065B:羽毛球 03':'A121065B',
        'A121065B:羽毛球 04':'A121065B',
        'A121065B:羽毛球 05':'A121065B',
        'A121065B:羽毛球 06':'A121065B',
        'A121065B:羽毛球 07':'A121065B',
        'A121065B:羽毛球 08':'A121065B',
        'A121065B:羽毛球 09':'A121065B',
        'A121065B:羽毛球 10':'A121065B',
        'A121065B:羽毛球 11':'A121065B',
        'A121065B:羽毛球 12':'A121065B',
        'A121065B:羽毛球 13':'A121065B',
        'A121065B:羽毛球 14':'A121065B',
        'A121065B:羽毛球 15':'A121065B',
        'A121065B:羽毛球 16':'A121065B',
        'A121065B:羽毛球 17':'A121065B',
        'A121065B:羽毛球 18':'A121065B',
        'A121065B:羽毛球 19':'A121065B',
        'A121066B:羽毛球(高级) 01':'A121066B',
        'A121066B:羽毛球(高级) 02':'A121066B',
        'A121066B:羽毛球(高级) 03':'A121066B',
        'A121066B:羽毛球(高级) 04':'A121066B',
        'A121066B:羽毛球(高级) 05':'A121066B',
        'A121066B:羽毛球(高级) 06':'A121066B',
        'A121066B:羽毛球(高级) 07':'A121066B',
        'A121066B:羽毛球(高级) 08':'A121066B',
        'A121066B:羽毛球(高级) 09':'A121066B',
        'A121066B:羽毛球(高级) 10':'A121066B',
        'A121066B:羽毛球(高级) 11':'A121066B',
        'A121066B:羽毛球(高级) 12':'A121066B',
        'A121066B:羽毛球(高级) 13':'A121066B',
        'A121066B:羽毛球(高级) 14':'A121066B',
        'A121066B:羽毛球(高级) 15':'A121066B',
        'A121066B:羽毛球(高级) 16':'A121066B',
        'A121066B:羽毛球(高级) 17':'A121066B',
        'A121066B:羽毛球(高级) 18':'A121066B',
        'A121066B:羽毛球(高级) 19':'A121066B',
        'A121066B:羽毛球(高级) 20':'A121066B',
        'A121066B:羽毛球(高级) 21':'A121066B',
        'A121068B:足球 01':'A121068B',
        'A121068B:足球 02':'A121068B',
        'A121068B:足球 03':'A121068B',
        'A121068B:足球 04':'A121068B',
        'A121068B:足球 05':'A121068B',
        'A121068B:足球 06':'A121068B',
        'A121068B:足球 07':'A121068B',
        'A121068B:足球 08':'A121068B',
        'A121068B:足球 09':'A121068B',
        'A121068B:足球 10':'A121068B',
        'A121068B:足球 11':'A121068B',
        'A121069B:足球(高级) 01':'A121069B',
        'A121078B:运动损伤与疼痛的康复 01':'A121078B',
        'A121078B:运动损伤与疼痛的康复 02':'A121078B',
        'A121080B:国际标准舞 01':'A121080B',
        'A121080B:国际标准舞 02':'A121080B',
        'A121080B:国际标准舞 03':'A121080B',
        'A121080B:国际标准舞 04':'A121080B',
        'A121080B:国际标准舞 05':'A121080B',
        'A121080B:国际标准舞 06':'A121080B',
        'A121080B:国际标准舞 07':'A121080B',
        'A121080B:国际标准舞 08':'A121080B',
        'A121081B:太极拳 01':'A121081B',
        'A121081B:太极拳 02':'A121081B',
        'A121082B:太极剑 01':'A121082B',
        'A121083B:射箭 01':'A121083B',
        'A121083B:射箭 02':'A121083B',
        'A121083B:射箭 03':'A121083B',
        'A121083B:射箭 04':'A121083B',
        'A121083B:射箭 05':'A121083B',
        'A121083B:射箭 06':'A121083B',
        'A121083B:射箭 07':'A121083B',
        'A121083B:射箭 08':'A121083B',
        'A121084B:传统武术养生功法 01':'A121084B',
        'A121084B:传统武术养生功法 02':'A121084B',
        'A121085B:游泳-自由泳 01':'A121085B',
        'A121085B:游泳-自由泳 02':'A121085B',
        'A022002B:心理素质培养与训练 01':'A022002B',
        'A022003B:助人理论与技能训练 01':'A022003B',
        'A022003B:助人理论与技能训练 02':'A022003B',
        'A022003B:助人理论与技能训练 03':'A022003B',
        'A022004B:幸福心理学 01':'A022004B',
        'A022004B:幸福心理学 02':'A022004B',
        'A022005B:社会心理学 01':'A022005B',
        'A022005B:社会心理学 02':'A022005B',
        'A022005B:社会心理学 03':'A022005B',
        'A022006B:两性心理学 01':'A022006B',
        'A022006B:两性心理学 02':'A022006B',
        'A022006B:两性心理学 03':'A022006B',
        'A022007B:情感心理学 01':'A022007B',
        'A022007B:情感心理学 02':'A022007B',
        'A022008B:生命教育 01':'A022008B',
        'A022008B:生命教育 02':'A022008B',
        'A022010B:人格心理学与个人成长 01':'A022010B',
        'A022010B:人格心理学与个人成长 02':'A022010B',
        'A022011B:大学生健康教育 01':'A022011B',
        'A022011B:大学生健康教育 02':'A022011B',
        'A022012B:大学生青春健康教育 01':'A022012B',
        'A022012B:大学生青春健康教育 02':'A022012B',
        'A022013B:团体心理与应用 01':'A022013B',
        'A124001B:舞蹈欣赏 01':'A124001B',
        'A124002B:舞蹈训练 01':'A124002B',
        'A124005B:中国民族乐器古筝演奏基础 01':'A124005B',
        'A124007B:民族器乐欣赏 01':'A124007B',
        'A124007B:民族器乐欣赏 02':'A124007B',
        'A124008B:交响乐欣赏 01':'A124008B',
        'A124008B:交响乐欣赏 02':'A124008B',
        'A124009B:名曲欣赏 01':'A124009B',
        'A124009B:名曲欣赏 02':'A124009B',
        'A124009B:名曲欣赏 03':'A124009B',
        'A124010B:小提琴演奏基础 01':'A124010B',
        'A124011B:歌剧欣赏 01':'A124011B',
        'A124011B:歌剧欣赏 02':'A124011B',
        'A124012B:声乐演唱基础 01':'A124012B',
        'A124012B:声乐演唱基础 02':'A124012B',
        'A124018B:陶笛基础演奏 01':'A124018B',
        'A124018B:陶笛基础演奏 02':'A124018B',
        'A124020B:电影导演分析 01':'A124020B',
        'A124023B:高清人文电影鉴赏与研究 01':'A124023B',
        'A124023B:高清人文电影鉴赏与研究 02':'A124023B',
        'A124023B:高清人文电影鉴赏与研究 03':'A124023B',
        'A124023B:高清人文电影鉴赏与研究 04':'A124023B',
        'A124026B:走进音乐剧 01':'A124026B',
        'A125001B:社会工作基础 01':'A125001B',
        'A125001B:社会工作基础 02':'A125001B',
        'A125001B:社会工作基础 03':'A125001B',
        'A125001B:社会工作基础 04':'A125001B',
        'A125002B:社会实践导论 01':'A125002B',
        'A125003B:大学生志愿服务理论与实践 01':'A125003B',
        'A126001B:科技文献检索 01':'A126001B',
        'A126001B:科技文献检索 02':'A126001B',
        'A126001B:科技文献检索 03':'A126001B',
        'A126001B:科技文献检索 04':'A126001B',
        'A126001B:科技文献检索 05':'A126001B',
        'A126001B:科技文献检索 06':'A126001B',
        'A126001B:科技文献检索 07':'A126001B',
        'A126001B:科技文献检索 08':'A126001B',
        'A126001B:科技文献检索 09':'A126001B',
        'A126002B:专利申请与创新实践 01':'A126002B',
        'A127001B:大学生安全素质概述 01':'A127001B',
        'A028001B:中国概况 01':'A028001B',
        'A028002B:中国文化 01':'A028002B',
        'C328001B:汉语进阶Ⅰ 01':'C328001B',
        'C328002B:汉语进阶Ⅱ 01':'C328002B',
        'C328003B:商务汉语 01':'C328003B',
        'C328008B:公共汉语综合Ⅱ 01':'C328008B',
        'C328009B:公共汉语读写Ⅱ 01':'C328009B',
        'C328010B:公共汉语口语Ⅱ 01':'C328010B',
        'A129001B:学业及职业生涯规划与设计 01':'A129001B',
        'A129001B:学业及职业生涯规划与设计 02':'A129001B',
        'A129002B:大学生就业指导 02':'A129002B',
        'A129004B:大学生KAB创业基础 01':'A129004B',
        'A129004B:大学生KAB创业基础 02':'A129004B',
        'A129004B:大学生KAB创业基础 03':'A129004B',
        'A129005B:领导力与沟通力 01':'A129005B',
        'A129005B:领导力与沟通力 02':'A129005B',
        'A129005B:领导力与沟通力 03':'A129005B',
        'A129005B:领导力与沟通力 04':'A129005B',
        'A034001B:植物与生活劳动实践 01':'A034001B',
        'A034002B:营养与美食劳动实践 01':'A034002B',

    };
    let hasSubmitted = false; // 新增标志变量


    // 检查并点击提交按钮
    function clickSubmitButton() {
        var submitButton = document.querySelector('#select-submit-btn');
        if (submitButton) {
            submitButton.click();
            console.log('提交按钮已点击');
            return true;
        } else {
            console.log('提交按钮未找到');
            return false;
        }
    }
    // 处理验证码，此函数需要您提供验证码处理逻辑
    async function handleCaptcha() {
        var captchaImage = document.querySelector('.captcha-dialog img');
        if (captchaImage) {
            var captchaSrc = captchaImage.src;
            // 这里应该是调用您的验证码API的代码
            // 比如：var solvedCaptcha = solveCaptcha(captchaSrc);
            var solvedCaptcha = '您的验证码解决方案'; // 示例

            var inputField = document.querySelector('.captcha-dialog input[name="answer"]');
            if (inputField) {
                inputField.value = solvedCaptcha;
                console.log('请输入验证码后按下回车');
                return true;
            } else {
                console.log('验证码输入框未找到');
                return false;
            }
        } else {
            console.log('验证码图片未找到');
            return false;
        }
    }

    // 点击确认按钮
    function clickConfirmButton() {
        var confirmButton = document.querySelector('.modal-footer .btn-info');
        if (confirmButton) {
            confirmButton.click();
            console.log('确认按钮已点击');
            return true;
        } else {
            console.log('确认按钮未找到');
            return false;
        }
    }
    async function clickCheckboxAndUnderstandModal(kchValue) {
        // Step 1: Click the checkbox
        var checkbox = document.querySelector(`input[type="checkbox"][kch="${kchValue}"]`);
        if (checkbox) {
            checkbox.click();
            console.log('成功找到checkbox');
        } else {
            console.log('未找到checkbox');
            return;
        }

        // Step 2: 等待窗口出现
        await waitForModal();

        // Step 3: Click the '已了解' button
        var understandButton = document.querySelector('.modal-footer button[data-bb-handler="info"]');
        if (understandButton) {
            understandButton.click();
            console.log(kchValue+"加入提交列表");
        } else {
            console.log('未找到已了解按钮');
        }
    }
    function waitForModal() {
        return new Promise(resolve => {
            var checkExist = setInterval(() => {
                var modal = document.querySelector('.modal-content');
                if (modal && modal.style.display !== 'none') {
                    clearInterval(checkExist);
                    resolve();
                }
            }, 100); // Check every 100ms
        });
    }
    // 执行脚本
    function executeScript() {
        setTimeout(() => {
            if (handleCaptcha()) {
                //clickConfirmButton();
            }
        }, 1000); // 延时1秒等待验证码加载
    }
    function submit(){
        // Step 4: 点击提交按钮
        var submitButton = document.querySelector('#select-submit-btn');
        if (submitButton) {
            submitButton.click();
            hasSubmitted = true; // 更新提交标志
        } else {
            console.log('提交按钮未找到');
        }
        executeScript();//等一下验证码
        handleCaptcha();//处理并填写验证码
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                clickConfirmButton();
            }
        });
    }

    const rows = document.querySelectorAll('table tbody tr');//获取表格
    if(rows.length==0){
        GM_notification({title: '你开的什么页面连个课表都没有',text:('you mother fucker'),timeout: 5000});
    }


    let cnt=0;
    rows.forEach(row => {
        if (row.cells[1] && row.cells[0]){
            let courseDescription = row.cells[2].innerText;
            let seatsText = row.cells[0].innerText.trim();


            // 检查课程是否在愿望单中
            wishListCourses.forEach(targetCourse => {
                if (courseDescription.includes(targetCourse) && !seatsText.includes('无余量')&& !seatsText.includes('已选')) {
                    cnt++;
                    if(!hasSubmitted){
                        clickCheckboxAndUnderstandModal(kchValues[targetCourse]);
                    }
                    console.log(targetCourse+"开始广播"+seatsText);
                    setInterval(function() {
                        GM_notification({title: '有余量', image:"https://yaya.csoci.com:1314/files/spc_ico_sora_sd.jpg",text:('课程 ' + targetCourse + ' 有余量！'), timeout: 5000});
                    }, 1000); // 每1000毫秒（即1秒）执行一次
                }
                else if(courseDescription.includes(targetCourse)){
                    //alert("无余量");
                    console.log(targetCourse+" 当前状态："+seatsText);


                }
            });
        }
    });
    if(cnt===0){
        setTimeout(function() {
            location.reload(); // 刷新页面
        }, 3000); // 3秒后执行
    }
    else if(cnt!=0){
         submit();
    }
})();

