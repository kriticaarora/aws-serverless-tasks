package com.task02;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.syndicate.deployment.annotations.lambda.LambdaHandler;
import com.syndicate.deployment.model.RetentionSetting;

import java.util.HashMap;
import java.util.Map;

@LambdaHandler(
    lambdaName = "hello_world",
	roleName = "hello_world-role",
	isPublishVersion = true,
	aliasName = "${lambdas_alias_name}",
	logsExpiration = RetentionSetting.SYNDICATE_ALIASES_SPECIFIED
)

@LambdaUrlConfig(authType = AuthType.NONE)  // Use appropriate AuthType as per your requirement
public class HelloWorld implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {

    @Override
    public APIGatewayProxyResponseEvent handleRequest(APIGatewayProxyRequestEvent request, Context context) {
        APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent();
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        response.setHeaders(headers);

        String path = request.getPath();
        String method = request.getHttpMethod();

        if ("/hello".equals(path) && "GET".equalsIgnoreCase(method)) {
            response.setStatusCode(200);
            response.setBody("{\"message\": \"Hello from Lambda\"}");
        } else {
            response.setStatusCode(400);
            response.setBody("{\"error\": \"Bad Request: The endpoint '" + path + "' and method '" + method + "' are not supported.\"}");
        }
        
        return response;
    }
}

