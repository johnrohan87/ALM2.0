import React, { useState } from "react";
import { Button } from "antd";

const ExpandableText = ({ text }) => {
    const [expanded, setExpanded] = useState(false);
    const isLongText = text.length > 100;
  
    if (!isLongText) {
      return <span>{text}</span>;
    }
  
    return (
      <div>
        <span>{expanded ? text : `${text.slice(0, 100)}...`}</span>
        <Button
          type="link"
          onClick={() => setExpanded(!expanded)}
          style={{ paddingLeft: 5 }}
        >
          {expanded ? "Show Less" : "Read More"}
        </Button>
      </div>
    );
  };
export default ExpandableText;