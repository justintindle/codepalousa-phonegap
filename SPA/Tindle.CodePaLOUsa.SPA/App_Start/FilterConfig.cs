using System.Web;
using System.Web.Mvc;

namespace Tindle.CodePaLOUsa.SPA
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}