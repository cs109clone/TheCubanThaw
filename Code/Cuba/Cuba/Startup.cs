using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Cuba.Startup))]
namespace Cuba
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
