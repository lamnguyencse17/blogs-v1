using System;
using Microsoft.AspNetCore.Mvc;
using backend.Services;
using backend.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {
        private readonly BlogService _blogService;
        private readonly MongoDBService _mongoDBService;
        public BlogController(MongoDBService mongoDBService)
        {
            _mongoDBService = mongoDBService;
            _blogService = new BlogService(mongoDBService.Database);
        }

        // GET: api/<BlogController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<BlogController>/5
        [HttpGet("{blogId}")]
        public async Task<BlogDocument?> Get(string blogId)
        {
            BlogDocument blog = new(blogId);
            
            return await blog.GetBlogAsync(_blogService);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] BlogDocument blog)
        {
            await blog.CreateBlogAsync(_blogService, blog);
            return CreatedAtAction(nameof(Get), new { id = blog.Id }, blog);
        }

        // PUT api/<BlogController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<BlogController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
