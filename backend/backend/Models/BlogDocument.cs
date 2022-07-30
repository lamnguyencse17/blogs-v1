using backend.Services;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models
{
    public class BlogDocument
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; }
        public string Title { get; set; } = null!;
        [BsonElement("subTitle")]
        public string SubTitle { get; set; } = null!;
        public string Content { get; set; } = null!;
        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } = DateTime.Now;

        public async Task CreateBlogAsync(BlogService blogService, BlogDocument blogDocument)
        {
            await blogService.CreateAsyncBlog(blogDocument);
            return;
        }
    }
}
