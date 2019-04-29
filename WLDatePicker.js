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
//import * as DateConfig from '../../../Utils/DateConfig';

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

export default class WLDatePicker extends React.Component{

    static propTypes = {
        dateType:PropTypes.oneOf(DATETYPE),//日期类型
        showDate:PropTypes.string,//显示日期
        monthCount:PropTypes.number,//最大月份个数，从当前月份开始往前计算

        visible:PropTypes.bool.isRequired,//是否隐藏
        hideCompleteFunc:PropTypes.func,//隐藏完成回调方法
        sureFunc:PropTypes.func,//确定回调方法
        overDateFunc:PropTypes.func,//超出日期选择范围回调方法
    };
    static defaultProps = {
        dateType:'date',
        showDate:DateConfig.currentDateString(),
        visible:false,
    };

    constructor(props){
        super(props);

        let array = this.subDateString(props.showDate,props.dateType == 'date');
        let year = array[0];
        let month = array[1];
        let day = '';
        if(array.length > 2){
            day = array[2];
        }
    
        this.state = ({
            visible:props.visible,
            dateType:props.dateType,
            
            yearArray:this.getShowYear(),
            monthArray:this.getShowMonth(),
            dayArray:this.getShowDay(parseInt(year),parseInt(month)),

            selectYear:year,
            selectMonth:month,
            selectDay:day,
        });
    }
    componentWillReceiveProps(nextProps){
        let array = this.subDateString(nextProps.showDate,nextProps.dateType == 'date');
        let year = array[0];
        let month = array[1];
        let day = '';
        if(array.length > 2){
            day = array[2];
        }
        this.setState({ 
            visible:nextProps.visible, 
            dateType:nextProps.dateType,

            selectYear:year,
            selectMonth:month,
            selectDay:day,
        });
    }

    //截取日期字符串 2018-07-18 
    subDateString(date,isHasDay){
        let array = [];
        if(date && date.length>0){
            let year = date.slice(0,4);
            let month = date.slice(5,7);
            if(isHasDay){
                let day = date.slice(8,10);
                array.push(year,month,day);
            }else{
                array.push(year,month);
            }
        }
        return array;
    }
    //刷新天picker
    updateDayPicker(year,month){
        let dayArray = this.getShowDay(year,month);
        let count = DateConfig.getDayCount(year,month);
        let day = parseInt(this.state.selectDay);
        if(day>count){
            this.setState({
                selectDay:count+''
            });
        }
        this.setState({
            selectYear:year+'',
            selectMonth:month < 10 ? '0'+month : month+'',
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
        let date = '';

        if(this.state.dateType == 'date_month'){
            date = year+'-'+month;

            let isFind = false;
            let y = DateConfig.year();
            let m = DateConfig.month();
            for(let i=0;i<this.props.monthCount;i++){
                let yearMonth = y+'-'+DateConfig.formatString(m);
                m--;
                if(m == 0){
                    m = 12;
                    y--;
                }

                if(date == yearMonth){
                    isFind = true;
                    break;
                }
            }
            if(!isFind){
                this.props.overDateFunc(2);
                this.close();
                return;
            }else{
                this.close();
            }
        }else{
            date = year+'-'+month+'-'+day;
            if(DateConfig.isOverToday(date)){
                this.props.overDateFunc(1);
                this.close();
                return;
            }else{
                this.close();
            }
        }
        this.props.sureFunc(date);
    }
    //关闭HUD
    close() {
        this.setState({visible: false});
        this.props.hideCompleteFunc();
    }

    _renderBtnComponent(){
        return (
            <View style = {styles.btn_container}>
                {/*取消*/}
                <TouchableOpacity
                    activeOpacity = {0.7}
                    style = {[styles.btn,{backgroundColor:'rgb(220,220,220)'}]}
                    onPress = {()=>{this._handleCancel()}}
                >
                    <Text style = {styles.btn_title}>{I18n.t('hint.cancel')}</Text>
                </TouchableOpacity>

                {/*确定*/}
                <TouchableOpacity
                    activeOpacity = {0.7}
                    style = {[styles.btn,{backgroundColor:CommonUtils.commonColor()}]}
                    onPress = {()=>{this._handleSure()}}
                >
                    <Text style = {styles.btn_title}>{I18n.t('hint.confirm')}</Text>
                </TouchableOpacity>
            </View>
        );
    }
    _renderDatePicker(){
        let dayPicker = null;
        if(this.state.dateType == 'date'){
            dayPicker = (
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
            );
        }
        return (
            <View style = {styles.picker_container}>
                {/*年份*/}
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

                {/*月份*/}
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
                
                {/*天*/}
                {dayPicker}
            </View>
        );
    }

    render(){
        const { visible } = this.state;
        if (!visible){
            return null;
        }
        
        return (
            <Modal
                animationType={'fade'}
                onRequestClose={() => this.close()}
                supportedOrientations={['landscape', 'portrait']}
                transparent
                visible={visible}
            >
                <View style = {styles.container}>
                    {this._renderBtnComponent()}
                    {this._renderDatePicker()}
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