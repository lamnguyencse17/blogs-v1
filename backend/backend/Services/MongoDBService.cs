using backend.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace backend.Services
{
    public class MongoDBService
    {
        public readonly IMongoDatabase Database;

        public MongoDBService(IOptions<MongoDbSettings> mongoDBSettings)
        {
            MongoClient client = new(mongoDBSettings.Value.ConnectionURI);
            Database = client.GetDatabase(mongoDBSettings.Value.DatabaseName);
        }
    }
}
