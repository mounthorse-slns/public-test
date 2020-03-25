using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;

namespace GymManager
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = BuildWebHost(args);

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
            }

            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseUrls("http://localhost:5000", "http://*:80")
                .UseStartup<Startup>()
                //.ConfigureAppConfiguration((hostContext, config) =>
                //{
                //    // delete all default configuration providers
                //    config.Sources.Clear();
                //    config.AddJsonFile("my-appsetting.json", optional: true);
                //})
                .Build();
    }
}
