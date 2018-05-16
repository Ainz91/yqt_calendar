### 安装
cnpm i yqt-calendar -D
### 引用方法
#### 在入口文件引用
* import Calendar from 'yqt-calendar'
* Vue.use(Calendar)
#### 在vue中引用
<script>
import 'yqt-calendar/dist/style.css'
</script>
#### 使用实例
<calendar ref="Calendar" @choseDay=""  :markDate="" /calendar>
### Props

|    name    |    Description   |   type   |default|
| -----------------  | ---------------- | :--------: | :----------: |
| onlyMarked       | 只能点击mark的时间 |Boolean| false
| displayMode        | 显示的类型 |Number | 1、都显示，2、只能选择时间，3、只能选择日期
| markArray        | 被标记日期列表 |Array | null
| disMarkArray        | 被alert的日期列表 |Array | null
| agoDayHide        | 某个日期以前的不允许点击 时间戳长度是 10 位，0代表禁用 |Number |0
| futureDayHide        | 某个日期以后的不允许点击 时间戳长度是 10 位，0代表禁用 |Number |0
| isHideOtherday        | 超过今天的日期是否可以被点击 时间戳长度是 10 位，0代表禁用 |Boolean |false

### Events

| name | item   |Description
| :--------:   | -----  |:----------: |
|   @commitDate   |  date| 点击‘确认’或‘取消’的回调，取消回调为空，确认包含‘date’和‘time’两个字段
|   @choseTime   |  time| 选择时间后的回调
|   @changeMonth   |  time| 选择年月后的回调
|   @changeMonth   |  time| 选择日期后的回调
|   @isToday   |  time| 返回当前日期
