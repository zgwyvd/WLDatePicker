import React from 'react';
import {View,
        Picker,
        Text,
        Modal,
        TouchableOpacity,
        StyleSheet
    } from 'react-native';
import PropTypes from 'prop-types';

//import {I18n} from '../../../Utils/LanguageUtil';
//import * as CommonUtils from '../../../Utils/CommonUtils';
//import * as WLDateUtils from '../../../Utils/WLDateUtils';

import WLDateUtils from './WLDateUtils';

// 
/**
 * 日期类型
 * date:格式 yyyy-MM-dd 
 * date_month:格式 yyyy-MM
 * time:格式 hh:mm:ss
 * date_time:格式 yyyy-MM-dd HH:mm:ss
 */
const DATETYPE = ['date', 'date_month','time','date_time'];

/**
 * 动画类型
 */
const ANIMATION = ['none', 'slide', 'fade'];

export default class WLDatePicker extends React.Component{

    static propTypes = {
        dateType:PropTypes.oneOf(DATETYPE),
        animationType:PropTypes.oneOf(ANIMATION),
        showDate:PropTypes.string,//显示日期
        
        visible:PropTypes.bool.isRequired,//是否隐藏
        hideCompleteFunc:PropTypes.func,//隐藏完成回调方法
        sureFunc:PropTypes.func,//确定回调方法
    };
    static defaultProps = {
        dateType:'date_time',
        animationType:'fade',

        showDate:WLDateUtils.currentDateString(),
        visible:false,
    };

    constructor(props){
        super(props);

        let array = WLDateUtils.subDateString(props.showDate,props.dateType);
        let year = array[0];
        let month = array[1];
        let day = array[2];
        let hour = array[3];
        let minute = array[4];
        let second = array[5];

        this.state = ({
            visible:props.visible,
            
            yearArray:WLDateUtils.getShowYear(),
            monthArray:WLDateUtils.getShowMonth(),
            dayArray:WLDateUtils.getShowDay(parseInt(year),parseInt(month)),
            hourArray:WLDateUtils.getShowHour(),
            minuteArray:WLDateUtils.getShowMinute(),
            secondArray:WLDateUtils.getShowSecond(),

            selectYear:year,
            selectMonth:month,
            selectDay:day,
            selectHour:hour,
            selectMinute:minute,
            selectSecond:second,
        });
    }
    componentWillReceiveProps(nextProps){
        let array = WLDateUtils.subDateString(nextProps.showDate,nextProps.dateType);
        let year = array[0];
        let month = array[1];
        let day = array[2];
        let hour = array[3];
        let minute = array[4];
        let second = array[5];

        this.setState({ 
            visible:nextProps.visible, 
        
            selectYear:year,
            selectMonth:month,
            selectDay:day,
            selectHour:hour,
            selectMinute:minute,
            selectSecond:second,
        });
    }
    shouldComponentUpdate(nextProps,nextState){
        
        if(nextState.visible != this.state.visible 
            || nextState.selectYear != this.state.selectYear
            || nextState.selectMonth != this.state.selectMonth
            || nextState.selectDay != this.state.selectDay
            || nextState.selectHour != this.state.selectHour
            || nextState.selectMinute != this.state.selectMinute
            || nextState.selectSecond != this.state.selectSecond){
            return true;
        }
        return false;
    }

    //刷新天picker
    updateDayPicker(year,month){
        let dayArray = WLDateUtils.getShowDay(year,month);
        let count = WLDateUtils.getDayCount(year,month);
        let day = parseInt(this.state.selectDay);
        if(day>count){
            this.setState({
                selectDay:count+''
            });
        }
        this.setState({
            selectYear:year+'',
            selectMonth:WLDateUtils.formatString(month),
            dayArray:dayArray,
        });
    }

    _handleCancel(){
        this.close();
    }
    _handleSure(){
        let year = this.state.selectYear;
        let month = this.state.selectMonth;
        let day = this.state.selectDay;
        let hour = this.state.selectHour;
        let minute = this.state.selectMinute;
        let second = this.state.selectSecond;

        let dateType = this.props.dateType;

        let date = '';

        if(dateType == 'date'){
            date = year+'-'+month+'-'+day;
        }else if(dateType == 'date_month'){
            date = year+'-'+month;
        }else if(dateType == 'time'){
            date = hour+':'+minute+':'+second;
        }else{
            date = year+'-'+month+'-'+day +' '+hour+':'+minute+':'+second;
        }
        this.close();
        this.props.sureFunc(date);
    }
    //关闭HUD
    close() {
        this.setState({
            visible: false
        });
        this.props.hideCompleteFunc();
    }

