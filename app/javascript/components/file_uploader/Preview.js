import React from "react"

export default function Preview(props) {
  return <div
    className="box"
    style={{
      width: "100%",
      paddingTop: "100%",
      position: "relative"
    }}>
    <div
      className="media rounded"
      style={{
        position: "absolute",
        top: 0,
        height: "100%",
        width: "100%",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
      }}>
      <img
        src={props.file}
        className="img"
        style={{
          objectFit: "cover",
          minWidth: "100%",
          minHeight: "100%",
          width: "100%",
          height: "auto"
        }}
      />
    </div>
  </div>
}
