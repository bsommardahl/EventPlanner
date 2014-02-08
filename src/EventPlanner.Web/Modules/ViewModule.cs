using Nancy;

namespace EventPlanner.Web.Modules
{
    public class ViewModule : NancyModule
    {
        public ViewModule()
        {
            Get["/"] = _ => View["index.html"];
        }
    }
}