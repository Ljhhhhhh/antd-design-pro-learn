import React from "react";
import { connect } from "dva";
// import { formatMessage } from "umi-plugin-react/locale";
import { ConnectProps, ConnectState } from "@/models/connect";

import Avatar from "./AvatarDropdown";
import SelectLang from "../SelectLang";
import styles from "./index.less";

export type SiderTheme = "light" | "dark";
export interface GlobalHeaderRightProps extends ConnectProps {
  theme?: SiderTheme;
  layout: "sidemenu" | "topmenu";
}

const GlobalHeaderRight: React.SFC<GlobalHeaderRightProps> = props => {
  const { theme, layout } = props;
  let className = styles.right;

  if (theme === "dark" && layout === "topmenu") {
    className = `${styles.right}  ${styles.dark}`;
  }

  return (
    <div className={className}>
      <Avatar menu={true} />
      <SelectLang className={styles.action} />
    </div>
  );
};

export default connect(({ settings }: ConnectState) => ({
  theme: settings.navTheme,
  layout: settings.layout
}))(GlobalHeaderRight);
