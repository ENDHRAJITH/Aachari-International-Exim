"use client";

import dynamic from "next/dynamic";

const TradeNetworkLoader = dynamic(() => import("@/components/TradeNetwork"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 500, background: "#0b1220" }} />,
});

export default TradeNetworkLoader;