using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;
using Newtonsoft.Json;

namespace Cuba.Controllers
{
    public class Post
    {
        public String web_url { get; set; }
        public String snippet { get; set; }
        public String main { get; set; }
        public String wordCount { get; set; }
        public String source { get; set; }
        public String date { get; set; }

    }

    

    public class APIController : ApiController
    {

        [HttpGet]
        public async void index()
        {


        
            
            int page = 0;

          

            String url = "http://api.nytimes.com/svc/search/v2/articlesearch.json?callback=svc_search_v2_articlesearch&q=cuba+thaw&begin_date=20141217&end_date=20150425&sort=oldest&fl=_id%2Cword_count%2Cpub_date%2Cheadline%2Cmultimedia%2Csource%2Clead_paragraph%2Csnippet%2Cweb_url&page=0&api-key=91cd0f1d5b7d95ae8c92eccb516df20b:15:71932119";
            HttpClient client = new HttpClient();
            HttpResponseMessage response = await client.GetAsync(url);


            if (response.IsSuccessStatusCode)
            {
                string jsonData = await response.Content.ReadAsStringAsync();
                var result = JsonConvert.DeserializeObject<dynamic>(jsonData);

                var nodes = result.response.docs;
                int len = result.response.docs.Count;

                List<Post> posts = new List<Post>();
                foreach (var node in nodes)
                {
                    Post post = new Post();
                    post.main = node.headline.main;
                    post.web_url = node.web_url;
                    post.snippet = node.snippet;
                    post.wordCount = node.word_count;
                    post.source = node.source;
                    post.date = node.pub_date;
                        
                        //DateTime.ParseExact(node.pub_date,
                        //          "ddd MMM d yyyy HH:mm:ss GMTzzzzz",
                        //          CultureInfo.InvariantCulture);
                    posts.Add(post);
                   

                }

                string output = new JavaScriptSerializer().Serialize(posts);

                string result1 = JsonConvert.SerializeObject(posts, Formatting.None);
                string path = AppDomain.CurrentDomain.BaseDirectory;
                path = path + "data\\txt.json";

                System.IO.File.WriteAllText(path, output);

            }
        }
    }
}
