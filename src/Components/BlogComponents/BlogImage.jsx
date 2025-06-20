export const BlogImage = ({ 
  src, 
  alt, 
  layout = 'default', 
  caption, // Main caption (for single images or optional overall caption)
  leftCaption, // Specific caption for left image
  pairWith // Right image details (now including rightCaption)
}) => {
  return (
    <figure className={`blog-image ${layout}`}>
      {layout === 'sideBySide' && pairWith ? (
        <>
          <div className="side-by-side-container">
            <div className="image-pair">
              <div className="image-wrapper">
                <img src={src} alt={alt} />
                {leftCaption && <figcaption className="individual-caption">{leftCaption}</figcaption>}
              </div>
              <div className="image-wrapper">
                <img src={pairWith.src} alt={pairWith.alt} />
                {pairWith.caption && <figcaption className="individual-caption">{pairWith.caption}</figcaption>}
              </div>
            </div>
          </div>
          {caption && <figcaption className="main-caption">{caption}</figcaption>}
        </>
      ) : (
        <>
          <div className={`image-wrapper ${layout}`}>
            <img src={src} alt={alt} />
          </div>
          {caption && <figcaption>{caption}</figcaption>}
        </>
      )}
    </figure>
  );
};