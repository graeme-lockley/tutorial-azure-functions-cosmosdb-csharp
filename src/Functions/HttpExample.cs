using Microsoft.Azure.Cosmos;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Threading.Tasks;

using CoreLibrary;

namespace My.Functions
{
    public class State
    {
        private static State _instance;

        private Connection connection;

        private State(ILogger log)
        {
            var endpointUrl = Environment.GetEnvironmentVariable("COSMOSDB_ENDPOINT_URL") ?? "https://tafccdb.documents.azure.com:443/";
            var primaryKey = Environment.GetEnvironmentVariable("COSMOSDB_PRIMARY_KEY") ?? "";

            if (primaryKey.Equals(""))
            {
                log.LogInformation("primaryKey not set");
            }
            else
            {
                log.LogInformation("primaryKey is set");
            }

            connection = new Connection(endpointUrl, primaryKey, log);
        }

        public static State instance(ILogger log)
        {
            if (_instance == null)
            {
                _instance = new State(log);
            }

            return _instance;
        }

        public Connection Connection() =>
            connection;

        public Task<Container> Container()
        {
            return connection.Container();
        }
    }

    public static class HttpExample
    {
        [FunctionName("HttpExample")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);
            name = name ?? data?.name;

            string responseMessage = string.IsNullOrEmpty(name)
                ? "This HTTP triggered function executed successfully. Pass a name in the query string or in the request body for a personalized response."
                : $"Hello, {name}. This HTTP triggered function executed successfully.";

            return new OkObjectResult(responseMessage);
        }

        [FunctionName("family")]
        public static async Task<IActionResult> Family(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            log.LogInformation($"name is '{name}'");

            var tasks = new Tasks(State.instance(log).Connection());
            var results = await tasks.QueryItemsAsyncOnLastName(name);

            log.LogInformation(results.ToString());

            return new OkObjectResult(JsonConvert.SerializeObject(results));
        }
    }
}
