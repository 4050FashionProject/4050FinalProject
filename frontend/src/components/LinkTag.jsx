import "../styles/LinkTag.css";

function LinkTag({ name, link, position, x, y }) {
    // Handle both position object and individual x,y props
    const xPos = position?.x ?? x ?? 0;
    const yPos = position?.y ?? y ?? 0;
    
    const style = {
        left: `${xPos * 100}%`,
        top: `${yPos * 100}%`,
    };

    return (
        <a href={link} className="link-tag" style={style} title={name} target="_blank" rel="noopener noreferrer">
            <img src="/apparel.svg" alt={name} />
            <span className="link-tag-label">{name}</span>
        </a>
    );
}

export default LinkTag;