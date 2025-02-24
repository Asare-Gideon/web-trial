import React from "react";
import Head from "next/head";

type Props = {
  title?: string;
  desc?: string;
  keywords?: string;
};

// "Template Blog and Ecommerce Store"
const defaultDesc =
  "Template Blog and Ecommerce Store.";
const defaultKeywords =
  "Template Blog and Ecommerce Store.";

const AppHeader: React.FC<Props> = ({
  title = "Template Blog and Ecommerce Store",
  desc = defaultDesc,
  keywords = defaultKeywords,
}) => {
  return (
    <Head>
      <title>{title}</title>

      <meta content={desc} name="description" key="description" />
      <meta
        name="twitter:description"
        content={desc}
        key="twitter_description"
      />
    </Head>
  );
};

export default AppHeader;
