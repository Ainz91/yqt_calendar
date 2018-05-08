<template>
	<section class="wh_container">
		<div class="wh_content_all">
			<div class="content_tabs">
				<div class="cancel" @click="cancel" v-show="onlyTime" v-bind:class="{onlyTime:onlyTime}">
					取消
				</div>
				<tab v-show="!onlyTime" class="newTab">
					<tab-item selected @on-item-click="switchSelect('date')" class="tabItem">{{dateTop}}</tab-item>
					<tab-item @on-item-click="switchSelect('time')" v-if="!onlyDate"  class="tabItem">{{selectedTime}}</tab-item>
				</tab>
				<div class="confirm" v-show="!onlyDate" @click="commitDate" v-bind:class="{onlyTime:onlyTime}">
					确定
				</div>
				<div class="confirm" @click="createDate()" v-if="onlyDate" v-bind:class="{onlyTime:onlyTime}">
					今天
				</div>
			</div>
			<transition name="fade">
				<div style="height: 5rem" v-show="showTimeSelected">
					<picker :data='times' v-model='thisTime' @on-change='timeChange'></picker>
				</div>
			</transition>
			<transition name="fade">
				<swiper style="" :show-dots="false" v-model="swiperMonthIndex" direction='vertical' height="660px"
						 loop v-show="showMonthSelect">
					<swiper-item v-for="year in yearList" :key="year.year"
					>
						<div class="yearSelect_content">
							<div class="yearSelect_content_item" v-for="(item,index) in year.monthList"
								 @click="clickMonth(item,index)">
								<div>
									<li class="wh_nextDayShow"
										v-if="(isHideOtherday&&item.nextDayShow)||item.hidden"
										v-bind:class="{isToday_now:item.isTodayNow}">
										{{item.yearStr}}
									</li>
									<li v-else="(isHideOtherday&&item.nextDayShow)||item.otherMonth||item.dayHide"
										v-bind:class="{ isThisMonth: item.isThisMonth,wh_isMark:item.isMark,isTodayNow:item.isTodayNow}">
										{{item.yearStr}}
									</li>
								</div>
							</div>
						</div>
					</swiper-item>
				</swiper>
			</transition>
			<transition name="fade">
				<swiper style="" :show-dots="false" v-model="swiperIndex"
						@on-index-change="changeMonth" loop v-show="showCalender">
					<swiper-item v-for="month in swiperList" :key="month.timestamp"
>
						<div class="wh_content">
							<div class="wh_content_item" v-for="tag in textTop">
								<div>
									{{tag}}
								</div>
							</div>
						</div>
						<div class="wh_content">
							<div class="wh_content_item" v-for="(item,index) in month.daylist"
								 @click="clickDay(item,index)">
								<div>
									<li class="wh_nextDayShow"
										v-if="(isHideOtherday&&item.nextDayShow)||item.otherMonth||item.dayHide"
										v-bind:class="{isToday_now:item.isNow}">
										{{item.id}}
									</li>
									<li v-else="(isHideOtherday&&item.nextDayShow)||item.otherMonth||item.dayHide"
										v-bind:class="{ wh_isToday: item.isToday}">
										{{item.id}}
									</li>
									<div class="display:none"
										 v-bind:class="{isMark:item.isMark,isDisable:item.isDisable}"></div>
								</div>
							</div>
						</div>
					</swiper-item>
				</swiper>
			</transition>
		</div>
	</section>

