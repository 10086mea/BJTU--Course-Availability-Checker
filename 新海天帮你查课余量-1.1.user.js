// ==UserScript==
// @name         新海天帮你查课余量
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  监测特定课程的余量，并在有余量时发送浏览器通知，自动点击提交，仅需手动填写验证码
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
        'C312009B:高级英语视听说 03',
    ];//必须填写序号，同一课程只能选一个时间段，不填脚本会爆炸

    // 与课程对应的课程号
    var kchValues = {
        'M202003B:程序设计分组训练 01 计算机学院':'M202003B',
        'M202003B:程序设计分组训练 02 计算机学院':'M202003B',
        'M202003B:程序设计分组训练 03 计算机学院':'M202003B',
        'M202003B:程序设计分组训练 04 计算机学院':'M202003B',
        'M202003B:程序设计分组训练 05 计算机学院':'M202003B',
        'M202003B:程序设计分组训练 06 计算机学院':'M202003B',
        'M202003B:程序设计分组训练 07 计算机学院':'M202003B',
        'P202001B:计算思维综合训练 01 计算机学院':'P202001B',
        'P202001B:计算思维综合训练 02 计算机学院':'P202001B',
        'P202001B:计算思维综合训练 03 计算机学院':'P202001B',
        'P202001B:计算思维综合训练 04 计算机学院':'P202001B',
        'P202001B:计算思维综合训练 05 计算机学院':'P202001B',
        'P202001B:计算思维综合训练 06 计算机学院':'P202001B',
        'P202001B:计算思维综合训练 07 计算机学院':'P202001B',
        'P202001B:计算思维综合训练 08 计算机学院':'P202001B',
        'P202002B:Python编程实训 01 计算机学院':'P202002B',
        'P202002B:Python编程实训 02 计算机学院':'P202002B',
        'P202002B:Python编程实训 03 计算机学院':'P202002B',
        'P202002B:Python编程实训 04 计算机学院':'P202002B',
        'P202002B:Python编程实训 05 计算机学院':'P202002B',
        'A011009B:大学美育实践 01 建艺学院':'A011009B',
        'C112002B:初级综合英语 01 语言学院':'C112002B',
        'C112002B:初级综合英语 02 语言学院':'C112002B',
        'C112002B:初级综合英语 03 语言学院':'C112002B',
        'C112002B:初级综合英语 04 语言学院':'C112002B',
        'C112002B:初级综合英语 05 语言学院':'C112002B',
        'C112002B:初级综合英语 06 语言学院':'C112002B',
        'C112004B:高级综合英语 01 语言学院':'C112004B',
        'C112004B:高级综合英语 02 语言学院':'C112004B',
        'C112004B:高级综合英语 03 语言学院':'C112004B',
        'C112004B:高级综合英语 04 语言学院':'C112004B',
        'C112004B:高级综合英语 05 语言学院':'C112004B',
        'C112004B:高级综合英语 06 语言学院':'C112004B',
        'C112004B:高级综合英语 07 语言学院':'C112004B',
        'C112004B:高级综合英语 08 语言学院':'C112004B',
        'C112004B:高级综合英语 09 语言学院':'C112004B',
        'C112004B:高级综合英语 10 语言学院':'C112004B',
        'C112004B:高级综合英语 11 语言学院':'C112004B',
        'C112004B:高级综合英语 12 语言学院':'C112004B',
        'C112004B:高级综合英语 13 语言学院':'C112004B',
        'C112004B:高级综合英语 14 语言学院':'C112004B',
        'C112004B:高级综合英语 15 语言学院':'C112004B',
        'C112004B:高级综合英语 16 语言学院':'C112004B',
        'C112004B:高级综合英语 17 语言学院':'C112004B',
        'C112004B:高级综合英语 18 语言学院':'C112004B',
        'C112004B:高级综合英语 19 语言学院':'C112004B',
        'C112004B:高级综合英语 20 语言学院':'C112004B',
        'C112004B:高级综合英语 21 语言学院':'C112004B',
        'C112004B:高级综合英语 22 语言学院':'C112004B',
        'C112004B:高级综合英语 23 语言学院':'C112004B',
        'C112004B:高级综合英语 24 语言学院':'C112004B',
        'C112004B:高级综合英语 25 语言学院':'C112004B',
        'C112004B:高级综合英语 26 语言学院':'C112004B',
        'C112004B:高级综合英语 27 语言学院':'C112004B',
        'C112004B:高级综合英语 28 语言学院':'C112004B',
        'C112004B:高级综合英语 29 语言学院':'C112004B',
        'C112004B:高级综合英语 30 语言学院':'C112004B',
        'C112004B:高级综合英语 31 语言学院':'C112004B',
        'C112004B:高级综合英语 32 语言学院':'C112004B',
        'C112004B:高级综合英语 33 语言学院':'C112004B',
        'C112004B:高级综合英语 34 语言学院':'C112004B',
        'C112004B:高级综合英语 35 语言学院':'C112004B',
        'C112004B:高级综合英语 36 语言学院':'C112004B',
        'C112004B:高级综合英语 37 语言学院':'C112004B',
        'C112004B:高级综合英语 38 语言学院':'C112004B',
        'C112004B:高级综合英语 39 语言学院':'C112004B',
        'C112004B:高级综合英语 40 语言学院':'C112004B',
        'C312002B:学术英语交流 01 语言学院':'C312002B',
        'C312002B:学术英语交流 02 语言学院':'C312002B',
        'C312004B:商务用途英语 01 语言学院':'C312004B',
        'C312004B:商务用途英语 02 语言学院':'C312004B',
        'C312004B:商务用途英语 03 语言学院':'C312004B',
        'C312004B:商务用途英语 04 语言学院':'C312004B',
        'C312004B:商务用途英语 05 语言学院':'C312004B',
        'C312005B:跨文化交际英语 01 语言学院':'C312005B',
        'C312005B:跨文化交际英语 02 语言学院':'C312005B',
        'C312005B:跨文化交际英语 03 语言学院':'C312005B',
        'C312005B:跨文化交际英语 04 语言学院':'C312005B',
        'C312005B:跨文化交际英语 05 语言学院':'C312005B',
        'C312005B:跨文化交际英语 06 语言学院':'C312005B',
        'C312005B:跨文化交际英语 07 语言学院':'C312005B',
        'C312005B:跨文化交际英语 08 语言学院':'C312005B',
        'C312005B:跨文化交际英语 09 语言学院':'C312005B',
        'C312005B:跨文化交际英语 10 语言学院':'C312005B',
        'C312005B:跨文化交际英语 11 语言学院':'C312005B',
        'C312008B:高端国际人才英语课程 01 语言学院':'C312008B',
        'C312009B:高级英语视听说 01 语言学院':'C312009B',
        'C312009B:高级英语视听说 02 语言学院':'C312009B',
        'C312009B:高级英语视听说 03 语言学院':'C312009B',
        'C312010B:高级英语读写 01 语言学院':'C312010B',
        'C312010B:高级英语读写 02 语言学院':'C312010B',
        'C312010B:高级英语读写 03 语言学院':'C312010B',
        'C312010B:高级英语读写 04 语言学院':'C312010B',
        'C312011B:科技英语英汉互译 01 语言学院':'C312011B',
        'C312011B:科技英语英汉互译 02 语言学院':'C312011B',
        'C312014B:科技综合英语 01 语言学院':'C312014B',
        'C312014B:科技综合英语 02 语言学院':'C312014B',
        'C312014B:科技综合英语 03 语言学院':'C312014B',
        'C312014B:科技综合英语 04 语言学院':'C312014B',
        'C312014B:科技综合英语 05 语言学院':'C312014B',
        'C312017B:国际议题演讲与陈述 01 语言学院':'C312017B',
        'C312017B:国际议题演讲与陈述 02 语言学院':'C312017B',
        'C312017B:国际议题演讲与陈述 03 语言学院':'C312017B',
        'C312017B:国际议题演讲与陈述 04 语言学院':'C312017B',
        'C312017B:国际议题演讲与陈述 05 语言学院':'C312017B',
        'C312017B:国际议题演讲与陈述 06 语言学院':'C312017B',
        'C312018B:口译 01 语言学院':'C312018B',
        'C312018B:口译 02 语言学院':'C312018B',
        'C312018B:口译 03 语言学院':'C312018B',
        'C312018B:口译 04 语言学院':'C312018B',
        'C312018B:口译 05 语言学院':'C312018B',
        'C312018B:口译 06 语言学院':'C312018B',
        'M108001B:大学物理（A)Ⅰ 01 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 02 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 03 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 04 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 05 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 06 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 07 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 08 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 09 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 10 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 11 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 12 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 13 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 14 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 15 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 16 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 17 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 18 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 19 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 20 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 21 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 22 物工学院':'M108001B',
        'M108001B:大学物理（A)Ⅰ 23 物工学院':'M108001B',
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
            let courseDescription = row.cells[1].innerText;
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

