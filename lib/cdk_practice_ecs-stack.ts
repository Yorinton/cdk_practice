import * as cdk from '@aws-cdk/core';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsp from '@aws-cdk/aws-ecs-patterns';

export class CdkPracticeEcsStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        new ecsp.ApplicationLoadBalancedFargateService(this, 'cdk-test-fargate', {
            taskImageOptions: {
                // Docker hubからコンテナを取得 (ECRから取得も可能？)
                image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
            },
            // ALBはpublicアドレスを持つためインターネットからアクセス可能
            publicLoadBalancer: true
        });
    }
}