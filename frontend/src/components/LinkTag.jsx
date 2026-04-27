import "../styles/LinkTag.css";

function LinkTag({ name, link, position }) {
    const style = {
        left: `${position.x * 100}%`,
        top: `${position.y * 100}%`,
    };

    return (
        <a href={link} className="link-tag" style={style} title={name} target="_blank" rel="noopener noreferrer">
            <img src="/apparel.svg" alt={name} />
            <span className="link-tag-label">{name}</span>
        </a>
    );
}

export default LinkTag;