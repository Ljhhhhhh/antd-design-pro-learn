import React from "react";

import Avatar from "./AvatarDropdown";
import SelectLang from "../SelectLang";
import styles from "./index.less";


const GlobalHeaderRight: React.SFC = () => {
  let className = styles.right;
  return (
    <div className={className}>
      <Avatar menu={true} />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default GlobalHeaderRight
