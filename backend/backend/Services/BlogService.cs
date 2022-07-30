using MongoDB.Driver;
using backend.Models;

namespace backend.Services
{
    public class BlogService
    {
        private readonly IMongoCollection<BlogDocument> _blogCollection;
        public BlogService(IMongoDatabase mongoDatabase)
        {
            _blogCollection = mongoDatabase.GetCollection<BlogDocument>("blogs");
        }

        public async Task CreateAsyncBlog(BlogDocument blogDocument)
        {
            await _blogCollection.InsertOneAsync(blogDocument);
            return;
        }
    }
}