</template>
<script>
    import './calendar.less';
    import {
        Popover, Tab, TabItem, Swiper, Picker,
        SwiperItem,
    } from 'vux'

    export default {
        name:'calendar',
        components: {
            Popover, Tab, Picker,
            TabItem, Swiper,
            SwiperItem,
        },
        data() {
            return {
                thisDate: [],
                times: [],
                thisTime: [],
                compareTime: [],
                selectedDate: '2018年4月',
                selectedTime: '08:30',
                textTop: ['日', '一', '二', '三', '四', '五', '六'],
                myData: [],
                list: [],
                onlyDate: false,
                onlyTime: false,
                swiperIndex: 1,
                swiperMonthIndex: 19,
                dateTop: '',
                swiperList: [],
                yearList: [],
                lastIndex: 1,
                showCalender: true,
                showMonthSelect: false,
                showTimeSelected: false
            };
        },
        props: {
            onlyMarked: {default: false},//只能点击mark的时间
            displayMode: {default: 3},//1、都显示，2、只能选择时间，3、只能选择日期
            markArray: {default: '[]'},//被标记日期列表
            disMarkArray: {default: '[]'},//被alert日期列表
            markDate: {default: '[]'},
            agoDayHide: {default: '0'},//某个日期以前的不允许点击 时间戳长度是 10 位，0代表禁用
            futureDayHide: {default: '15181550670000'},//某个日期以后的不允许点击 时间戳长度是 10 位
            isHideOtherday: {default: false}//超过今天的日期是否可以被点击 时间戳长度是 10 位
        },
        created() {
            this.myData = new Date();
        },
        methods: {
            cancel() {
                const that = this;
                that.thisTime = that.compareTime;
                this.$emit('commitDate', '');
            },
            timeChange(time) {
                const that = this;
                let hours = '00';
                let minute = '00';
                if (parseInt(time[0]) < 10) {
                    hours = '0' + time[0]
                } else {
                    hours = '' + time[0]
                }
                if (parseInt(time[1]) < 10) {
                    minute = '0' + time[1]
                } else {
                    minute = '' + time[1]
                }
                that.selectedTime = hours + ':' + minute;
                this.$emit('choseTime', time);
            },
            switchSelect(type) {
                const that = this;
                if (type == 'date') {
                    that.showTimeSelected = false;
                    if (that.showMonthSelect) {
                        that.showMonthSelect = false;
                        setTimeout(() => {
                            that.showCalender = true;
                        }, 230);
                    } else {
                        that.showCalender = false;
                        setTimeout(() => {
                            that.showMonthSelect = true;
                        }, 230);
                    }
                } else if (type == 'time') {
                    that.showCalender = false;
                    that.showMonthSelect = false;
                    setTimeout(() => {
                        that.showTimeSelected = true;
                    }, 230);
                }
            },
            /*无限切换日历思路
			* 1、swiper实际上只有3页
			* 2、没切换到前一页或者后一页后，这三页会重置，index也会重置
			* */
            createTime() {
                const that = this;
                let chooseDay = new Date();

                let hours = [];
                let minutes = [];
                for (let i = 0; i < 24; i++) {
                    hours.push(i.toString() + '')
                }
                for (let i = 0; i < 60; i++) {
                    minutes.push(i.toString() + '')
                }
                that.times = [hours, minutes];
                that.thisTime = [chooseDay.getHours().toString(), chooseDay.getMinutes().toString()];
                that.compareTime = new Array();
                const compareTime = that.thisTime;
                that.compareTime = [compareTime[0], compareTime[1]];
                that.selectedTime = chooseDay.getHours() + ':' + chooseDay.getMinutes();
            },
            createDate(chooseMonth) {
                const that = this;
                let chooseDay = '';
                if (chooseMonth) {
                    chooseDay = new Date(chooseMonth.year, chooseMonth.month - 1, 1);
                } else {
                    chooseDay = new Date();
                }
                let array = [];
                array.push({'daylist': that.getList(that.getPreMonth(chooseDay)), 'Date': that.getPreMonth(chooseDay)});
                array.push({'daylist': that.getList(chooseDay), 'Date': chooseDay});
                setTimeout(() => {
                    array.push({
                        'daylist': that.getList(that.getNextMonth(chooseDay)),
                        'Date': that.getNextMonth(chooseDay)
                    });
                    that.swiperList = array;
                }, 50);
                that.swiperIndex = 1;
                let mygetMonth = chooseDay.getMonth() + 1 < 10 ? '0' + (chooseDay.getMonth() + 1) : chooseDay.getMonth() + 1;
                that.dateTop = chooseDay.getFullYear() + '年' + mygetMonth + '月';

            },
            createYearData() {
                const that = this;
                const today = new Date();
                let thisMonth = today.getMonth() + 1;
                let thisYear = today.getFullYear();
                let initYear = thisYear - 20;
                let array = [];
                for (let i = 0; i < 40; i++) {
                    initYear++;
                    let monthList = [];
                    const preYear = initYear - 1;
                    const nextYear = initYear + 1;
                    monthList.push({
                        'year': preYear,
                        'month': 12,
                        'yearStr': preYear + '年12月',
                        hidden: true,
                        isThisMonth: (thisYear == initYear && thisMonth == 12 )
                    });
                    for (let i = 1; i < 13; i++) {
                        monthList.push({
                            'year': initYear,
                            'month': i,
                            'yearStr': initYear + '年' + i + '月',
                            hidden: false,
                            isThisMonth: (thisYear == initYear && thisMonth == i )
                        });
                    }
                    monthList.push({
                        'year': nextYear,
                        'month': 1,
                        'yearStr': nextYear + '年1月',
                        hidden: true,
                        isThisMonth: (thisYear == initYear && thisMonth == 1 )
                    });
                    monthList.push({
                        'year': nextYear,
                        'month': 2,
                        'yearStr': nextYear + '年2月',
                        hidden: true,
                        isThisMonth: (thisYear == initYear && thisMonth == 2 )
                    });
                    array.push({
                            'monthList': monthList,
                            'year': initYear,
                        }
                    )
                }
                that.yearList = array;
            },
            changeMonth(index) {
                const that = this;
                let today = new Date();
                if (!!that.swiperList && that.swiperList.length > 0) {
                    today = that.swiperList[index].Date;
                    let array = that.swiperList;
                    if ((index > that.lastIndex && index - that.lastIndex == 1) || (index < that.lastIndex && that.lastIndex - index == 2)) {
//                        array.shift();
                        let nextIndex = that.getNextIndex(index);
                        setTimeout(() => {
                            array.splice(nextIndex, 1, {
                                'daylist': that.getList(that.getNextMonth(today)),
                                'Date': that.getNextMonth(today)
                            });
                        }, 50);

                    } else if ((index < that.lastIndex && that.lastIndex - index == 1) || (index > that.lastIndex && index - that.lastIndex == 2)) {
//                        array.pop();
                        let preIndex = that.getPreIndex(index);
                        setTimeout(() => {
                            array.splice(preIndex, 1, {
                                'daylist': that.getList(that.getPreMonth(today)),
                                'Date': that.getPreMonth(today)
                            });
                        }, 50);
                    }
                    that.lastIndex = index;
                    that.swiperList = array;
                }
                let mygetMonth = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : today.getMonth() + 1;
                that.dateTop = today.getFullYear() + '年' + mygetMonth + '月';
            },
            getNextIndex(index) {
                let nextIndex = 0;
                switch (index) {
                    case 0:
                        nextIndex = 1;
                        break;
                    case 1:
                        nextIndex = 2;
                        break;
                    case 2:
                        nextIndex = 0;
                        break;
                }
                return nextIndex;
            },
            getPreIndex(index) {
                let preIndex = 0;
                switch (index) {
                    case 0:
                        preIndex = 2;
                        break;
                    case 1:
                        preIndex = 0;
                        break;
                    case 2:
                        preIndex = 1;
                        break;
                }
                return preIndex;
            },
            clickMonth(item, index) {
                const that = this;
                if (item.otherMonth) {
                    item.otherMonth < 0 ? this.PreMonth(item.date) : this.NextMonth(item.date);
                } else {
                    if (!(this.isHideOtherday && item.nextDayShow) && !item.dayHide) {
                        for (let i = 0; i < that.yearList[that.swiperMonthIndex].monthList.length; i++) {
                            if (i == index) {
                                that.yearList[that.swiperMonthIndex].monthList[i].isThisMonth = true;
                            } else {
                                that.yearList[that.swiperMonthIndex].monthList[i].isThisMonth = false;
                            }
                        }
                    }
                }
                that.createDate(item);
                this.$emit('changeMonth', this.dateFormat(this.myData));
                that.switchSelect('date');
            },
            commitDate() {
                const that = this;
                const compareTime = that.thisTime;
                that.compareTime = [compareTime[0], compareTime[1]];
                const date = {
                    'date': that.thisDate,
                    'time': that.selectedTime
                };
                this.$emit('commitDate', date);
            },
            clickDay(item, index) {
                const that = this;
                that.thisDate = item.date;
                if (item == 'commit') {
                    that.$emit('choseDay', item.date);
                } else {
                    if (!(that.isHideOtherday && item.nextDayShow) && !item.dayHide) {
                        that.$emit('choseDay', item);
                    }
                }
                if (item.otherMonth) {
                    item.otherMonth < 0 ? that.PreMonth(item.date) : that.NextMonth(item.date);
                } else {
                    if (!(that.isHideOtherday && item.nextDayShow) && !item.dayHide) {
                        let markFlag = false;
                        for (let i = 0; i < that.swiperList[that.swiperIndex].daylist.length; i++) {
                            if (that.onlyMarked) {
                                if (i == index && that.swiperList[that.swiperIndex].daylist[i].isMark) {
                                    markFlag = true;
                                    that.swiperList[that.swiperIndex].daylist[i].isToday = true;
                                } else {
                                    that.swiperList[that.swiperIndex].daylist[i].isToday = false;
                                }
                            } else {
                                if (i == index) {
                                    that.swiperList[that.swiperIndex].daylist[i].isToday = true;
                                } else {
                                    that.swiperList[that.swiperIndex].daylist[i].isToday = false;
                                }
                            }
                        }
                        if (!markFlag && that.onlyMarked) {
                            that.swiperList[that.swiperIndex].daylist = that.getList(that.myData)
                        }
                    }

                }
            },
            ChoseMonth(date, isChosedDay = true) {
                const that = this;
                date = that.dateFormat(date);
                if (!!date) {
                    that.myData = new Date(date);
                } else {
                    that.myData = new Date();
                }
                that.$emit('changeMonth', that.dateFormat(that.myData));
                that.getList(this.myData, date, isChosedDay);
            },
            PreMonth(date, isChosedDay = true) {
                date = this.dateFormat(date);
                this.myData = this.getPreMonth(this.myData);
                this.$emit('changeMonth', this.dateFormat(this.myData));
                this.getList(this.myData, date, isChosedDay);
            },
            NextMonth(date, isChosedDay = true) {
                date = this.dateFormat(date);
                this.myData = this.getNextMonth(this.myData);
                this.$emit('changeMonth', this.dateFormat(this.myData));
                this.getList(this.myData, date, isChosedDay);
            },
            getPreMonth(date) {
                let timeArray = this.dateFormat(date).split('/');
                let year = timeArray[0];
                let month = timeArray[1];
                let day = timeArray[2];
                let days = new Date(year, month, 0);
                days = days.getDate();
                let year2 = year;
                let month2 = parseInt(month) - 1;
                if (month2 == 0) {
                    year2 = parseInt(year2) - 1;
                    month2 = 12;
                }
                let day2 = day;
                let days2 = new Date(year2, month2, 0);
                days2 = days2.getDate();
                if (day2 > days2) {
                    day2 = days2;
                }
                if (month2 < 10) {
                    month2 = '0' + month2;
                }
                let t2 = year2 + '/' + month2 + '/' + day2;
                return new Date(t2);
            },
            getNextMonth(date) {
                let arr = this.dateFormat(date).split('/');
                let year = arr[0]; //获取当前日期的年份
                let month = arr[1]; //获取当前日期的月份
                let day = arr[2]; //获取当前日期的日
                let days = new Date(year, month, 0);
                days = days.getDate(); //获取当前日期中的月的天数
                let year2 = year;
                let month2 = parseInt(month) + 1;
                if (month2 == 13) {
                    year2 = parseInt(year2) + 1;
                    month2 = 1;
                }
                let day2 = day;
                let days2 = new Date(year2, month2, 0);
                days2 = days2.getDate();
                if (day2 > days2) {
                    day2 = days2;
                }
                if (month2 < 10) {
                    month2 = '0' + month2;
                }
                let t2 = year2 + '/' + month2 + '/' + day2;
                return new Date(t2);
            },
            getDaysInOneMonth(date) {//天数
                let getyear = date.getFullYear();
                let getmonth = date.getMonth() + 1;
                getmonth = parseInt(getmonth, 10);
                let d = new Date(getyear, getmonth, 0);
                return d.getDate();
            },
            getMonthweek(date) {
                let getyear = date.getFullYear();
                let getmonth = date.getMonth() + 1;
                let dateOne = new Date(getyear + '/' + getmonth + '/1');
                return dateOne.getDay() == 0 ? 0 : dateOne.getDay();
            },
            getList(date, chooseDay, isChosedDay = true) {
                if (!date) {
                    date = new Date();
                }
                let array = [];
                for (let i = 0; i < this.getDaysInOneMonth(date); i++) {
                    let nowTime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (i + 1);
                    if (
                        this.dateFormat(new Date()) ==
                        this.dateFormat(new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (i + 1))) && !chooseDay
                    ) {
                        array = array.concat({
                            id: i + 1,
                            date: nowTime,
                            isTodayNow: true,
                            isToday: true,
                            isMark: this.markArray.indexOf(i + 1) >= 0 || this.markDate.indexOf(nowTime) >= 0,
                            isDisable: this.disMarkArray.indexOf(nowTime) >= 0,
                            dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
                            nextDayShow:
                            new Date(nowTime).getTime() >
                            new Date().getTime()
                        });
                        this.$emit(
                            'isToday',
                            this.dateFormat(new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (i + 1)))
                        );
                    } else {
                        array = array.concat({
                            id: i + 1,
                            date: nowTime,
                            isTodayNow: false,
                            isToday: chooseDay == nowTime && isChosedDay,
                            isMark: this.markArray.indexOf(i + 1) >= 0 || this.markDate.indexOf(nowTime) >= 0,
                            isDisable: this.disMarkArray.indexOf(nowTime) >= 0,
                            dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
                            nextDayShow:
                            new Date(nowTime).getTime() >
                            new Date().getTime()
                        });
                    }
                }
                let array2 = [];
                let num = this.getDaysInOneMonth(this.getPreMonth(date)) - this.getMonthweek(date) + 1;
                let preDate = this.getPreMonth(date);
                let nextDate = this.getNextMonth(date);
                //上个月多少开始
                for (let i = 0; i < this.getMonthweek(date); i++) {
                    let nowTime = preDate.getFullYear() + '/' + (preDate.getMonth() + 1) + '/' + (num + i);
                    array2 = array2.concat(
                        {
                            id: num + i,
                            date: nowTime,
                            dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
                            nextDayShow:
                            new Date(nowTime).getTime() >
                            new Date().getTime(),
                            otherMonth: -1
                        });
                }
                array = array2.concat(array);
                //下个月的
                let _length = 7 - array.length % 7;
                if (_length < 7) {
                    for (let i = 0; i < _length; i++) {
                        let nowTime = nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + (i + 1);
                        array.push({
                            id: i + 1,
                            date: nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + (i + 1),
                            dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
                            nextDayShow:
                            new Date(nowTime).getTime() >
                            new Date().getTime(),
                            otherMonth: 1
                        });
                    }
                }
//                this.list = array;
                return array;

            },
            dateFormat(date) {
                date = new Date(date);
                return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
            },
            setDisplayMode() {
                const that = this;
                const mode = that.displayMode;
                switch (mode) {
                    case 1:
                        that.onlyDate = false;
                        that.onlyTime = false;
                        break;
                    case 2:
                        that.switchSelect('time');
                        that.onlyDate = false;
                        that.onlyTime = true;
                        break;
                    case 3:
                        that.onlyDate = true;
                        that.onlyTime = false;
                }
            }
        },
        mounted() {
            this.getList(this.myData);
            this.createYearData();
            this.createDate();
            this.createTime();
            this.setDisplayMode();
        },
        watch: {
            markArray(val, oldVal) {
                const that = this;
                let list = that.swiperList[that.swiperIndex].daylist;
                for (let i = 0; i < list.length; i++) {
                    list[i].isMark = false;
                    if (list[i].date) {
                        for (let n = 0; n < val.length; n++) {
                            if (list[i].id == val[n]) {
                                list[i].isMark = true;
                            }
                        }
                    }
                }
                this.list = list;
            },
            disMarkArray(val, oldVal) {
                let list = this.list;
                for (let i = 0; i < list.length; i++) {
                    list[i].isMark = false;
                    if (list[i].date) {
                        for (let n = 0; n < val.length; n++) {
                            if (list[i].id == val[n]) {
                                list[i].isDisable = true;
                            }
                        }
                    }
                }
                this.list = list;
            },
            markDate(val, oldVal) {
                let list = this.list;
                for (let i = 0; i < list.length; i++) {
                    list[i].isMark = false;
                    if (list[i].date) {
                        for (let n = 0; n < val.length; n++) {
                            if (list[i].date == val[n]) {
                                list[i].isMark = true;
                            }
                        }
                    }
                }
                this.list = list;
            }
        }
    };
</script>

