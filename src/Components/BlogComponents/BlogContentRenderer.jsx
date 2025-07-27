import { BlogImage } from "./BlogImage";
import { PullQuote } from "./PullQuote";

const BlogContentRenderer = ({ contentBlocks }) => {
  if (!contentBlocks || contentBlocks.length === 0) {
    return <div className="text-gray-500 py-8">No content to display</div>;
  }

  return (
    <div className="blog-content space-y-6">
      {contentBlocks.map((block, index) => {
        switch (block.type) {
        case 'text':
            return (
              <div 
                key={index} 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: (block.content || '').replace(/\n/g, '<br />')
                }} 
              />
            );
            
          case 'image':
            return (
              <div key={index} className={`image-block ${block.layout} my-6`}>
                <BlogImage 
                  src={block.src} 
                  alt={block.alt || ''}
                  layout={block.layout}
                />
                {block.caption && (
                  <figcaption className="text-center text-sm italic text-gray-600 mt-2">
                    {block.caption}
                  </figcaption>
                )}
              </div>
            );
            
          case 'pull-quote':
            return <PullQuote key={index} text={block.content || ''} />;
            case 'side-by-side-images':
              return (
                <div key={`side-images-${index}`} className="my-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {block.images.map((image, imgIndex) => (
                      <div key={`side-image-${index}-${imgIndex}`} className="flex flex-col">
                        <BlogImage 
                          src={image.src} 
                          alt={image.alt || 'Blog image'}
                          className="w-full h-auto"
                        />
                        {image.caption && (
                          <figcaption className="text-center text-sm italic text-gray-600 mt-2">
                            {image.caption}
                          </figcaption>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );  
            
          default:
            return null;
        }
      })}
    </div>
  );
};

export default BlogContentRenderer;