    _renderBtnComponent(){
        return (
            <View style = {styles.btn_container}>
                {/*取消*/}
                <TouchableOpacity
                    activeOpacity = {0.8}
                    style = {[styles.btn,{backgroundColor:'rgb(220,220,220)'}]}
                    onPress = {()=>{this._handleCancel()}}
                >
                    <Text style = {styles.btn_title}>{'取消'}</Text>
                </TouchableOpacity>

                {/*确定*/}
                <TouchableOpacity
                    activeOpacity = {0.8}
                    style = {[styles.btn,{backgroundColor:'red'}]}
                    onPress = {()=>{this._handleSure()}}
                >
                    <Text style = {styles.btn_title}>{'确定'}</Text>
                </TouchableOpacity>
            </View>
        );
    }

    _renderDatePicker(){
        return (
            <View style = {styles.picker_container}>
                {/* 年 */}
                <Picker
                    selectedValue={this.state.selectYear}
                    onValueChange={(year) => {
                        let year_number = parseInt(year);
                        let month_number = parseInt(this.state.selectMonth);
                        this.updateDayPicker(year_number,month_number);
                    }}
                    style = {styles.picker}
                >
                    {this.state.yearArray.map((year,index)=>{
                        return (
                            <Picker.Item label={year} value = {year} key = {'year_item_'+index} />
                        );
                    })}
                </Picker>

                {/* 月 */}
                <Picker 
                    selectedValue={this.state.selectMonth}
                    onValueChange={(month) => {
                        let year_number = parseInt(this.state.selectYear);
                        let month_number = parseInt(month);
                        this.updateDayPicker(year_number,month_number);
                    }}
                    style = {styles.picker}
                >
                    {this.state.monthArray.map((month,index)=>{
                        return (
                            <Picker.Item label={month} value = {month} key = {'month_item_'+index} />
                        );
                    })}
                </Picker>

                {/* 日 */}
                <Picker 
                    selectedValue={this.state.selectDay}
                    onValueChange={(day) => {
                        this.setState({
                            selectDay:day,
                        });
                    }}
                    style = {styles.picker}
                >
                    {this.state.dayArray.map((day,index)=>{
                        return (
                            <Picker.Item label={day} value = {day} key = {'day_item_'+index} />
                        );
                    })}
                </Picker>
            </View>
        );
    }
    _renderDateMonthPicker(){
        return (
            <View style = {styles.picker_container}>
                {/* 年 */}
                <Picker
                    selectedValue={this.state.selectYear}
                    onValueChange={(year) => {
                        let year_number = parseInt(year);
                        let month_number = parseInt(this.state.selectMonth);
                        this.updateDayPicker(year_number,month_number);
                    }}
                    style = {styles.picker}
                >
                    {this.state.yearArray.map((year,index)=>{
                        return (
                            <Picker.Item label={year} value = {year} key = {'year_item_'+index} />
                        );
                    })}
                </Picker>

                {/* 月 */}
                <Picker 
                    selectedValue={this.state.selectMonth}
                    onValueChange={(month) => {
                        let year_number = parseInt(this.state.selectYear);
                        let month_number = parseInt(month);
                        this.updateDayPicker(year_number,month_number);
                    }}
                    style = {styles.picker}
                >
                    {this.state.monthArray.map((month,index)=>{
                        return (
                            <Picker.Item label={month} value = {month} key = {'month_item_'+index} />
                        );
                    })}
                </Picker>
            </View>
        );
    }
    _renderTimePicker(){
        return (
            <View style = {styles.picker_container}>
                {/* 时 */}
                <Picker 
                    selectedValue={this.state.selectHour}
                    onValueChange={(hour) => {
                        this.setState({
                            selectHour:hour,
                        });
                    }}
                    style = {styles.picker}
                >
                    {this.state.hourArray.map((hour,index)=>{
                        return (
                            <Picker.Item label={hour} value = {hour} key = {'hour_item_'+index} />
                        );
                    })}
                </Picker>

                {/* 分 */}
                <Picker 
                    selectedValue={this.state.selectMinute}
                    onValueChange={(minute) => {
                        this.setState({
                            selectMinute:minute,
                        });
                    }}
                    style = {styles.picker}
                >
                    {this.state.minuteArray.map((minute,index)=>{
                        return (
                            <Picker.Item label={minute} value = {minute} key = {'minute_item_'+index} />
                        );
                    })}
                </Picker>

                {/* 秒 */}
                <Picker 
                    selectedValue={this.state.selectSecond}
                    onValueChange={(second) => {
                        this.setState({
                            selectSecond:second,
                        });
                    }}
                    style = {styles.picker}
                >
                    {this.state.secondArray.map((second,index)=>{
                        return (
                            <Picker.Item label={second} value = {second} key = {'second_item_'+index} />
                        );
                    })}
                </Picker>
            </View>
        );
    }
    _renderDateTimePicker(){
        return (
            <View style = {styles.picker_container}>
                {/* 年 */}
                <Picker
                    selectedValue={this.state.selectYear}
                    onValueChange={(year) => {
                        let year_number = parseInt(year);
                        let month_number = parseInt(this.state.selectMonth);
                        this.updateDayPicker(year_number,month_number);
                    }}
                    style = {styles.picker}
                >
                    {this.state.yearArray.map((year,index)=>{
                        return (
                            <Picker.Item label={year} value = {year} key = {'year_item_'+index} />
                        );
                    })}
                </Picker>

                {/* 月 */}
                <Picker 
                    selectedValue={this.state.selectMonth}
                    onValueChange={(month) => {
                        let year_number = parseInt(this.state.selectYear);
                        let month_number = parseInt(month);
                        this.updateDayPicker(year_number,month_number);
                    }}
                    style = {styles.picker}
                >
                    {this.state.monthArray.map((month,index)=>{
                        return (
                            <Picker.Item label={month} value = {month} key = {'month_item_'+index} />
                        );
                    })}
                </Picker>

                {/* 日 */}
                <Picker 
                    selectedValue={this.state.selectDay}
                    onValueChange={(day) => {
                        this.setState({
                            selectDay:day,
                        });
                    }}
                    style = {styles.picker}
                >
                    {this.state.dayArray.map((day,index)=>{
                        return (
                            <Picker.Item label={day} value = {day} key = {'day_item_'+index} />
                        );
                    })}
                </Picker>

                {/* 时 */}
                <Picker 
                    selectedValue={this.state.selectHour}
                    onValueChange={(hour) => {
                        this.setState({
                            selectHour:hour,
                        });
                    }}
                    style = {styles.picker}
                >
                    {this.state.hourArray.map((hour,index)=>{
                        return (
                            <Picker.Item label={hour} value = {hour} key = {'hour_item_'+index} />
                        );
                    })}
                </Picker>

                {/* 分 */}
                <Picker 
                    selectedValue={this.state.selectMinute}
                    onValueChange={(minute) => {
                        this.setState({
                            selectMinute:minute,
                        });
                    }}
                    style = {styles.picker}
                >
                    {this.state.minuteArray.map((minute,index)=>{
                        return (
                            <Picker.Item label={minute} value = {minute} key = {'minute_item_'+index} />
                        );
                    })}
                </Picker>

                {/* 秒 */}
                <Picker 
                    selectedValue={this.state.selectSecond}
                    onValueChange={(second) => {
                        this.setState({
                            selectSecond:second,
                        });
                    }}
                    style = {styles.picker}
                >
                    {this.state.secondArray.map((second,index)=>{
                        return (
                            <Picker.Item label={second} value = {second} key = {'second_item_'+index} />
                        );
                    })}
                </Picker>
            </View>
        );
    }
    
    _renderPickerComponent(){
        let dateType = this.props.dateType;
        if(dateType == 'date'){
            return this._renderDatePicker();
        }else if(dateType == 'date_month'){
            return this._renderDateMonthPicker();
        }else if(dateType == 'time'){
            return this._renderTimePicker();
        }else{
            return this._renderDateTimePicker();
        }
    }
    render(){
        const { visible } = this.state;
        if (!visible){
            return null;
        }
        
        return (
            <Modal
                animationType = {this.props.animationType}
                onRequestClose = {() => this.close()}
                supportedOrientations = {['landscape', 'portrait']}
                transparent
                visible={visible}
            >
                <View style = {styles.container}>
                    {this._renderBtnComponent()}
                    {this._renderPickerComponent()}
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'flex-end',
        backgroundColor:'rgba(0,0,0,0.4)',
    },
    btn_container:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    btn:{
        flex: 1,
    },
    btn_title:{
        color:'white',
        fontSize: 16,
        textAlign:'center',
        marginVertical: 10,
    },
    picker_container:{
        height:216,
        width:'100%',
        flexDirection:'row', 
        backgroundColor:'white',
    },
    picker:{
        flex:1,
    },
});