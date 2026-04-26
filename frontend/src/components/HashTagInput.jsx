import { useState } from "react";
import useDidUpdateEffect from "../hooks/useDidUpdateEffect";
import HashTag from "./HashTag";
import "../styles/HashTagInput.css";

function HashTagInput({
  name,
  placeHolder,
  value,
  onChange,
  onBlur,
  onExisting,
  onRemoved,
  disabled,
  isEditOnRemove,
  onKeyUp,
  classNames,
}) {
  const [tags, setTags] = useState(value || []);

  useDidUpdateEffect(() => {
    onChange && onChange(tags);
  }, [tags]);

  useDidUpdateEffect(() => {
    if (JSON.stringify(value) !== JSON.stringify(tags)) {
      setTags(value);
    }
  }, [value]);

  const handleOnKeyUp = e => {
    e.stopPropagation();

    // Make sure it starts with a hashtag and has no spaces
    const currentValue = e.target.value.replace(" ", "");
    const formatted = currentValue.startsWith("#");
    const text = formatted ? currentValue : "#" + currentValue;

    if (
      !text &&
      tags.length &&
      e.key === "Backspace"
    ) {
      e.target.value = isEditOnRemove ? `${tags.at(-1)} ` : "";
      setTags([...tags.slice(0, -1)]);
    }

    if (text && "Enter" === e.key) {
      e.preventDefault();

      if (tags.includes(text)) {
        onExisting && onExisting(text);
        return;
      }
      setTags([...tags, text]);
      e.target.value = "";
    }
  };

  const onTagRemove = text => {
    setTags(tags.filter(tag => tag !== text));
    onRemoved && onRemoved(text);
  };

  return (
    <div className="rti--container" aria-labelledby={name}>
      {tags.map(tag => (
        <HashTag
          key={tag}
          className="rti--tag"
          text={tag}
          remove={onTagRemove}
          disabled={disabled}
        />
      ))}

      <input
        type="text"
        name={name}
        placeholder={placeHolder}
        onKeyDown={handleOnKeyUp}
        onBlur={onBlur}
        disabled={disabled}
        onKeyUp={onKeyUp}
        className="rti--input"
      />
    </div>
  );
};

export default HashTagInput;