using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Web;
using System.Web.Mvc;
using Cuba.Models;
using Newtonsoft.Json;

namespace Cuba.Controllers
{
    public class HomeController : Controller
    {
        private NYTEntities db = new NYTEntities();
        //
        // GET: /Home/
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Congress()
        {
            return View();
        }

        public ActionResult Presidents()
        {
            return View();
        }

        public ActionResult Design()
        {
            return View();
        }

        public ActionResult NYT()
        {
            return View();
        }
	}
}