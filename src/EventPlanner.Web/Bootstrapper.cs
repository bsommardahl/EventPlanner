using Nancy.Bootstrappers.Autofac;
using Nancy.Conventions;

namespace EventPlanner.Web
{
    public class Bootstrapper : AutofacNancyBootstrapper
    {
        protected override void ConfigureConventions(NancyConventions conventions)
        {
            conventions.StaticContentsConventions.Add(
                StaticContentConventionBuilder.AddDirectory("app"));

            base.ConfigureConventions(conventions);
        }
    }
}