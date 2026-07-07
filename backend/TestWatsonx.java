import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;

public class TestWatsonx {
    public static void main(String[] args) throws Exception {
        String apiKey = "WWXo6UVUMHPFCdrO2ujOPNic6m2phD8xx3IIaMOwF1gA";
        String projectId = "55a238ad-b142-4fba-a39c-399428121690";
        
        // 1. Get IAM Token
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest iamRequest = HttpRequest.newBuilder()
            .uri(URI.create("https://iam.cloud.ibm.com/identity/token"))
            .header("Content-Type", "application/x-www-form-urlencoded")
            .header("Accept", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString("grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=" + apiKey))
            .build();
            
        HttpResponse<String> iamResponse = client.send(iamRequest, HttpResponse.BodyHandlers.ofString());
        String iamBody = iamResponse.body();
        String token = iamBody.split("\"access_token\":\"")[1].split("\"")[0];
        
        List<String> models = List.of(
            "google/flan-ul2",
            "google/flan-t5-xxl",
            "meta-llama/llama-2-70b-chat",
            "meta-llama/llama-3-70b-instruct",
            "ibm/granite-13b-chat-v2",
            "ibm/granite-3-8b-instruct"
        );
        
        for (String model : models) {
            String payload = "{" +
                "\"model_id\": \"" + model + "\"," +
                "\"project_id\": \"" + projectId + "\"," +
                "\"input\": \"Hello\"" +
                "}";
                
            HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create("https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29"))
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .header("Authorization", "Bearer " + token)
                .POST(HttpRequest.BodyPublishers.ofString(payload))
                .build();
                
            HttpResponse<String> res = client.send(req, HttpResponse.BodyHandlers.ofString());
            if (res.statusCode() == 200) {
                System.out.println("SUCCESS: " + model);
                System.out.println(res.body());
                return;
            } else {
                System.out.println("FAILED: " + model + " - " + res.statusCode());
            }
        }
    }
}
