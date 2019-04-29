import React from 'react';

export default class WLDateUtil extends React.Component{

    //判断是否为闰年
    static isLeapYear(year){
        if(year%400 === 0||(year%4 === 0&&year%100 !== 0)){
            return true;
        }
        return false;
    }

    //获取某年某月的天数
    static getDayCount(year,month){
        if(undefined == year||undefined == month || null == year || null == month || 0 == year || 0 == month){
            return 0;
        }
        if(2 == month){
            if(this.isLeapYear(year)){
                return 29;
            }else{
                return 28;
            }
        }else if(month in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
            return 31;
        }else{
            return 30;
        }
    }

    static formatString(number){
        if(number == undefined || number == null){
            return '';
        }
        return number < 10 ? '0'+number : number+'';
    }

    static getDate(){
        let date = new Date();
        return date;
    }
    //获取当前日期的年份，例如2018
    static year(){
        let date = this.getDate();
        return date.getFullYear();
    }
    //获取当前日期的月份（1～12）
    static month(){
        let date = this.getDate();
        return date.getMonth()+1;
    }
    //获取当前日期的日（1～31）
    static day(){
        let date = this.getDate();
        return date.getDate();
    }
    //获取当前日期的小时（0～23）
    static hour(){
        let date = this.getDate();
        return date.getHours();
    }
    //获取当前日期的分钟（0～59）
    static minute(){
        let date = this.getDate();
        return date.getMinutes();
    }
    //获取当前日期的秒数（0～59）
    static second(){
        let date = this.getDate();
        return date.getSeconds();
    }

    static currentDateString(){
        let year = this.year();
        
        let month = this.month();
        month = this.formatString(month);
        
        let day = this.day();
        day = this.formatString(day);

        let hour = this.hour();
        hour = this.formatString(hour);

        let minute = this.minute();
        minute = this.formatString(minute);

        let second = this.second();
        second = this.formatString(second);
        
        return year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;
    }

    /**
     * 对日期进行截取
     * @param {*} dateStr 日期字符串
     * @param {*} type 日期类型 ['date', 'date_month','time','date_time']
     */
    static subDateString(dateStr,type){
        let rets = [];
        if(dateStr != undefined && dateStr != null && dateStr.length > 0){
            if('date' == type){
                if(10 == dateStr.length){//2018-09-09
                    let year = dateStr.slice(0,4);
                    let month = dateStr.slice(5,7);
                    let day = dateStr.slice(8,10);
                    rets.push(year,month,day,'','','');
                }
            }else if('date_month' == type){
                if(7 == dateStr.length){//2018-09
                    let year = dateStr.slice(0,4);
                    let month = dateStr.slice(5,7);
                    rets.push(year,month,'','','','');
                }
            }else if('time' == type){
                if(8 == dateStr.length){//19:29:20
                    let hour = dateStr.slice(0,2);
                    let minute = dateStr.slice(3,5);
                    let second = dateStr.slice(6,8);
                    rets.push('','','',hour,minute,second);
                }
            }else if('date_time' == type){
                if(19 == dateStr.length){//2018-09-09 10:20:30
                    let year = dateStr.slice(0,4);
                    let month = dateStr.slice(5,7);
                    let day = dateStr.slice(8,10);
                    let hour = dateStr.slice(11,13);
                    let minute = dateStr.slice(14,16);
                    let second = dateStr.slice(17,19);
                    rets.push(year,month,day,hour,minute,second);
                }
            }
        }
        return rets;
    }

    static getShowYear(){
        let array = [];
        for(let k=2010;k<=parseInt(this.year());k++){
            array.push(k+'');
        }
        return array;
    }
    static getShowMonth(){
        let array = [];
        for(let i=1;i<=12;i++){
            let month = this.formatString(i);
            array.push(month);
        }
        return array;
    }
    static getShowDay(year,month){
        let array = [];
        let count = this.getDayCount(year,month);
        for(let i=1;i<=count;i++){
            let day = this.formatString(i);;
            array.push(day);
        }
        return array;
    }
    static getShowHour(){
        let array = [];
        for (let i = 1; i < 24; i++){
            let hour = this.formatString(i);;
            array.push(hour);
        }
        return array;
    }
    static getShowMinute(){
        let array = [];
        for (let i = 1; i <= 60; i++){
            let minute = this.formatString(i);;
            array.push(minute);
        }
        return array;
    }
    static getShowSecond(){
        let array = [];
        for (let i = 1; i <= 60; i++){
            let second = this.formatString(i);;
            array.push(second);
        }
        return array;
    }
}