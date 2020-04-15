<template>
    <div id="app">
        <van-cell-group>
            <van-field  label="选择日期" clearable v-model="date" placeholder="请选择日期" readonly @click="datePicker = true"></van-field>
        </van-cell-group>
        <van-popup v-model="datePicker" position="bottom">
            <van-picker :columns="columns" show-toolbar @confirm="confirm" @cancel="datePicker = false" @change="onChange"></van-picker>
        </van-popup>
    </div>
</template>
<script>
    const moment = require('moment');
    const year = moment().get('year');
    const month = moment().get('month');
    const date = moment().get('date');
    const hour = moment().get('hour');
    export default {
        name: 'App',
        data() {
            return {
                datePicker:false,
                date:'',
                columns: [
                    {
                        values: Array.from({length: 10}, (v, k) => year + k + '年'),
                    },
                    {
                        values: Array.from({length: 12}, (v, k) => {
                            return {
                                text: k + 1 + '月',
                                disabled: month > k
                            }
                        }),
                        defaultIndex: month
                    },
                    {
                        values: Array.from({length: this.$moment(year + '/' + month, 'YYYY-MM').daysInMonth()}, (v, k) => {
                            return {
                                text: k + `日(${this.$moment(year + '/' + (month + 1) + '/' + (k + 1)).format('dd')})`,
                                disabled: date > k + 1
                            }
                        }),
                        defaultIndex: date - 1
                    },
                    {
                        values: Array.from({length: 10}, (v, k) => {
                            if (k + 9 >= 9 && k + 9 <= 19) {
                                return {
                                    text: k + 9 + ':00',
                                    disabled: hour > k + 8
                                }
                            }
                        }),
                        defaultIndex: hour - 8
                    }
                ]
            }
        },
        created() {

        },
        beforeCreate() {
            this.$moment.locale('zh', {
                weekdaysMin: '周日~周一~周二~周三~周四~周五~周六'.split('~')
            })
        },
        methods: {
            onChange(picker, values, index) {
                if (index === 0 || index === 1 || index === 2) {
                    if (index === 0) {
                        picker.setColumnValues(1,
                            Array.from({length: 12}, (v, k) => {
                                return {
                                    text: k + 1 + '月',
                                    disabled: parseInt(values[0]) !== year ? false : month > k
                                }
                            }),
                        )
                    }
                    if (index === 1 || index === 0) {
                        picker.setColumnValues(2,
                            Array.from({length: this.$moment(parseInt(values[0]) + '/' + parseInt(picker.getColumnValue(1).text), 'YYYY-MM').daysInMonth()}, (v, k) => {
                                return {
                                    text: (k + 1) + `日(${this.$moment(parseInt(values[0]) + '/' + (parseInt(picker.getColumnValue(1).text)) + '/' + (k + 1)).format('dd')})`,
                                    disabled: parseInt(values[0]) === year && (parseInt(picker.getColumnValue(1).text)) === month + 1 ? (date > k + 1) : false
                                }
                            }),
                        )
                    }
                    picker.setColumnValues(3,
                        Array.from({length: 10}, (v, k) => {
                            if (k + 9 >= 9 && k + 9 <= 19) {
                                return {
                                    text: k + 9 + ':00',
                                    disabled: parseInt(values[0]) === year && (parseInt(picker.getColumnValue(1).text)) === (month + 1) && (parseInt(picker.getColumnValue(2).text)) === date ? (hour > k + 8) : false
                                }
                            }
                        }),
                    )
                }
                // if (index == 1) {
                //   picker.setColumnValues(2,
                //     Array.from({ length: this.$moment(parseInt(values[0]) + '/' + parseInt(values[1].text)).daysInMonth() }, (v, k) => {
                //       return {
                //         text: (k + 1) + `日(${this.$moment(parseInt(values[0]) + '/' + (parseInt(values[1].text)) + '/' + k).format('dd')})`,
                //         disabled: parseInt(values[0]) == year && (parseInt(values[1].text)) == month + 1 ? date > k + 1 : false

                //       }
                //     }),
                //   )
                //   picker.setColumnValues(3,
                //     Array.from({ length: 10 }, (v, k) => {
                //       if (k + 9 >= 9 && k + 9 <= 19) {
                //         return {
                //           text: k + 9 + ':00',
                //           disabled: hour > k + 8
                //         }
                //       }
                //     }),
                //   )
                // }
            },
            confirm(e){
                if (e[2].text.includes('周日') || e[2].text.includes('周六')) {
                    this.$notify({ type: 'danger', message: '周末暂不支持转诊！' });
                    return;
                }
                this.date = parseInt(e[0]) + '-' + parseFloat(e[1].text) + '-' + parseFloat(e[2].text) + '  ' + e[3].text
                this.datePicker = false
            }
        }

    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
