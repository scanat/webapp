const awsmobile = {
    "aws_project_region": "ap-south-1",
    "aws_cognito_identity_pool_id": process.env.GATSBY_SUBSCRIBER_AUTH_POOL_ID,
    "aws_cognito_region": "ap-south-1",
    "aws_user_pools_id": "ap-south-1_WaND65Fv6",
    "aws_user_pools_web_client_id": process.env.GATSBY_SUBSCRIBER_AUTH_WEBCLIENT_ID,
    "oauth": {},
    "aws_appsync_graphqlEndpoint": process.env.GATSBY_SUBSCRIBER_GL_ENDPOINT,
    "aws_appsync_region": "ap-south-1",
    "aws_appsync_authenticationType": "API_KEY",
    "aws_appsync_apiKey": process.env.GATSBY_SUBSCRIBER_GL_API_KEY,
    "aws_user_files_s3_bucket": process.env.GATSBY_S3_BUCKET,
    "aws_user_files_s3_bucket_region": "ap-south-1"
};


export default awsmobile;