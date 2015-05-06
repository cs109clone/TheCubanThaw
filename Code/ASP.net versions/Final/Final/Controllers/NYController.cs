using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using Final.Models;

namespace Final.Controllers
{
    public class NYController : ApiController
    {
        private NYTEntities db = new NYTEntities();

        // GET api/NY
        public IQueryable<Article> GetArticles()
        {
            return db.Articles;
        }

       

       

       
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ArticleExists(string id)
        {
            return db.Articles.Count(e => e.id == id) > 0;
        }
    }
}