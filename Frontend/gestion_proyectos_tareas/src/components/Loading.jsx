import React from "react";
import ReactLoading from "react-loading";

export default function Loading({ color = "#2563eb", type = "spin" }) {
  return <ReactLoading type={type} color={color} />;
}