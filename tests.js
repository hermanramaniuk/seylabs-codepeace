import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
import * as uuid from "uuid";

export const create = handler(async (event, context) => {
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.tableTests,
        Item: {
          id: uuid.v1(),
          Test_Type: data.type,
          Test_Name: data.name,
          Sample_Type: data.sample_type,
          Result_Type: data.result_type,
          Duration: data.duration,
          createdAt: Date.now()
        }
    };

    try {
        await dynamoDb.put(params);

        return {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: e.message }),
        };
    }
});

export const list = handler(async (event, context) => {
    const params = {
        TableName: process.env.tableTests
    };
    const data = await dynamoDb.scan(params);
    if (!data.Items) {
        throw new Error("Item not found.");
    }

    let res =  {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*' // replace with hostname of frontend (CloudFront)
        },
        body: JSON.stringify(data)
    };
    return res;
});