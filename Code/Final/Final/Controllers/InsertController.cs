using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Web;
using System.Web.Mvc;
using Final.Models;
using Newtonsoft.Json;

namespace Final.Controllers
{
    public class InsertController : Controller
    {
        private NYTEntities db = new NYTEntities();
        //
        // GET: /Insert/
        public void Index()
        {

            string end = DateTime.Now.ToString("yyyyMMdd");

            DbSet<Article> articles = db.Articles;

            foreach (Article art in articles)
            {
                db.Articles.Remove(art);
            }
            db.SaveChanges();

            int page = 0;
            String url;
            HttpClient client;
            HttpResponseMessage response;
            Article article;
            while (true)
            {
                url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?callback=svc_search_v2_articlesearch&q=cuba+thaw&begin_date=20141217&end_date=" + end + "&sort=oldest&fl=_id%2Cword_count%2Cpub_date%2Cheadline%2Cmultimedia%2Csource%2Clead_paragraph%2Csnippet%2Cweb_url&page=" + page + "&api-key=91cd0f1d5b7d95ae8c92eccb516df20b:15:71932119";
                client = new HttpClient();
                client.BaseAddress = new Uri(url);
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                response = client.GetAsync(url).Result;

                if (response.IsSuccessStatusCode)
                {
                    var jsonData = response.Content.ReadAsStringAsync().Result;
                    var result = JsonConvert.DeserializeObject<dynamic>(jsonData);
                    var nodes = result.response.docs;

                    if (nodes.Count == 0)
                        break;


                    foreach (var node in nodes)
                    {
                        article = new Article();
                        article.id = node._id;
                        article.pub_date = node.pub_date;
                        article.word_count = Convert.ToInt32(node.word_count);
                        article.headline = node.headline.main;
                        article.source = node.source;
                        if (node.multimedia.Count > 0)
                            article.thumbnail = node.multimedia[0].url;
                        article.web_url = node.web_url;

                        db.Articles.Add(article);

                    }
                    db.SaveChanges();
                }
                page++;
                Thread.Sleep(1500);
            }
        }
    }
}