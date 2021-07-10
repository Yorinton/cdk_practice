const AWS = require('aws-sdk');
const client = new AWS.DynamoDB.DocumentClient()
const tableName =  process.env.TABLE_NAME
const get_time = () => {
    let dt = new Date()
    dt.setTime(dt.getTime() + 32400000)

    let year  = dt.getFullYear()
    let month = dt.getMonth()+1
    let day   = dt.getDate()
    let hour  = dt.getHours()
    let min   = dt.getMinutes()
    let sec = dt.getSeconds()

    if (month < 10) {
        month = Number('0' + month)
    }

    if (day   < 10) {
        day   = Number('0' + day)
    }

    if (hour   < 10) {
        hour  = Number('0' + hour)
    }

    if (min   < 10) {
        min   = Number('0' + min)
    }
    if (sec   < 10) {
        sec   = Number('0' + sec)
    }

    let Date_now = year + '/' + month + '/' + day + '-' + hour + ':' + min + ':' + sec
    return Date_now
}

interface Item {
    user_id: number,
    amount: number
}

interface Event {
    [key: string]: any,
    body: Item
}

export const handler = async (event: Event) => {
    let items: Item;
    if (typeof(event.body) === 'string') {
        items = JSON.parse(event.body)
    } else {
        items = event.body
    }
    const params = {
        TableName: tableName ?? '',
        Item: {
            user_id: items.user_id,
            created_at: get_time(),
            amount: items.amount
        }
    }
    await client.put(params).promise()

    return {
        statusCode: 200,
        body: 'Put Success: ' + JSON.stringify(items)
    }
}
