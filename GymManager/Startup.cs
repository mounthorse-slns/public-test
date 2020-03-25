using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Globalization;

namespace GymManager
{
    public class Startup
    {
        public Startup(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            Environment = environment;
        }

        private IHostingEnvironment Environment { get; set; }
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMvc(options =>
            {
                //options.ModelBinderProviders.Insert(0, new DecimalModelBinderProvider());
                //options.ModelBinderProviders.Insert(1, new DoubleModelBinderProvider());
                //options.ModelBinderProviders.Insert(0, new DateTimeModelBinderProvider());
                //options.ModelBinderProviders.Insert(1, new NullableDateTimeModelBinderProvider());

                // See https://docs.asp.net/en/latest/mvc/controllers/filters.html
                //options.Filters.Add(typeof(CultureActionFilter)); // by type
            })
            .AddJsonOptions(options =>
            {
                //options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
                options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
                options.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;
                options.SerializerSettings.DateParseHandling = DateParseHandling.None;
            });

            services.AddMemoryCache();
            services.AddSession();

            #region Application Services

            // Add application services.
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            #endregion

            #region Localization

            // Configure supported cultures and localization options
            services.Configure<RequestLocalizationOptions>(options =>
            {
                var supportedCultures = new[]
                {
                    new CultureInfo("it-IT")
                    //new CultureInfo("en-US"),
                    //new CultureInfo("en-GB")
                };
                // State what the default culture for your application is. This will be used if no specific culture
                // can be determined for a given request.
                options.DefaultRequestCulture = new RequestCulture(culture: "it-IT", uiCulture: "it-IT");

                // You must explicitly state which cultures your application supports.
                // These are the cultures the app supports for formatting numbers, dates, etc.
                options.SupportedCultures = supportedCultures;

                // These are the cultures the app supports for UI strings, i.e. we have localized resources for.
                options.SupportedUICultures = supportedCultures;

                // You can change which providers are configured to determine the culture for requests, or even add a custom
                // provider with your own logic. The providers will be asked in order to provide a culture for each request,
                // and the first to provide a non-null result that is in the configured supported cultures list will be used.
                // By default, the following built-in providers are configured:
                // - QueryStringRequestCultureProvider, sets culture via "culture" and "ui-culture" query string values, useful for testing
                // - CookieRequestCultureProvider, sets culture via "ASPNET_CULTURE" cookie
                // - AcceptLanguageHeaderRequestCultureProvider, sets culture via the "Accept-Language" request header
                //options.RequestCultureProviders.Insert(0, new CustomRequestCultureProvider(async context =>
                //{
                //  // My custom request culture logic
                //  return new ProviderCultureResult("en");
                //}));

                //options.RequestCultureProviders.Insert(0, new RouteRequestCultureProvider
                //{
                //    Options = options,
                //    TwoLetterISOLanguageName = false
                //});
            });

            #endregion
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            // Serilog https://github.com/serilog/serilog-extensions-logging-file 
            loggerFactory
                .AddFile("Logs/Errors/{Date}.txt", Microsoft.Extensions.Logging.LogLevel.Error, levelOverrides: null, isJson: true, fileSizeLimitBytes: 10485760, retainedFileCountLimit: 3)
                .AddFile("Logs/Warnings/{Date}.txt", Microsoft.Extensions.Logging.LogLevel.Warning, levelOverrides: null, isJson: true, fileSizeLimitBytes: 10485760, retainedFileCountLimit: 3)
                .AddDebug();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions {
                    HotModuleReplacement = true,
                    //ConfigFile = "webpack.config.ts"
                });
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            app.UseStaticFiles(); // For the wwwroot folder

            var provider = new FileExtensionContentTypeProvider();
            provider.Mappings[".webmanifest"] = "application/manifest+json";
            app.UseStaticFiles(new StaticFileOptions()
            {
                ContentTypeProvider = provider
            });

            app.UseSession();

            app.UseAuthentication();

            #region Configure Localization

            // Configure Localization
            var locOptions = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(locOptions.Value);

            #endregion

            #region Configure Routes

            // Configure routes
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });

            #endregion
        }
    }
}
