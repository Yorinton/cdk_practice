import * as cdk from '@aws-cdk/core';
// 作成するリソースに紐づくライブラリをimport
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';
import * as iam from '@aws-cdk/aws-iam';
import * as apiGateway from '@aws-cdk/aws-apigateway';

export class CdkPracticeStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    cdk.Tags.of(scope).add('use-case', 'workshop');
    const dynamoTableName: string = 'cdk-test-table';

    const cdkTestFunciton: lambda.Function = new lambda.Function(this, 'cdk-test-function', {
      // 必須の項目
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'index.handler', // index.*のhandlerという関数を使用
      code: lambda.Code.fromAsset('lambda'), // 関数はlambdaディレクトリ内にある
      // オプション項目
      functionName: 'cdk-test-function',
      environment: {
        'TABLE_NAME': dynamoTableName
      }
    });

    const cdkTestApi = new apiGateway.RestApi(this, 'cdk-test-api', {
      restApiName: 'cdk-test-api',
      deployOptions: {
        stageName: 'v1'
      }
    });

    const cdkTestDynamoDb: dynamodb.Table = new dynamodb.Table(this, 'cdk-test-dynamo', {
      // 必須の項目
      partitionKey: { name: 'user_id', type: dynamodb.AttributeType.NUMBER },
      // オプション項目
      sortKey: { name: 'created_at', type: dynamodb.AttributeType.STRING },
      tableName: dynamoTableName
    });

    // lambda -> dynamodbのアクセスポリシーをアタッチ
    cdkTestFunciton.addToRolePolicy(new iam.PolicyStatement({
      // Effectはcdk上でデフォルトがAllowになっているので指定しなくてもOk
      // 操作対象のリソースをarnで指定
      resources: [cdkTestDynamoDb.tableArn],
      // 許可する、操作対象に対してのアクションを指定
      actions: [
        'dynamodb:PutItem'
      ]
    }));

    // API Gateway - Lambdaの接続設定
    const integration = new apiGateway.LambdaIntegration(cdkTestFunciton);
    cdkTestApi.root.addMethod('POST', integration);
  }
}
