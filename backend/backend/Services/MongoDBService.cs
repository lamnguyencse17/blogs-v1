using backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class MongoDBService
    {
        private readonly IMongoCollection<BlogDocument> _blogCollection;

        public MongoDBService(IOptions<MongoDbSettings> mongoDBSettings)
        {
            MongoClient client = new MongoClient(mongoDBSettings.Value.ConnectionURI);
            IMongoDatabase database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
            _blogCollection = database.GetCollection<BlogDocument>("blogs");
        }

        public async Task CreateAsync(BlogDocument blog) {
            await _blogCollection.InsertOneAsync(blog);
            return;
        }
    }
}
