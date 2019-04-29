
安装命令
```
yarn add WLDatePicker
```

本组件是一个日期时间选择器，具体参数下

|属性|介绍|类型|必填|默认值|
|:---|:---|:---|:---|:---|
|dateType|日期类型|enum('date','date_month','time','date_time')|false|'date_time'|
|animationType|动画类型|enum('none','slide','fade')|false|'fade'|
|showDate|显示日期|string|false|当前日期时间|
|visible|是否显示|bool|true|false|
|hideCompleteFunc|隐藏完成回调函数|func|false||
|sureFunc|点击确定返回选中日期时间函数|func|false||
