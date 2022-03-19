using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Threading.Tasks;

using CoreLibrary.Ports.In;
using PortCosmosRepository;

namespace Functions
{
    public class State
    {
        private static State _instance;

        private Facade facade;

        private State()
        {
            facade = new Facade(new Repository());
        }

        public static State instance()
        {
            if (_instance == null)
            {
                _instance = new State();
            }

            return _instance;
        }

        public static Facade Facade() =>
            instance().facade;
    }

    public static class Http
    {
        [FunctionName("friends")]
        public static async Task<IActionResult> Family(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string name = req.Query["name"];

            log.LogInformation($"name is '{name}'");

            var results = await State.Facade().FindOnLastName(name);

            log.LogInformation(results.ToString());

            return new OkObjectResult(JsonConvert.SerializeObject(results));
        }
    }
}
