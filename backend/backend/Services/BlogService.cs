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

        public async Task<BlogDocument?> GetAsyncSingleBlog(string id)
        {
            FilterDefinition<BlogDocument> filter = Builders<BlogDocument>.Filter.Eq("Id", id);
            IAsyncCursor<BlogDocument> cursor = await _blogCollection.FindAsync(filter);
            List<BlogDocument> list = await cursor.ToListAsync();
            return list.FirstOrDefault();
        }
    }
}
